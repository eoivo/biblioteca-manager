import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { Reserva, ReservaDocument, ReservaStatus } from './reserva.schema';
import { CreateReservaDto, UpdateReservaDto } from './dto';
import { LivrosService } from '../livros/livros.service';
import { ClientesService } from '../clientes/clientes.service';

@Injectable()
export class ReservasService {
  private readonly MULTA_VALOR_FIXO: number;
  private readonly MULTA_PERCENTUAL_DIA: number;

  constructor(
    @InjectModel(Reserva.name) private reservaModel: Model<ReservaDocument>,
    private livrosService: LivrosService,
    private clientesService: ClientesService,
    private configService: ConfigService,
  ) {
    this.MULTA_VALOR_FIXO = parseFloat(
      this.configService.get('MULTA_VALOR_FIXO', '10'),
    );
    this.MULTA_PERCENTUAL_DIA = parseFloat(
      this.configService.get('MULTA_PERCENTUAL_DIA', '0.05'),
    );
  }

  /**
   * Cria uma nova reserva
   * RN003: Verifica se livro está disponível e atualiza status
   */
  async create(createReservaDto: CreateReservaDto): Promise<Reserva> {
    // Verificar se cliente existe
    await this.clientesService.findOne(createReservaDto.clienteId);

    // RN003: Verificar se livro está disponível e marcar como reservado
    await this.livrosService.marcarComoReservado(createReservaDto.livroId);

    const reserva = new this.reservaModel({
      clienteId: new Types.ObjectId(createReservaDto.clienteId),
      livroId: new Types.ObjectId(createReservaDto.livroId),
      dataPrevistaDevolucao: new Date(createReservaDto.dataPrevistaDevolucao),
      status: ReservaStatus.ATIVA,
    });

    return reserva.save();
  }

  /**
   * Lista todas as reservas com dados populados e suporte a filtros/paginação
   */
  async findAll(
    page: number = 1,
    limit: number = 10,
    status?: string,
  ): Promise<{ items: any[]; total: number; page: number; limit: number }> {
    const skip = (page - 1) * limit;
    const query: any = {};

    if (status === 'atrasada') {
      // RN005: Atrasadas são Ativas com data vencida
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);

      query.status = ReservaStatus.ATIVA;
      query.dataPrevistaDevolucao = { $lt: hoje };
    } else if (status) {
      query.status = status;
    }

    const [rawItems, total] = await Promise.all([
      this.reservaModel
        .find(query)
        .skip(skip)
        .limit(limit)
        .populate('clienteId', 'nome cpf')
        .populate('livroId', 'titulo autor')
        .exec(),
      this.reservaModel.countDocuments(query).exec(),
    ]);

