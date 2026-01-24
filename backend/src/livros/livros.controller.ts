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
import { LivrosService } from './livros.service';
import { CreateLivroDto, UpdateLivroDto } from './dto';

@ApiTags('livros')
@Controller('livros')
export class LivrosController {
  constructor(private readonly livrosService: LivrosService) {}

  @Post()
  @ApiOperation({
    summary: 'Cadastrar novo livro',
    description: 'Adiciona um novo livro ao acervo',
  })
  @ApiResponse({ status: 201, description: 'Livro cadastrado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  create(@Body() createLivroDto: CreateLivroDto) {
    return this.livrosService.create(createLivroDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar livros',
    description: 'Retorna lista paginada de livros com filtro opcional',
  })
  @ApiQuery({
    name: 'q',
    required: false,
    description: 'Busca por título, autor ou ISBN',
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
  @ApiResponse({
    status: 200,
    description: 'Lista de livros retornada com sucesso',
  })
  findAll(
    @Query('q') q?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.livrosService.findAll(q, +page, +limit);
  }

  @Get('disponiveis')
  @ApiOperation({
    summary: 'Listar livros disponíveis',
    description: 'Retorna apenas livros disponíveis para reserva',
  })
  @ApiResponse({ status: 200, description: 'Lista de livros disponíveis' })
  findDisponiveis() {
    return this.livrosService.findDisponiveis();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar livro por ID',
    description: 'Retorna os dados completos de um livro específico',
  })
  @ApiParam({ name: 'id', description: 'ID do livro' })
  @ApiResponse({ status: 200, description: 'Livro encontrado' })
  @ApiResponse({ status: 404, description: 'Livro não encontrado' })
  findOne(@Param('id') id: string) {
    return this.livrosService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Atualizar livro',
    description: 'Atualiza os dados de um livro existente',
  })
  @ApiParam({ name: 'id', description: 'ID do livro' })
  @ApiResponse({ status: 200, description: 'Livro atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Livro não encontrado' })
  update(@Param('id') id: string, @Body() updateLivroDto: UpdateLivroDto) {
    return this.livrosService.update(id, updateLivroDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Remover livro',
    description: 'Remove um livro do acervo',
  })
  @ApiParam({ name: 'id', description: 'ID do livro' })
  @ApiResponse({ status: 204, description: 'Livro removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Livro não encontrado' })
  remove(@Param('id') id: string) {
    return this.livrosService.remove(id);
  }
}
