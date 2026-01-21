export interface Endereco {
    rua?: string;
    numero?: string;
    cidade?: string;
    estado?: string;
    cep?: string;
}

export interface Cliente {
    _id?: string;
    nome: string;
    cpf: string;
    email: string;
    telefone: string;
    endereco?: Endereco;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface CreateClienteDto {
    nome: string;
    cpf: string;
    email: string;
    telefone: string;
    endereco?: Endereco;
}

export interface UpdateClienteDto extends Partial<CreateClienteDto> { }
