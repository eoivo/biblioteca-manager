import {
  IsString,
  IsEmail,
  IsOptional,
  MinLength,
  MaxLength,
  Length,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class EnderecoDto {
  @ApiPropertyOptional({
    example: 'Rua das Flores',
    description: 'Nome da rua',
  })
  @IsOptional()
  @IsString()
  rua?: string;

  @ApiPropertyOptional({ example: '123', description: 'Número do endereço' })
  @IsOptional()
  @IsString()
  numero?: string;

  @ApiPropertyOptional({ example: 'São Paulo', description: 'Nome da cidade' })
  @IsOptional()
  @IsString()
  cidade?: string;

  @ApiPropertyOptional({ example: 'SP', description: 'Sigla do estado (UF)' })
  @IsOptional()
  @IsString()
  @Length(2, 2)
  estado?: string;

  @ApiPropertyOptional({
    example: '01310100',
    description: 'CEP sem pontuação',
  })
  @IsOptional()
  @IsString()
  @Length(8, 8)
  cep?: string;
}

export class CreateClienteDto {
  @ApiProperty({
    example: 'João Silva',
    description: 'Nome completo do cliente',
    minLength: 3,
    maxLength: 100,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  nome: string;

  @ApiProperty({
    example: '12345678901',
    description: 'CPF do cliente (11 dígitos sem pontuação)',
  })
  @IsString()
  @Length(11, 11, { message: 'CPF deve ter exatamente 11 dígitos' })
  cpf: string;

  @ApiProperty({
    example: 'joao.silva@email.com',
    description: 'Email do cliente',
  })
  @IsEmail({}, { message: 'Email inválido' })
  email: string;

  @ApiProperty({
    example: '11987654321',
    description: 'Telefone do cliente',
    minLength: 10,
  })
  @IsString()
  @MinLength(10)
  @MaxLength(11)
  telefone: string;

  @ApiPropertyOptional({
    type: EnderecoDto,
    description: 'Endereço completo do cliente',
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => EnderecoDto)
  endereco?: EnderecoDto;

  @ApiPropertyOptional({
    example: '1990-05-15',
    description: 'Data de nascimento do cliente (formato YYYY-MM-DD)',
  })
  @IsOptional()
  @IsString()
  dataNascimento?: string;
}
