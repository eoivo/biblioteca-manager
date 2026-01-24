import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';
import { ReservasService } from './reservas.service';
import { Reserva, ReservaStatus } from './reserva.schema';
import { LivrosService } from '../livros/livros.service';
import { ClientesService } from '../clientes/clientes.service';
import { LivroStatus } from '../livros/livro.schema';

describe('ReservasService', () => {
  let service: ReservasService;
  let mockReservaModel: any;
  let mockLivrosService: any;
  let mockClientesService: any;
  let mockConfigService: any;

  const mockClienteId = new Types.ObjectId();
  const mockLivroId = new Types.ObjectId();

  const mockReserva = {
    _id: new Types.ObjectId(),
    clienteId: mockClienteId,
    livroId: mockLivroId,
    dataPrevistaDevolucao: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias no futuro
    status: ReservaStatus.ATIVA,
    dataDevolucao: null,
    multa: null,
    toObject: function () {
      return { ...this };
    },
  };

  beforeEach(async () => {
    mockReservaModel = {
      find: jest.fn(),
      findById: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn(),
      countDocuments: jest.fn(),
    };

    const MockModel: any = jest.fn().mockImplementation((data) => ({
      ...data,
      save: jest.fn().mockResolvedValue({ ...mockReserva, ...data }),
    }));
    MockModel.find = mockReservaModel.find;
    MockModel.findById = mockReservaModel.findById;
    MockModel.findByIdAndUpdate = mockReservaModel.findByIdAndUpdate;
    MockModel.findByIdAndDelete = mockReservaModel.findByIdAndDelete;
    MockModel.countDocuments = mockReservaModel.countDocuments;

    mockLivrosService = {
      findOne: jest.fn(),
      marcarComoReservado: jest.fn(),
      marcarComoDisponivel: jest.fn(),
    };

    mockClientesService = {
      findOne: jest.fn(),
    };

    mockConfigService = {
      get: jest.fn((key, defaultValue) => {
        if (key === 'MULTA_VALOR_FIXO') return '10';
        if (key === 'MULTA_PERCENTUAL_DIA') return '0.05';
        return defaultValue;
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservasService,
        {
          provide: getModelToken(Reserva.name),
          useValue: MockModel,
        },
        {
          provide: LivrosService,
          useValue: mockLivrosService,
        },
        {
          provide: ClientesService,
          useValue: mockClientesService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<ReservasService>(ReservasService);
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('deve criar reserva com status ATIVA (RN003)', async () => {
      const createDto = {
        clienteId: mockClienteId.toString(),
        livroId: mockLivroId.toString(),
        dataPrevistaDevolucao: '2026-02-01',
      };

      mockClientesService.findOne.mockResolvedValue({
        _id: mockClienteId,
        nome: 'João Silva',
      });
      mockLivrosService.marcarComoReservado.mockResolvedValue({
        _id: mockLivroId,
        status: LivroStatus.RESERVADO,
      });

      const result = await service.create(createDto);

      expect(result.status).toBe(ReservaStatus.ATIVA);
      expect(mockLivrosService.marcarComoReservado).toHaveBeenCalledWith(
        createDto.livroId,
      );
    });

    it('deve validar se cliente existe antes de criar reserva', async () => {
      const createDto = {
        clienteId: 'invalid-id',
        livroId: mockLivroId.toString(),
        dataPrevistaDevolucao: '2026-02-01',
      };

      mockClientesService.findOne.mockRejectedValue(
        new NotFoundException('Cliente não encontrado'),
      );

      await expect(service.create(createDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockLivrosService.marcarComoReservado).not.toHaveBeenCalled();
    });

    it('deve falhar se livro não está disponível (RN003)', async () => {
      const createDto = {
        clienteId: mockClienteId.toString(),
        livroId: mockLivroId.toString(),
        dataPrevistaDevolucao: '2026-02-01',
      };

      mockClientesService.findOne.mockResolvedValue({ _id: mockClienteId });
      mockLivrosService.marcarComoReservado.mockRejectedValue(
        new BadRequestException('Livro não está disponível'),
      );

      await expect(service.create(createDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll', () => {
    it('deve retornar lista de reservas com paginação', async () => {
      const mockChain = {
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([mockReserva]),
      };
      mockReservaModel.find.mockReturnValue(mockChain);
      mockReservaModel.countDocuments.mockReturnValue({
        exec: jest.fn().mockResolvedValue(1),
      });

      const result = await service.findAll(1, 10);

      expect(result.items).toBeDefined();
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
    });

    it('deve filtrar por status quando fornecido', async () => {
      const mockChain = {
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([mockReserva]),
      };
      mockReservaModel.find.mockReturnValue(mockChain);
      mockReservaModel.countDocuments.mockReturnValue({
        exec: jest.fn().mockResolvedValue(1),
      });

      await service.findAll(1, 10, ReservaStatus.ATIVA);

      expect(mockReservaModel.find).toHaveBeenCalledWith({
        status: ReservaStatus.ATIVA,
      });
    });
  });

  describe('findAtrasadas', () => {
    it('deve retornar apenas reservas atrasadas (RN005)', async () => {
      const reservaAtrasada = {
        ...mockReserva,
        dataPrevistaDevolucao: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 dias atrás
        status: ReservaStatus.ATIVA,
        toObject: function () {
          return { ...this };
        },
      };

      const mockChain = {
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([reservaAtrasada]),
      };
      mockReservaModel.find.mockReturnValue(mockChain);

      const result = await service.findAtrasadas();

      expect(result.length).toBeGreaterThan(0);
      expect(result[0].status).toBe(ReservaStatus.ATRASADA);
      expect(result[0].multa).toBeDefined();
    });
  });

  describe('devolver', () => {
    it('deve devolver livro e marcar reserva como concluída', async () => {
      const mockPopulate = {
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockReserva),
      };
      mockReservaModel.findById.mockReturnValue(mockPopulate);
      mockReservaModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue({
          ...mockReserva,
          status: ReservaStatus.CONCLUIDA,
        }),
      });
      mockLivrosService.marcarComoDisponivel.mockResolvedValue({
        status: LivroStatus.DISPONIVEL,
      });

      const result = await service.devolver(mockReserva._id.toString());

      expect(mockLivrosService.marcarComoDisponivel).toHaveBeenCalled();
      expect(result.status).toBe(ReservaStatus.CONCLUIDA);
    });

    it('deve impedir devolução de reserva já concluída', async () => {
      const reservaConcluida = {
        ...mockReserva,
        status: ReservaStatus.CONCLUIDA,
      };

      const mockPopulate = {
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(reservaConcluida),
      };
      mockReservaModel.findById.mockReturnValue(mockPopulate);

      await expect(
        service.devolver(reservaConcluida._id.toString()),
      ).rejects.toThrow(BadRequestException);
    });

    it('deve devolver livro mesmo se reserva estiver atrasada', async () => {
      const reservaAtrasada = {
        ...mockReserva,
        dataPrevistaDevolucao: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 dias atrás
        status: ReservaStatus.ATRASADA,
        toObject: function () {
          return { ...this };
        },
      };

      const mockPopulate = {
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(reservaAtrasada),
      };
      mockReservaModel.findById.mockReturnValue(mockPopulate);
      mockReservaModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue({
          ...reservaAtrasada,
          status: ReservaStatus.CONCLUIDA,
        }),
      });
      mockLivrosService.marcarComoDisponivel.mockResolvedValue({
        status: LivroStatus.DISPONIVEL,
      });

      const result = await service.devolver(reservaAtrasada._id.toString());

      expect(mockLivrosService.marcarComoDisponivel).toHaveBeenCalled();
      expect(result.status).toBe(ReservaStatus.CONCLUIDA);
    });
  });

  describe('Cálculo de Multa (RN004)', () => {
    it('deve calcular multa corretamente para 1 dia de atraso', () => {
      // RN004: Multa = ValorFixo + (ValorFixo × 0,05 × DiasAtraso)
      // Multa = 10 + (10 × 0,05 × 1) = 10 + 0,50 = 10,50
      const multa = service.calcularMulta(1);
      expect(multa).toBe(10.5);
    });

    it('deve calcular multa corretamente para 5 dias de atraso', () => {
      // RN004: Multa = 10 + (10 × 0,05 × 5) = 10 + 2,50 = 12,50
      const multa = service.calcularMulta(5);
      expect(multa).toBe(12.5);
    });

    it('deve calcular multa corretamente para 10 dias de atraso', () => {
      // RN004: Multa = 10 + (10 × 0,05 × 10) = 10 + 5,00 = 15,00
      const multa = service.calcularMulta(10);
      expect(multa).toBe(15);
    });

    it('deve calcular multa corretamente para 30 dias de atraso', () => {
      // RN004: Multa = 10 + (10 × 0,05 × 30) = 10 + 15,00 = 25,00
      const multa = service.calcularMulta(30);
      expect(multa).toBe(25);
    });

    it('deve retornar valor fixo para 0 dias de atraso', () => {
      const multa = service.calcularMulta(0);
      expect(multa).toBe(10);
    });
  });

  describe('remove', () => {
    it('deve liberar livro ao remover reserva ativa', async () => {
      const mockPopulate = {
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockReserva),
      };
      mockReservaModel.findById.mockReturnValue(mockPopulate);
      mockReservaModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockReserva),
      });
      mockLivrosService.marcarComoDisponivel.mockResolvedValue({
        status: LivroStatus.DISPONIVEL,
      });

      await service.remove(mockReserva._id.toString());

      expect(mockLivrosService.marcarComoDisponivel).toHaveBeenCalled();
      expect(mockReservaModel.findByIdAndDelete).toHaveBeenCalledWith(
        mockReserva._id.toString(),
      );
    });

    it('não deve liberar livro ao remover reserva concluída', async () => {
      const reservaConcluida = {
        ...mockReserva,
        status: ReservaStatus.CONCLUIDA,
      };

      const mockPopulate = {
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(reservaConcluida),
      };
      mockReservaModel.findById.mockReturnValue(mockPopulate);
      mockReservaModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(reservaConcluida),
      });

      await service.remove(reservaConcluida._id.toString());

      expect(mockLivrosService.marcarComoDisponivel).not.toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('deve retornar reserva por ID', async () => {
      const mockPopulate = {
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockReserva),
      };
      mockReservaModel.findById.mockReturnValue(mockPopulate);

      const result = await service.findOne(mockReserva._id.toString());

      expect(result).toBeDefined();
      expect(mockReservaModel.findById).toHaveBeenCalledWith(
        mockReserva._id.toString(),
      );
    });

    it('deve lançar NotFoundException para ID inexistente', async () => {
      const mockPopulate = {
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(null),
      };
      mockReservaModel.findById.mockReturnValue(mockPopulate);

      await expect(service.findOne('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
