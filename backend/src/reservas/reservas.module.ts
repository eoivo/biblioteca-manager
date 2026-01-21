import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReservasController } from './reservas.controller';
import { ReservasService } from './reservas.service';
import { Reserva, ReservaSchema } from './reserva.schema';
import { LivrosModule } from '../livros/livros.module';
import { ClientesModule } from '../clientes/clientes.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Reserva.name, schema: ReservaSchema }]),
        LivrosModule,
        ClientesModule,
    ],
    controllers: [ReservasController],
    providers: [ReservasService],
    exports: [ReservasService],
})
export class ReservasModule { }
