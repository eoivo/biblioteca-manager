import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  LucideAngularModule,
  Book,
  Users,
  Calendar,
  AlertCircle,
  TrendingUp,
  ChevronRight,
  CheckCircle,
} from 'lucide-angular';
import { NgxChartsModule, Color, ScaleType, LegendPosition } from '@swimlane/ngx-charts';
import { forkJoin } from 'rxjs';
import { ClientesService, LivrosService, ReservasService } from '../../core/services';
import { Reserva, Livro, Cliente } from '../../core/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule, NgxChartsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  stats = {
    totalBooks: 0,
    availableBooks: 0,
    activeReservations: 0,
    overdueCount: 0,
    totalFines: 0,
  };

  bookStatusData: any[] = [];
  reservaData: any[] = [];

  // Cores baseadas no styleguide e componentes de badge
  bookColorScheme: Color = {
    name: 'books',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#4CAF50', '#2196F3'], // Verde (Disponível), Azul (Em Uso)
  };

  reservaColorScheme: Color = {
    name: 'reservas',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#2196F3', '#F44336', '#4CAF50'], // Azul (Ativa), Vermelho (Atrasada), Verde (Concluída)
  };

  readonly legendPosition = LegendPosition;

  recentReservations: any[] = [];
  loading = true;

  readonly BookIcon = Book;
  readonly UsersIcon = Users;
  readonly CalendarIcon = Calendar;
  readonly AlertIcon = AlertCircle;
  readonly TrendingUpIcon = TrendingUp;
  readonly ChevronRightIcon = ChevronRight;
  readonly CheckCircleIcon = CheckCircle;

  constructor(
    private clientesService: ClientesService,
    private livrosService: LivrosService,
    private reservasService: ReservasService,
  ) { }

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.loading = true;

    forkJoin({
      books: this.livrosService.findAll(undefined, 1, 1000),
      reservations: this.reservasService.findAll(1, 1000),
    }).subscribe({
      next: ({ books, reservations }) => {
        this.stats.totalBooks = books.total;
        const available = books.items.filter((b) => b.status === 'disponivel').length;
        const reserved = books.total - available;

        this.stats.availableBooks = available;
        this.stats.activeReservations = reservations.items.filter(
          (r) => r.status === 'ativa',
        ).length;
        this.stats.overdueCount = reservations.items.filter((r) => r.status === 'atrasada').length;
        // Multas pendentes = apenas de reservas ATRASADAS (não concluídas)
        this.stats.totalFines = reservations.items
          .filter((r) => r.status === 'atrasada')
          .reduce((acc, curr) => acc + (curr.multa?.valorTotal || 0), 0);

        // Dados para o gráfico de Rosca (Livros)
        this.bookStatusData = [
          { name: 'Disponíveis', value: available },
          { name: 'Em Uso/Reservados', value: reserved },
        ];

        // Dados para o gráfico de Barras (Reservas)
        const concluido = reservations.items.filter((r) => r.status === 'concluida').length;
        this.reservaData = [
          { name: 'Ativas', value: this.stats.activeReservations },
          { name: 'Atrasadas', value: this.stats.overdueCount },
          { name: 'Concluídas', value: concluido },
        ];

        // Populate recent reservations with book/client info
        this.recentReservations = reservations.items.slice(0, 3);

        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  formatCurrency(value: number): string {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  gerarRelatorio() {
    // Gerar relatório do último mês
    const hoje = new Date();
    const mesPassado = new Date();
    mesPassado.setMonth(mesPassado.getMonth() - 1);

    const dataInicio = mesPassado.toISOString().split('T')[0];
    const dataFim = hoje.toISOString().split('T')[0];

    this.reservasService.gerarRelatorioCaixa(dataInicio, dataFim);
  }

  getClienteNome(reserva: Reserva): string {
    return (reserva.clienteId as any)?.nome || '-';
  }

  getLivroTitulo(reserva: Reserva): string {
    return (reserva.livroId as any)?.titulo || '-';
  }
}
