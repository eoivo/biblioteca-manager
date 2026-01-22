import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UsuarioDocument = Usuario & Document;

@Schema({
    timestamps: true,
    collection: 'usuarios',
})
export class Usuario {
    @Prop({ required: true })
    nome: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true, unique: true })
    username: string;

    @Prop({ required: true })
    senha: string;

    @Prop({ default: 'admin' })
    role: string;
}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);
