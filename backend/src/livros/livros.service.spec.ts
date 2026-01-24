import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { LivrosService } from './livros.service';
import { Livro, LivroStatus } from './livro.schema';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('LivrosService', () => {
  let service: LivrosService;

  const mockLivro = {
    _id: '507f1f77bcf86cd799439011',
    titulo: 'Clean Code',
    autor: 'Robert C. Martin',
    isbn: '9780132350884',
    status: LivroStatus.DISPONIVEL,
  };

  const mockLivroModel = {
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    countDocuments: jest.fn(),
  };

  const MockModel = jest.fn().mockImplementation((data) => ({
    ...data,
    save: jest.fn().mockResolvedValue({ ...mockLivro, ...data }),
  }));
  MockModel.find = mockLivroModel.find;
  MockModel.findById = mockLivroModel.findById;
  MockModel.findByIdAndUpdate = mockLivroModel.findByIdAndUpdate;
  MockModel.findByIdAndDelete = mockLivroModel.findByIdAndDelete;
  MockModel.countDocuments = mockLivroModel.countDocuments;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LivrosService,
        {
          provide: getModelToken(Livro.name),
          useValue: MockModel,
        },
      ],
    }).compile();

    service = module.get<LivrosService>(LivrosService);
    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('deve criar livro com status disponível por padrão', async () => {
      const createDto = {
        titulo: 'Clean Code',
        autor: 'Robert C. Martin',
      };

      const result = await service.create(createDto);

      expect(result.status).toBe(LivroStatus.DISPONIVEL);
    });
  });

  describe('findAll', () => {
    it('deve retornar array de livros', async () => {
      const mockChain = {
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([mockLivro]),
      };
      mockLivroModel.find.mockReturnValue(mockChain);
      jest.spyOn(mockLivroModel as any, 'countDocuments').mockReturnValue({
        exec: jest.fn().mockResolvedValue(1),
      });

      const result = await service.findAll();

      expect(result.items).toBeDefined();
      expect(Array.isArray(result.items)).toBe(true);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
    });
  });

  describe('findDisponiveis', () => {
    it('deve listar apenas livros disponíveis (RN003)', async () => {
      mockLivroModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue([mockLivro]),
      });

      const result = await service.findDisponiveis();

      expect(mockLivroModel.find).toHaveBeenCalledWith({
        status: LivroStatus.DISPONIVEL,
      });
    });
  });

  describe('findOne', () => {
    it('deve retornar livro por ID', async () => {
      mockLivroModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockLivro),
      });

      const result = await service.findOne('507f1f77bcf86cd799439011');

      expect(result.titulo).toBe('Clean Code');
    });

    it('deve lançar NotFoundException para ID inexistente', async () => {
      mockLivroModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.findOne('invalidId')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('deve impedir exclusão de livro com reserva ativa', async () => {
      const livroReservado = { ...mockLivro, status: LivroStatus.RESERVADO };
      mockLivroModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(livroReservado),
      });

      await expect(service.remove('507f1f77bcf86cd799439011')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('deve remover livro disponível', async () => {
      mockLivroModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockLivro),
      });
      mockLivroModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockLivro),
      });

      await expect(
        service.remove('507f1f77bcf86cd799439011'),
      ).resolves.toBeUndefined();
    });
  });

  describe('marcarComoReservado', () => {
    it('deve atualizar status para reservado', async () => {
      mockLivroModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockLivro),
      });
      mockLivroModel.findByIdAndUpdate.mockReturnValue({
        exec: jest
          .fn()
          .mockResolvedValue({ ...mockLivro, status: LivroStatus.RESERVADO }),
      });

      const result = await service.marcarComoReservado(
        '507f1f77bcf86cd799439011',
      );

      expect(result.status).toBe(LivroStatus.RESERVADO);
    });

    it('deve rejeitar se livro já está reservado', async () => {
      const livroReservado = { ...mockLivro, status: LivroStatus.RESERVADO };
      mockLivroModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(livroReservado),
      });

      await expect(
        service.marcarComoReservado('507f1f77bcf86cd799439011'),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
