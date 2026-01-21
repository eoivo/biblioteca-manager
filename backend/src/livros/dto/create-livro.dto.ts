import {
    IsString,
    IsOptional,
    IsNumber,
    Min,
    Max,
    MinLength,
    MaxLength,
} from 'class-validator';

export class CreateLivroDto {
    @IsString()
    @MinLength(1)
    @MaxLength(200)
    titulo: string;

    @IsString()
    autor: string;

    @IsOptional()
    @IsString()
    isbn?: string;

    @IsOptional()
    @IsString()
    editora?: string;

    @IsOptional()
    @IsNumber()
    @Min(1000)
    @Max(2100)
    anoPublicacao?: number;

    @IsOptional()
    @IsString()
    categoria?: string;
}
