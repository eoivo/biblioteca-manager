import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LivroDocument = Livro & Document;

export enum LivroStatus {
    DISPONIVEL = 'disponivel',
    RESERVADO = 'reservado',
}

@Schema({
    timestamps: true,
    collection: 'livros',
})
export class Livro {
    @Prop({ required: true, minlength: 1, maxlength: 200 })
    titulo: string;

    @Prop({ required: true })
    autor: string;

    @Prop({ unique: true, sparse: true })
    isbn?: string;

    @Prop()
    editora?: string;

    @Prop({ min: 1000, max: 2100 })
    anoPublicacao?: number;

    @Prop()
    categoria?: string;

    @Prop({
        type: String,
        enum: LivroStatus,
        default: LivroStatus.DISPONIVEL
    })
    status: LivroStatus;
}

export const LivroSchema = SchemaFactory.createForClass(Livro);
