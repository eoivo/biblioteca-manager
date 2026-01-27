import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cliente, ClienteDocument } from '../clientes/cliente.schema';
import { Livro, LivroDocument } from '../livros/livro.schema';
import { Reserva, ReservaDocument } from '../reservas/reserva.schema';
import { Usuario, UsuarioDocument } from '../usuarios/usuario.schema';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);

    const clienteModel = app.get<Model<ClienteDocument>>(getModelToken(Cliente.name));
    const livroModel = app.get<Model<LivroDocument>>(getModelToken(Livro.name));
    const reservaModel = app.get<Model<ReservaDocument>>(getModelToken(Reserva.name));
    const usuarioModel = app.get<Model<UsuarioDocument>>(getModelToken(Usuario.name));

    console.log('🧹 Iniciando limpeza do banco de dados...');

    try {
        // Remove todas as reservas
        const resCount = await reservaModel.deleteMany({});
        console.log(`✅ Reservas removidas: ${resCount.deletedCount}`);

        // Remove todos os livros
        const livroCount = await livroModel.deleteMany({});
        console.log(`✅ Livros removidos: ${livroCount.deletedCount}`);

        // Remove todos os clientes
        const clienteCount = await clienteModel.deleteMany({});
        console.log(`✅ Clientes removidos: ${clienteCount.deletedCount}`);

        // Remove usuários que não são admin
        // Mantemos o usuário com username 'admin' ou role 'admin'
        const userCount = await usuarioModel.deleteMany({
            username: { $ne: 'admin' },
            role: { $ne: 'admin' }
        });
        console.log(`✅ Usuários (não-admin) removidos: ${userCount.deletedCount}`);

        console.log('✨ Limpeza concluída com sucesso!');
    } catch (error) {
        console.error('❌ Erro durante a limpeza:', error);
    } finally {
        await app.close();
        process.exit(0);
    }
}

bootstrap().catch(err => {
    console.error('❌ Falha crítica no script de limpeza:', err);
    process.exit(1);
});
