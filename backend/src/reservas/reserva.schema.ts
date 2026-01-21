import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Cliente } from '../clientes/cliente.schema';
import { Livro } from '../livros/livro.schema';

export type ReservaDocument = Reserva & Document;

export enum ReservaStatus {
    ATIVA = 'ativa',
    CONCLUIDA = 'concluida',
    ATRASADA = 'atrasada',
}

@Schema({
    timestamps: true,
    collection: 'reservas',
})
export class Reserva {
    @Prop({ type: Types.ObjectId, ref: 'Cliente', required: true })
    clienteId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Livro', required: true })
    livroId: Types.ObjectId;

    @Prop({ type: Date, default: Date.now })
    dataReserva: Date;

    @Prop({ type: Date, required: true })
    dataPrevistaDevolucao: Date;

    @Prop({ type: Date })
    dataDevolucao?: Date;

    @Prop({
        type: String,
        enum: ReservaStatus,
        default: ReservaStatus.ATIVA
    })
    status: ReservaStatus;

    @Prop({ type: Object })
    multa?: {
        valorFixo: number;
        diasAtraso: number;
        valorTotal: number;
    };
}

export const ReservaSchema = SchemaFactory.createForClass(Reserva);
