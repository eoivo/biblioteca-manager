import { IsString, IsDateString, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReservaDto {
  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'ID do cliente que está fazendo a reserva',
  })
  @IsMongoId({ message: 'ID do cliente inválido' })
  clienteId: string;

  @ApiProperty({
    example: '507f191e810c19729de860ea',
    description: 'ID do livro a ser reservado',
  })
  @IsMongoId({ message: 'ID do livro inválido' })
  livroId: string;

  @ApiProperty({
    example: '2026-02-01T00:00:00.000Z',
    description: 'Data prevista para devolução do livro (formato ISO 8601)',
  })
  @IsDateString({}, { message: 'Data prevista de devolução inválida' })
  dataPrevistaDevolucao: string;
}
