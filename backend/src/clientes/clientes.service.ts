import {
    Injectable,
    NotFoundException,
    ConflictException,
    BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cliente, ClienteDocument } from './cliente.schema';
import { CreateClienteDto, UpdateClienteDto } from './dto';
import { isValidCpf, sanitizeCpf } from '../common/validators';

@Injectable()
export class ClientesService {
    constructor(
        @InjectModel(Cliente.name) private clienteModel: Model<ClienteDocument>,
    ) { }

    /**
     * Cria um novo cliente
     * RN001: Valida formato do CPF
     * RN002: Verifica unicidade do CPF
     */
    async create(createClienteDto: CreateClienteDto): Promise<Cliente> {
        const cpfLimpo = sanitizeCpf(createClienteDto.cpf);

        // RN001: Validar formato do CPF
        if (!isValidCpf(cpfLimpo)) {
            throw new BadRequestException('CPF inválido');
        }

        // RN002: Verificar se CPF já existe
        const existente = await this.clienteModel.findOne({ cpf: cpfLimpo }).exec();
        if (existente) {
            throw new ConflictException('CPF já cadastrado');
        }

        const cliente = new this.clienteModel({
            ...createClienteDto,
            cpf: cpfLimpo,
        });

        return cliente.save();
    }

    /**
     * Lista todos os clientes
     */
    async findAll(): Promise<Cliente[]> {
        return this.clienteModel.find().exec();
    }

    /**
     * Busca cliente por ID
     */
    async findOne(id: string): Promise<Cliente> {
        const cliente = await this.clienteModel.findById(id).exec();
        if (!cliente) {
            throw new NotFoundException(`Cliente com ID ${id} não encontrado`);
        }
        return cliente;
    }

    /**
     * Busca cliente por CPF
     */
    async findByCpf(cpf: string): Promise<Cliente> {
        const cpfLimpo = sanitizeCpf(cpf);
        const cliente = await this.clienteModel.findOne({ cpf: cpfLimpo }).exec();
        if (!cliente) {
            throw new NotFoundException(`Cliente com CPF ${cpf} não encontrado`);
        }
        return cliente;
    }

    /**
     * Atualiza um cliente
     * RN001: Valida formato do CPF se fornecido
     * RN002: Verifica unicidade do CPF se alterado
     */
    async update(id: string, updateClienteDto: UpdateClienteDto): Promise<Cliente> {
        const clienteExistente = await this.findOne(id);

        if (updateClienteDto.cpf) {
            const cpfLimpo = sanitizeCpf(updateClienteDto.cpf);

            // RN001: Validar formato do CPF
            if (!isValidCpf(cpfLimpo)) {
                throw new BadRequestException('CPF inválido');
            }

            // RN002: Verificar unicidade apenas se CPF mudou
            if (cpfLimpo !== (clienteExistente as any).cpf) {
                const duplicado = await this.clienteModel.findOne({ cpf: cpfLimpo }).exec();
                if (duplicado) {
                    throw new ConflictException('CPF já cadastrado por outro cliente');
                }
            }

            updateClienteDto.cpf = cpfLimpo;
        }

        const clienteAtualizado = await this.clienteModel
            .findByIdAndUpdate(id, updateClienteDto, { new: true })
            .exec();

        if (!clienteAtualizado) {
            throw new NotFoundException(`Cliente com ID ${id} não encontrado`);
        }

        return clienteAtualizado;
    }

    /**
     * Remove um cliente
     */
    async remove(id: string): Promise<void> {
        const result = await this.clienteModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new NotFoundException(`Cliente com ID ${id} não encontrado`);
        }
    }
}
