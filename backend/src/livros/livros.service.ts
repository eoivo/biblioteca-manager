import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Livro, LivroDocument, LivroStatus } from './livro.schema';
import { CreateLivroDto, UpdateLivroDto } from './dto';

@Injectable()
export class LivrosService {
    constructor(
        @InjectModel(Livro.name) private livroModel: Model<LivroDocument>,
    ) { }

    /**
     * Cria um novo livro
     * Status inicial sempre 'disponivel'
     */
    async create(createLivroDto: CreateLivroDto): Promise<Livro> {
        const livro = new this.livroModel({
            ...createLivroDto,
            status: LivroStatus.DISPONIVEL,
        });
        return livro.save();
    }

    /**
     * Lista todos os livros
     */
    async findAll(): Promise<Livro[]> {
        return this.livroModel.find().exec();
    }

    /**
     * Lista apenas livros disponíveis
     * RN003: Apenas livros disponíveis podem ser reservados
     */
    async findDisponiveis(): Promise<Livro[]> {
        return this.livroModel.find({ status: LivroStatus.DISPONIVEL }).exec();
    }

    /**
     * Busca livro por ID
     */
    async findOne(id: string): Promise<Livro> {
        const livro = await this.livroModel.findById(id).exec();
        if (!livro) {
            throw new NotFoundException(`Livro com ID ${id} não encontrado`);
        }
        return livro;
    }

    /**
     * Atualiza um livro
     */
    async update(id: string, updateLivroDto: UpdateLivroDto): Promise<Livro> {
        const livro = await this.livroModel
            .findByIdAndUpdate(id, updateLivroDto, { new: true })
            .exec();

        if (!livro) {
            throw new NotFoundException(`Livro com ID ${id} não encontrado`);
        }
        return livro;
    }

    /**
     * Remove um livro
     * Verificar se não tem reservas ativas
     */
    async remove(id: string): Promise<void> {
        const livro = await this.findOne(id);

        // Verificar se livro está reservado
        if ((livro as any).status === LivroStatus.RESERVADO) {
            throw new BadRequestException('Não é possível excluir um livro com reserva ativa');
        }

        await this.livroModel.findByIdAndDelete(id).exec();
    }

    /**
     * Atualiza status do livro para reservado
     * Chamado pelo módulo de Reservas
     */
    async marcarComoReservado(id: string): Promise<Livro> {
        const livro = await this.findOne(id);

        if ((livro as any).status === LivroStatus.RESERVADO) {
            throw new BadRequestException('Livro já está reservado');
        }

        const updated = await this.livroModel
            .findByIdAndUpdate(id, { status: LivroStatus.RESERVADO }, { new: true })
            .exec();
        return updated!;
    }

    /**
     * Atualiza status do livro para disponível
     * Chamado ao concluir devolução
     */
    async marcarComoDisponivel(id: string): Promise<Livro> {
        const updated = await this.livroModel
            .findByIdAndUpdate(id, { status: LivroStatus.DISPONIVEL }, { new: true })
            .exec();
        return updated!;
    }
}
