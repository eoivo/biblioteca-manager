export interface Livro {
    _id?: string;
    titulo: string;
    autor: string;
    isbn?: string;
    editora?: string;
    anoPublicacao?: number;
    categoria?: string;
    status: 'disponivel' | 'reservado';
    createdAt?: Date;
    updatedAt?: Date;
}

export interface CreateLivroDto {
    titulo: string;
    autor: string;
    isbn?: string;
    editora?: string;
    anoPublicacao?: number;
    categoria?: string;
}

export interface UpdateLivroDto extends Partial<CreateLivroDto> { }
