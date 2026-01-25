import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cliente, ClienteDocument } from '../clientes/cliente.schema';
import { Livro, LivroDocument, LivroStatus } from '../livros/livro.schema';
import { Reserva, ReservaDocument, ReservaStatus } from '../reservas/reserva.schema';
import { fakerPT_BR as faker } from '@faker-js/faker';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);

    const clienteModel = app.get<Model<ClienteDocument>>(getModelToken(Cliente.name));
    const livroModel = app.get<Model<LivroDocument>>(getModelToken(Livro.name));
    const reservaModel = app.get<Model<ReservaDocument>>(getModelToken(Reserva.name));

    console.log('🌱 Starting database seed...');

    // Clear existing data (optional, but keep it for a clean simulation)
    await clienteModel.deleteMany({});
    await livroModel.deleteMany({});
    await reservaModel.deleteMany({});
    console.log('🧹 Database cleared');

    // 1. Create Clientes
    const clientes: ClienteDocument[] = [];
    for (let i = 0; i < 30; i++) {
        const cliente = await clienteModel.create({
            nome: faker.person.fullName(),
            cpf: faker.string.numeric(11),
            email: faker.internet.email(),
            telefone: faker.string.numeric(11),
            dataNascimento: faker.date.birthdate({ min: 18, max: 70, mode: 'age' }),
            endereco: {
                rua: faker.location.street(),
                numero: faker.string.numeric(3),
                cidade: faker.location.city(),
                estado: faker.location.state({ abbreviated: true }),
                cep: faker.location.zipCode('########')
            }
        });
        clientes.push(cliente);
    }
    console.log(`✅ Created ${clientes.length} clientes`);

    // 2. Create Livros
    const categorias = ['Programação', 'Ficção', 'História', 'Tecnologia', 'Design', 'Autoajuda', 'Ciência'];
    const prefixos = ['O Segredo de', 'A Jornada em', 'O Mistério de', 'Crônicas de', 'O Guia de', 'A Arte de', 'Além de', 'O Despertar de'];
    const substantivos = ['Eternidade', 'Silício', 'Conhecimento', 'Destino', 'Algoritmos', 'Inovação', 'Liderança', 'Futuro'];

    const livros: LivroDocument[] = [];
    for (let i = 0; i < 50; i++) {
        const titulo = `${faker.helpers.arrayElement(prefixos)} ${faker.helpers.arrayElement(substantivos)}`;
        const livro = await livroModel.create({
            titulo: titulo,
            autor: faker.person.fullName(),
            isbn: faker.string.numeric(13),
            editora: faker.company.name(),
            anoPublicacao: faker.number.int({ min: 1990, max: 2024 }),
            categoria: faker.helpers.arrayElement(categorias),
            status: LivroStatus.DISPONIVEL
        });
        livros.push(livro);
    }
    console.log(`✅ Created ${livros.length} livros`);

    // 3. Create Reservas (Mix of Active, Overdue and Completed)
    const today = new Date();
    const reservas: ReservaDocument[] = [];

    // ACTIVE RESERVATIONS (Still in time)
    for (let i = 0; i < 15; i++) {
        const cliente = faker.helpers.arrayElement(clientes);
        const availableBooks = livros.filter(l => l.status === LivroStatus.DISPONIVEL);
        const livro = faker.helpers.arrayElement(availableBooks);

        if (!livro) continue;

        const dataReserva = faker.date.recent({ days: 3 });
        const dataPrevista = new Date(dataReserva);
        dataPrevista.setDate(dataPrevista.getDate() + 7);

        const reserva = await reservaModel.create({
            clienteId: (cliente as any)._id,
            livroId: (livro as any)._id,
            dataReserva,
            dataPrevistaDevolucao: dataPrevista,
            status: ReservaStatus.ATIVA
        });

        // Update book status
        await livroModel.findByIdAndUpdate((livro as any)._id, { status: LivroStatus.RESERVADO });
        livro.status = LivroStatus.RESERVADO;
        reservas.push(reserva);
    }

    // OVERDUE RESERVATIONS (Past due date)
    for (let i = 0; i < 8; i++) {
        const cliente = faker.helpers.arrayElement(clientes);
        const availableBooks = livros.filter(l => l.status === LivroStatus.DISPONIVEL);
        const livro = faker.helpers.arrayElement(availableBooks);

        if (!livro) continue;

        const dataReserva = faker.date.past({ years: 0.1 });
        const dataPrevista = new Date(dataReserva);
        dataPrevista.setDate(dataPrevista.getDate() + 5); // Should be very old

        // Force it to be overdue relative to today
        if (dataPrevista > today) {
            dataPrevista.setDate(today.getDate() - 5);
        }

        const reserva = await reservaModel.create({
            clienteId: (cliente as any)._id,
            livroId: (livro as any)._id,
            dataReserva,
            dataPrevistaDevolucao: dataPrevista,
            status: ReservaStatus.ATIVA
        });

        await livroModel.findByIdAndUpdate((livro as any)._id, { status: LivroStatus.RESERVADO });
        livro.status = LivroStatus.RESERVADO;
        reservas.push(reserva);
    }

    // COMPLETED RESERVATIONS (Correctly returned)
    for (let i = 0; i < 12; i++) {
        const cliente = faker.helpers.arrayElement(clientes);
        const livro = faker.helpers.arrayElement(livros); // Doesn't matter if book is currently reserved by someone else in this simulation logic setup

        const dataReserva = faker.date.past({ years: 0.2 });
        const dataPrevista = new Date(dataReserva);
        dataPrevista.setDate(dataPrevista.getDate() + 7);
        const dataDevolucao = new Date(dataPrevista);
        dataDevolucao.setDate(dataDevolucao.getDate() - 1);

        const reserva = await reservaModel.create({
            clienteId: (cliente as any)._id,
            livroId: (livro as any)._id,
            dataReserva,
            dataPrevistaDevolucao: dataPrevista,
            dataDevolucao,
            status: ReservaStatus.CONCLUIDA
        });
        reservas.push(reserva);
    }

    console.log(`✅ Created ${reservas.length} reservas simulated scenarios`);
    console.log('✨ Seed completed successfully!');

    await app.close();
    process.exit(0);
}

bootstrap().catch(err => {
    console.error('❌ Seed failed:', err);
    process.exit(1);
});
