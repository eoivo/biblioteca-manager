import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, Calendar, Plus, CheckCircle, AlertTriangle, Clock, Trash2 } from 'lucide-angular';
import { ReservasService } from '../../core/services/reservas.service';
import { Reserva } from '../../core/models/reserva.model';

@Component({
    selector: 'app-reservas-list',
    standalone: true,
    imports: [CommonModule, RouterModule, LucideAngularModule],
    templateUrl: './reservas-list.component.html',
    styleUrl: './reservas-list.component.scss'
})
export class ReservasListComponent implements OnInit {
    reservas: Reserva[] = [];
    loading = true;
    error: string | null = null;
    showOnlyAtrasadas = false;

    readonly CalendarIcon = Calendar;
    readonly PlusIcon = Plus;
    readonly CheckCircleIcon = CheckCircle;
    readonly AlertTriangleIcon = AlertTriangle;
    readonly ClockIcon = Clock;
    readonly Trash2Icon = Trash2;

    constructor(private reservasService: ReservasService) { }

    ngOnInit(): void {
        this.loadReservas();
    }

    loadReservas(): void {
        this.loading = true;
        this.error = null;

        const request$ = this.showOnlyAtrasadas
            ? this.reservasService.findAtrasadas()
            : this.reservasService.findAll();

        request$.subscribe({
            next: (reservas) => {
                this.reservas = reservas;
                this.loading = false;
            },
            error: (err) => {
                this.error = err.message;
                this.loading = false;
            }
        });
    }

    toggleAtrasadas(): void {
        this.showOnlyAtrasadas = !this.showOnlyAtrasadas;
        this.loadReservas();
    }

    devolver(reserva: Reserva): void {
        if (!reserva._id) return;

        if (confirm(`Confirmar devolução do livro?`)) {
            this.reservasService.devolver(reserva._id).subscribe({
                next: () => {
                    this.loadReservas();
                },
                error: (err) => {
                    alert(err.message);
                }
            });
        }
    }

    deleteReserva(reserva: Reserva): void {
        if (!reserva._id) return;

        if (confirm('Deseja realmente excluir esta reserva?')) {
            this.reservasService.remove(reserva._id).subscribe({
                next: () => {
                    this.reservas = this.reservas.filter(r => r._id !== reserva._id);
                },
                error: (err) => {
                    alert(err.message);
                }
            });
        }
    }

    getClienteNome(reserva: Reserva): string {
        if (typeof reserva.clienteId === 'object' && reserva.clienteId) {
            return (reserva.clienteId as any).nome || '-';
        }
        return '-';
    }

    getLivroTitulo(reserva: Reserva): string {
        if (typeof reserva.livroId === 'object' && reserva.livroId) {
            return (reserva.livroId as any).titulo || '-';
        }
        return '-';
    }

    formatDate(date: Date | string): string {
        return new Date(date).toLocaleDateString('pt-BR');
    }

    formatCurrency(value: number): string {
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }
}
