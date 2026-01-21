import {
    IsString,
    IsDateString,
    IsMongoId,
} from 'class-validator';

export class CreateReservaDto {
    @IsMongoId({ message: 'ID do cliente inválido' })
    clienteId: string;

    @IsMongoId({ message: 'ID do livro inválido' })
    livroId: string;

    @IsDateString({}, { message: 'Data prevista de devolução inválida' })
    dataPrevistaDevolucao: string;
}
