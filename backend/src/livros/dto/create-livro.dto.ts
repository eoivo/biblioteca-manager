import {
  IsString,
  IsOptional,
  IsNumber,
  Min,
  Max,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateLivroDto {
  @ApiProperty({
    example: 'Dom Casmurro',
    description: 'Título do livro',
    minLength: 1,
    maxLength: 200,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  titulo: string;

  @ApiProperty({ example: 'Machado de Assis', description: 'Nome do autor' })
  @IsString()
  autor: string;

  @ApiPropertyOptional({
    example: '978-3-16-148410-0',
    description: 'Código ISBN do livro',
  })
  @IsOptional()
  @IsString()
  isbn?: string;

  @ApiPropertyOptional({
    example: 'Companhia das Letras',
    description: 'Nome da editora',
  })
  @IsOptional()
  @IsString()
  editora?: string;

  @ApiPropertyOptional({
    example: 1899,
    description: 'Ano de publicação',
    minimum: 1000,
    maximum: 2100,
  })
  @IsOptional()
  @IsNumber()
  @Min(1000)
  @Max(2100)
  anoPublicacao?: number;

  @ApiPropertyOptional({
    example: 'Romance',
    description: 'Categoria ou gênero do livro',
  })
  @IsOptional()
  @IsString()
  categoria?: string;
}
