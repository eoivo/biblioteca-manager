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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { ReservasService } from './reservas.service';
import { CreateReservaDto, UpdateReservaDto } from './dto';

@ApiTags('reservas')
@Controller('reservas')
export class ReservasController {
  constructor(private readonly reservasService: ReservasService) {}

  @Post()
  @ApiOperation({
    summary: 'Criar nova reserva',
    description: 'Registra um novo empréstimo de livro para um cliente',
  })
  @ApiResponse({ status: 201, description: 'Reserva criada com sucesso' })
  @ApiResponse({
    status: 400,
    description: 'Livro indisponível ou dados inválidos',
  })
  create(@Body() createReservaDto: CreateReservaDto) {
    return this.reservasService.create(createReservaDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar reservas',
    description:
      'Retorna lista paginada de reservas com filtro opcional de status',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Número da página',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Itens por página',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Filtrar por status (ativa, concluida, atrasada)',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de reservas retornada com sucesso',
  })
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('status') status?: string,
  ) {
    return this.reservasService.findAll(+page, +limit, status);
  }

  @Get('atrasadas')
  @ApiOperation({
    summary: 'Listar reservas atrasadas',
    description: 'Retorna todas as reservas com devolução em atraso',
  })
  @ApiResponse({ status: 200, description: 'Lista de reservas atrasadas' })
  findAtrasadas() {
    return this.reservasService.findAtrasadas();
  }

  @Get('cliente/:id')
  @ApiOperation({
    summary: 'Buscar reservas por cliente',
    description: 'Retorna todas as reservas de um cliente específico',
  })
  @ApiParam({ name: 'id', description: 'ID do cliente' })
  @ApiResponse({ status: 200, description: 'Lista de reservas do cliente' })
  findByCliente(@Param('id') id: string) {
    return this.reservasService.findByCliente(id);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar reserva por ID',
    description: 'Retorna os dados completos de uma reserva específica',
  })
  @ApiParam({ name: 'id', description: 'ID da reserva' })
  @ApiResponse({ status: 200, description: 'Reserva encontrada' })
  @ApiResponse({ status: 404, description: 'Reserva não encontrada' })
  findOne(@Param('id') id: string) {
    return this.reservasService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Atualizar reserva',
    description: 'Atualiza os dados de uma reserva existente',
  })
  @ApiParam({ name: 'id', description: 'ID da reserva' })
  @ApiResponse({ status: 200, description: 'Reserva atualizada com sucesso' })
  @ApiResponse({ status: 404, description: 'Reserva não encontrada' })
  update(@Param('id') id: string, @Body() updateReservaDto: UpdateReservaDto) {
    return this.reservasService.update(id, updateReservaDto);
  }

  @Put(':id/devolver')
  @ApiOperation({
    summary: 'Devolver livro',
    description:
      'Registra a devolução de um livro e calcula multa se houver atraso',
  })
  @ApiParam({ name: 'id', description: 'ID da reserva' })
  @ApiResponse({ status: 200, description: 'Devolução registrada com sucesso' })
  @ApiResponse({ status: 404, description: 'Reserva não encontrada' })
  devolver(@Param('id') id: string) {
    return this.reservasService.devolver(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Remover reserva',
    description: 'Remove uma reserva do sistema',
  })
  @ApiParam({ name: 'id', description: 'ID da reserva' })
  @ApiResponse({ status: 204, description: 'Reserva removida com sucesso' })
  @ApiResponse({ status: 404, description: 'Reserva não encontrada' })
  remove(@Param('id') id: string) {
    return this.reservasService.remove(id);
  }
}
