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

class EnderecoDto {
    @IsOptional()
    @IsString()
    rua?: string;

    @IsOptional()
    @IsString()
    numero?: string;

    @IsOptional()
    @IsString()
    cidade?: string;

    @IsOptional()
    @IsString()
    @Length(2, 2)
    estado?: string;

    @IsOptional()
    @IsString()
    @Length(8, 8)
    cep?: string;
}

export class CreateClienteDto {
    @IsString()
    @MinLength(3)
    @MaxLength(100)
    nome: string;

    @IsString()
    @Length(11, 11, { message: 'CPF deve ter exatamente 11 dígitos' })
    cpf: string;

    @IsEmail({}, { message: 'Email inválido' })
    email: string;

    @IsString()
    @MinLength(10)
    @MaxLength(11)
    telefone: string;

    @IsOptional()
    @ValidateNested()
    @Type(() => EnderecoDto)
    endereco?: EnderecoDto;
}
