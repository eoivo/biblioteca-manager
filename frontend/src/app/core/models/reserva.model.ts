import { Cliente } from './cliente.model';
import { Livro } from './livro.model';

export interface Multa {
    valorFixo: number;
    diasAtraso: number;
    valorTotal: number;
}

export interface Reserva {
    _id?: string;
    clienteId: string | Cliente;
    livroId: string | Livro;
    dataReserva: Date;
    dataPrevistaDevolucao: Date;
    dataDevolucao?: Date;
    status: 'ativa' | 'concluida' | 'atrasada';
    multa?: Multa;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface CreateReservaDto {
    clienteId: string;
    livroId: string;
    dataPrevistaDevolucao: string;
}
