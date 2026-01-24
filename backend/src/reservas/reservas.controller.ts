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
    Query,
} from '@nestjs/common';
import { ReservasService } from './reservas.service';
import { CreateReservaDto, UpdateReservaDto } from './dto';

@Controller('reservas')
export class ReservasController {
    constructor(private readonly reservasService: ReservasService) { }

    @Post()
    create(@Body() createReservaDto: CreateReservaDto) {
        return this.reservasService.create(createReservaDto);
    }

    @Get()
    findAll(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Query('status') status?: string
    ) {
        return this.reservasService.findAll(+page, +limit, status);
    }

    @Get('atrasadas')
    findAtrasadas() {
        return this.reservasService.findAtrasadas();
    }

    @Get('cliente/:id')
    findByCliente(@Param('id') id: string) {
        return this.reservasService.findByCliente(id);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.reservasService.findOne(id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateReservaDto: UpdateReservaDto) {
        return this.reservasService.update(id, updateReservaDto);
    }

    @Put(':id/devolver')
    devolver(@Param('id') id: string) {
        return this.reservasService.devolver(id);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id') id: string) {
        return this.reservasService.remove(id);
    }
}
