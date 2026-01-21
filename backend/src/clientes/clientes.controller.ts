import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Put,
    Delete,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { CreateClienteDto, UpdateClienteDto } from './dto';

@Controller('clientes')
export class ClientesController {
    constructor(private readonly clientesService: ClientesService) { }

    @Post()
    create(@Body() createClienteDto: CreateClienteDto) {
        return this.clientesService.create(createClienteDto);
    }

    @Get()
    findAll() {
        return this.clientesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.clientesService.findOne(id);
    }

    @Get('cpf/:cpf')
    findByCpf(@Param('cpf') cpf: string) {
        return this.clientesService.findByCpf(cpf);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateClienteDto: UpdateClienteDto) {
        return this.clientesService.update(id, updateClienteDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id') id: string) {
        return this.clientesService.remove(id);
    }
}
