import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, Book, Users, Calendar, AlertCircle, TrendingUp, ChevronRight, CheckCircle } from 'lucide-angular';
import { forkJoin } from 'rxjs';
import { ClientesService, LivrosService, ReservasService } from '../../core/services';
import { Reserva, Livro, Cliente } from '../../core/models';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, RouterModule, LucideAngularModule],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
    stats = {
        totalBooks: 0,
        availableBooks: 0,
        activeReservations: 0,
        overdueCount: 0,
        totalFines: 0
    };

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
        private reservasService: ReservasService
    ) { }

    ngOnInit() {
        this.loadDashboardData();
    }

    loadDashboardData() {
        this.loading = true;

        forkJoin({
            books: this.livrosService.findAll(),
            reservations: this.reservasService.findAll()
        }).subscribe({
            next: ({ books, reservations }) => {
                this.stats.totalBooks = books.length;
                this.stats.availableBooks = books.filter(b => b.status === 'disponivel').length;
                this.stats.activeReservations = reservations.filter(r => r.status === 'ativa').length;
                this.stats.overdueCount = reservations.filter(r => r.status === 'atrasada').length;
                this.stats.totalFines = reservations.reduce((acc, curr) => acc + (curr.multa?.valorTotal || 0), 0);

                // Populate recent reservations with book/client info
                this.recentReservations = reservations.slice(0, 3);

                this.loading = false;
            },
            error: () => this.loading = false
        });
    }

    formatCurrency(value: number): string {
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    getClienteNome(reserva: Reserva): string {
        return (reserva.clienteId as any)?.nome || '-';
    }

    getLivroTitulo(reserva: Reserva): string {
        return (reserva.livroId as any)?.titulo || '-';
    }
}
