import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ClienteDocument = Cliente & Document;

@Schema({
    timestamps: true,
    collection: 'clientes',
})
export class Cliente {
    @Prop({ required: true, minlength: 3, maxlength: 100 })
    nome: string;

    @Prop({ required: true, unique: true, length: 11 })
    cpf: string;

    @Prop({ required: true })
    email: string;

    @Prop({ required: true, minlength: 10, maxlength: 11 })
    telefone: string;

    @Prop({ type: Object })
    endereco?: {
        rua?: string;
        numero?: string;
        cidade?: string;
        estado?: string;
        cep?: string;
    };
}

export const ClienteSchema = SchemaFactory.createForClass(Cliente);
