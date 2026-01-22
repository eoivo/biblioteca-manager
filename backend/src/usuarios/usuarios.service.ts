import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Usuario, UsuarioDocument } from './usuario.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService implements OnModuleInit {
    constructor(
        @InjectModel(Usuario.name) private usuarioModel: Model<UsuarioDocument>
    ) { }

    async onModuleInit() {
        // Criar usuário admin padrão se não existir nenhum
        const count = await this.usuarioModel.countDocuments();
        if (count === 0) {
            const hashedSenha = await bcrypt.hash('admin123', 10);
            await this.usuarioModel.create({
                nome: 'Administrador',
                email: 'admin@biblioma.com.br',
                username: 'admin',
                senha: hashedSenha,
                role: 'admin'
            });
            console.log('✅ Usuário admin padrão criado: admin / admin123');
        }
    }

    async findByEmailOrUsername(identifier: string): Promise<UsuarioDocument | null> {
        return this.usuarioModel.findOne({
            $or: [
                { email: identifier },
                { username: identifier }
            ]
        }).exec();
    }

    async findById(id: string): Promise<UsuarioDocument | null> {
        return this.usuarioModel.findById(id).exec();
    }
}