    const items = rawItems.map((r) => this.calcularMultaSeAtrasada(r));
    return { items, total, page, limit };
  }

  /**
   * Lista apenas reservas atrasadas (RN005)
   */
  async findAtrasadas(): Promise<any[]> {
    const reservas = await this.reservaModel
      .find({ status: { $in: [ReservaStatus.ATIVA, ReservaStatus.ATRASADA] } })
      .populate('clienteId', 'nome cpf')
      .populate('livroId', 'titulo autor')
      .exec();

    return reservas
      .map((r) => this.calcularMultaSeAtrasada(r))
      .filter((r) => r.status === ReservaStatus.ATRASADA);
  }

  /**
   * Lista reservas de um cliente específico
   */
  async findByCliente(clienteId: string): Promise<any[]> {
    const reservas = await this.reservaModel
      .find({ clienteId: new Types.ObjectId(clienteId) })
      .populate('livroId', 'titulo autor')
      .exec();

    return reservas.map((r) => this.calcularMultaSeAtrasada(r));
  }

  /**
   * Busca reserva por ID
   */
  async findOne(id: string): Promise<any> {
    const reserva = await this.reservaModel
      .findById(id)
      .populate('clienteId', 'nome cpf email telefone')
      .populate('livroId', 'titulo autor isbn')
      .exec();

    if (!reserva) {
      throw new NotFoundException(`Reserva com ID ${id} não encontrada`);
    }

    return this.calcularMultaSeAtrasada(reserva);
  }

  /**
   * Atualiza uma reserva
   */
  async update(
    id: string,
    updateReservaDto: UpdateReservaDto,
  ): Promise<Reserva> {
    const reserva = await this.reservaModel
      .findByIdAndUpdate(id, updateReservaDto, { new: true })
      .exec();

    if (!reserva) {
      throw new NotFoundException(`Reserva com ID ${id} não encontrada`);
    }
    return reserva;
  }

  /**
   * Remove uma reserva
   */
  async remove(id: string): Promise<void> {
    const reserva = await this.findOne(id);

    // Se a reserva está ativa, liberar o livro
    if (
      reserva.status === ReservaStatus.ATIVA ||
      reserva.status === ReservaStatus.ATRASADA
    ) {
      await this.livrosService.marcarComoDisponivel(
        reserva.livroId._id?.toString() || reserva.livroId.toString(),
      );
    }

    await this.reservaModel.findByIdAndDelete(id).exec();
  }

  /**
   * Concluir devolução do livro
   * Atualiza status do livro para disponível
   */
  async devolver(id: string): Promise<Reserva> {
    const reserva = await this.findOne(id);

    if (reserva.status === ReservaStatus.CONCLUIDA) {
      throw new BadRequestException('Reserva já foi concluída');
    }

    // Liberar livro
    await this.livrosService.marcarComoDisponivel(
      reserva.livroId._id?.toString() || reserva.livroId.toString(),
    );

    // Atualizar reserva
    const updated = await this.reservaModel
      .findByIdAndUpdate(
        id,
        {
          status: ReservaStatus.CONCLUIDA,
          dataDevolucao: new Date(),
          multa: reserva.multa,
        },
        { new: true },
      )
      .exec();

    return updated!;
  }

  /**
   * RN004: Calcula multa por atraso
   * Fórmula: MultaTotal = ValorFixo + (ValorFixo × 0,05 × DiasAtraso)
   *
   * RN005: Identifica se reserva está atrasada
   */
  private calcularMultaSeAtrasada(reserva: any): any {
    const reservaObj = reserva.toObject ? reserva.toObject() : reserva;

    // Usar UTC para evitar problemas de fuso horário
    const agora = new Date();
    const hojeUTC = Date.UTC(agora.getFullYear(), agora.getMonth(), agora.getDate());

    const dataPrevistaOriginal = new Date(reservaObj.dataPrevistaDevolucao);
    const dataPrevistaUTC = Date.UTC(
      dataPrevistaOriginal.getUTCFullYear(),
      dataPrevistaOriginal.getUTCMonth(),
      dataPrevistaOriginal.getUTCDate()
    );

    // Se já está concluída, retornar como está
    if (reservaObj.status === ReservaStatus.CONCLUIDA) {
      return reservaObj;
    }

    // RN005: Verificar se está atrasada
    if (hojeUTC > dataPrevistaUTC) {
      const diffTime = hojeUTC - dataPrevistaUTC;
      // Usar Math.floor para contar apenas dias completos de atraso
      const diasAtraso = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      // RN004: Calcular multa
      // Multa = ValorFixo + (ValorFixo × 0,05 × DiasAtraso)
      const valorTotal =
        this.MULTA_VALOR_FIXO +
        this.MULTA_VALOR_FIXO * this.MULTA_PERCENTUAL_DIA * diasAtraso;

      return {
        ...reservaObj,
        status: ReservaStatus.ATRASADA,
        multa: {
          valorFixo: this.MULTA_VALOR_FIXO,
          diasAtraso,
          valorTotal: Math.round(valorTotal * 100) / 100, // Arredondar para 2 casas
        },
      };
    }

    // Não está atrasada
    return {
      ...reservaObj,
      multa: null,
    };
  }

  /**
   * Cálculo de multa estático para testes
   * RN004: Multa = ValorFixo + (ValorFixo × 0,05 × DiasAtraso)
   */
  calcularMulta(diasAtraso: number): number {
    if (diasAtraso <= 0) {
      return this.MULTA_VALOR_FIXO;
    }
    return (
      this.MULTA_VALOR_FIXO +
      this.MULTA_VALOR_FIXO * this.MULTA_PERCENTUAL_DIA * diasAtraso
    );
  }

  /**
   * Gera relatório de caixa em formato CSV
   */
  async gerarRelatorioCaixa(
    dataInicio?: string,
    dataFim?: string,
  ): Promise<string> {
    const query: any = {};

    // Filtrar por período se fornecido
    if (dataInicio || dataFim) {
      query.createdAt = {};
      if (dataInicio) {
        query.createdAt.$gte = new Date(dataInicio);
      }
      if (dataFim) {
        const fim = new Date(dataFim);
        fim.setHours(23, 59, 59, 999);
        query.createdAt.$lte = fim;
      }
    }

    const reservas = await this.reservaModel
      .find(query)
      .populate('clienteId', 'nome cpf')
      .populate('livroId', 'titulo')
      .sort({ createdAt: -1 })
      .exec();

    // Cabeçalho CSV
    const header =
      'Data Reserva,Cliente,CPF,Livro,Data Prevista,Data Devolução,Status,Dias Atraso,Valor Multa';

    let totalMultas = 0;
    const rows = reservas.map((reserva) => {
      const reservaComMulta = this.calcularMultaSeAtrasada(reserva);
      const valorMulta = reservaComMulta.multa?.valorTotal || 0;
      totalMultas += valorMulta;

      const dataReserva = new Date(
        (reserva as any).createdAt,
      ).toLocaleDateString('pt-BR');
      const clienteNome = (reserva.clienteId as any)?.nome || 'N/A';
      const clienteCpf = (reserva.clienteId as any)?.cpf || 'N/A';
      const livroTitulo = (reserva.livroId as any)?.titulo || 'N/A';
      const dataPrevista = new Date(
        reserva.dataPrevistaDevolucao,
      ).toLocaleDateString('pt-BR');
      const dataDevolucao = reserva.dataDevolucao
        ? new Date(reserva.dataDevolucao).toLocaleDateString('pt-BR')
        : '-';
      const diasAtraso = reservaComMulta.multa?.diasAtraso || 0;
      const valorFormatado = `R$ ${valorMulta.toFixed(2).replace('.', ',')}`;

      return `${dataReserva},${clienteNome},${clienteCpf},"${livroTitulo}",${dataPrevista},${dataDevolucao},${reservaComMulta.status},${diasAtraso},${valorFormatado}`;
    });

    // Linha de total
    const totalFormatado = `R$ ${totalMultas.toFixed(2).replace('.', ',')}`;
    rows.push(`,,,,,,Total:,,${totalFormatado}`);

    return [header, ...rows].join('\n');
  }
}
