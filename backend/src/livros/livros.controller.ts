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
import { LivrosService } from './livros.service';
import { CreateLivroDto, UpdateLivroDto } from './dto';

@Controller('livros')
export class LivrosController {
    constructor(private readonly livrosService: LivrosService) { }

    @Post()
    create(@Body() createLivroDto: CreateLivroDto) {
        return this.livrosService.create(createLivroDto);
    }

    @Get()
    findAll(
        @Query('q') q?: string,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10
    ) {
        return this.livrosService.findAll(q, +page, +limit);
    }

    @Get('disponiveis')
    findDisponiveis() {
        return this.livrosService.findDisponiveis();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.livrosService.findOne(id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateLivroDto: UpdateLivroDto) {
        return this.livrosService.update(id, updateLivroDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id') id: string) {
        return this.livrosService.remove(id);
    }
}
