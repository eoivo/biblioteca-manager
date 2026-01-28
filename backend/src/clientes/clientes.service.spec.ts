import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ClientesService } from './clientes.service';
import { Cliente } from './cliente.schema';
import {
  ConflictException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';

describe('ClientesService', () => {
  let service: ClientesService;
  let mockClienteModel: any;

  const mockCliente = {
    _id: '507f1f77bcf86cd799439011',
    nome: 'João Silva',
    cpf: '52998224725',
    email: 'joao@email.com',
    telefone: '11999999999',
  };

  beforeEach(async () => {
    mockClienteModel = {
      findOne: jest.fn(),
      find: jest.fn(),
      findById: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn(),
      countDocuments: jest.fn(),
      save: jest.fn(),
    };

    // Mock para new this.clienteModel()
    const MockModel: any = jest.fn().mockImplementation((data) => ({
      ...data,
      save: jest.fn().mockResolvedValue({ ...mockCliente, ...data }),
    }));
    MockModel.findOne = mockClienteModel.findOne;
    MockModel.find = mockClienteModel.find;
    MockModel.findById = mockClienteModel.findById;
    MockModel.findByIdAndUpdate = mockClienteModel.findByIdAndUpdate;
    MockModel.findByIdAndDelete = mockClienteModel.findByIdAndDelete;
    MockModel.countDocuments = mockClienteModel.countDocuments;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientesService,
        {
          provide: getModelToken(Cliente.name),
          useValue: MockModel,
        },
      ],
    }).compile();

    service = module.get<ClientesService>(ClientesService);
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('deve criar cliente com dados válidos', async () => {
      mockClienteModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const createDto = {
        nome: 'João Silva',
        cpf: '52998224725',
        email: 'joao@email.com',
        telefone: '11999999999',
      };

      const result = await service.create(createDto);

      expect(result.cpf).toBe('52998224725');
      expect(result.nome).toBe('João Silva');
    });

    it('deve rejeitar CPF inválido (RN001)', async () => {
      const createDto = {
        nome: 'João Silva',
        cpf: '11111111111', // CPF inválido
        email: 'joao@email.com',
        telefone: '11999999999',
      };

      await expect(service.create(createDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('deve rejeitar CPF duplicado (RN002)', async () => {
      mockClienteModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockCliente),
      });

      const createDto = {
        nome: 'Maria Silva',
        cpf: '52998224725', // CPF já existe
        email: 'maria@email.com',
        telefone: '11888888888',
      };

      await expect(service.create(createDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('findAll', () => {
    it('deve retornar array de clientes', async () => {
      const mockChain = {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([mockCliente]),
      };
      mockClienteModel.find.mockReturnValue(mockChain);
      jest.spyOn(mockClienteModel as any, 'countDocuments').mockReturnValue({
        exec: jest.fn().mockResolvedValue(1),
      });

      const result = await service.findAll();

      expect(result.items).toBeDefined();
      expect(Array.isArray(result.items)).toBe(true);
      expect(result.items).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
    });
  });

  describe('findOne', () => {
    it('deve retornar cliente por ID', async () => {
      mockClienteModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockCliente),
      });

      const result = await service.findOne('507f1f77bcf86cd799439011');

      expect(result.nome).toBe('João Silva');
    });

    it('deve lançar NotFoundException para ID inexistente', async () => {
      mockClienteModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.findOne('invalidId')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('deve atualizar cliente mantendo mesmo CPF', async () => {
      mockClienteModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockCliente),
      });
      mockClienteModel.findByIdAndUpdate.mockReturnValue({
        exec: jest
          .fn()
          .mockResolvedValue({ ...mockCliente, nome: 'João Santos' }),
      });

      const result = await service.update('507f1f77bcf86cd799439011', {
        nome: 'João Santos',
      });

      expect(result.nome).toBe('João Santos');
    });

    it('deve rejeitar atualização para CPF de outro cliente (RN002)', async () => {
      const outroCliente = {
        ...mockCliente,
        _id: 'outroId',
        cpf: '11144477735',
      };

      mockClienteModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockCliente),
      });
      mockClienteModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(outroCliente),
      });

      await expect(
        service.update('507f1f77bcf86cd799439011', { cpf: '11144477735' }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('remove', () => {
    it('deve remover cliente existente', async () => {
      mockClienteModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockCliente),
      });

      await expect(
        service.remove('507f1f77bcf86cd799439011'),
      ).resolves.toBeUndefined();
    });

    it('deve lançar NotFoundException para ID inexistente', async () => {
      mockClienteModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.remove('invalidId')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
