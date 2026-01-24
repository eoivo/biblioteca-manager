import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, Calendar, Plus, CheckCircle, AlertTriangle, Clock, Trash2, ChevronLeft, ChevronRight } from 'lucide-angular';
import { ReservasService, NotificationService } from '../../core/services';
import { Reserva } from '../../core/models/reserva.model';
import { ConfirmationModalComponent } from '../../shared/components/confirmation-modal/confirmation-modal.component';

@Component({
    selector: 'app-reservas-list',
    standalone: true,
    imports: [CommonModule, RouterModule, LucideAngularModule, ConfirmationModalComponent],
    templateUrl: './reservas-list.component.html',
    styleUrl: './reservas-list.component.scss'
})
export class ReservasListComponent implements OnInit {
    reservas: Reserva[] = [];
    loading = true;
    error: string | null = null;
    currentFilter: string = 'todas';
    protected readonly Math = Math;

    // Pagination
    currentPage = 1;
    pageSize = 10;
    totalItems = 0;

    // Modal
    modalOpen = false;
    pendingAction: { type: 'delete' | 'devolve', reserva: Reserva } | null = null;
    modalConfig = {
        title: '',
        message: '',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        type: 'danger' as 'danger' | 'warning' | 'info'
    };

    readonly CalendarIcon = Calendar;
    readonly PlusIcon = Plus;
    readonly CheckCircleIcon = CheckCircle;
    readonly AlertTriangleIcon = AlertTriangle;
    readonly ClockIcon = Clock;
    readonly Trash2Icon = Trash2;
    readonly ChevronLeftIcon = ChevronLeft;
    readonly ChevronRightIcon = ChevronRight;

    constructor(
        private reservasService: ReservasService,
        private notificationService: NotificationService
    ) { }

    ngOnInit(): void {
        this.loadReservas();
    }

    loadReservas(): void {
        this.loading = true;
        this.error = null;

        const status = this.currentFilter === 'todas' ? undefined : this.currentFilter;

        this.reservasService.findAll(this.currentPage, this.pageSize, status).subscribe({
            next: (response) => {
                this.reservas = response.items;
                this.totalItems = response.total;
                this.loading = false;
            },
            error: (err) => {
                const msg = 'Erro ao carregar lista de reservas';
                this.notificationService.error(msg);
                this.error = msg;
                this.loading = false;
            }
        });
    }

    changePage(page: number): void {
        this.currentPage = page;
        this.loadReservas();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    setFilter(status: string): void {
        this.currentFilter = status;
        this.currentPage = 1;
        this.loadReservas();
    }

    confirmDevolucao(reserva: Reserva): void {
        if (!reserva._id) return;
        this.pendingAction = { type: 'devolve', reserva };
        this.modalConfig = {
            title: 'Confirmar Devolução',
            message: `Confirmar a devolução do livro "${this.getLivroTitulo(reserva)}"?`,
            confirmText: 'Confirmar Devolução',
            cancelText: 'Cancelar',
            type: 'info'
        };
        this.modalOpen = true;
    }

    confirmDelete(reserva: Reserva): void {
        if (!reserva._id) return;
        this.pendingAction = { type: 'delete', reserva };
        this.modalConfig = {
            title: 'Excluir Reserva',
            message: `Tem certeza que deseja remover o registro de reserva do livro "${this.getLivroTitulo(reserva)}"?`,
            confirmText: 'Excluir Registro',
            cancelText: 'Cancelar',
            type: 'danger'
        };
        this.modalOpen = true;
    }

    onModalConfirm(): void {
        if (!this.pendingAction) return;

        const { type, reserva } = this.pendingAction;

        if (type === 'devolve') {
            this.reservasService.devolver(reserva._id!).subscribe({
                next: (updatedReserva) => {
                    this.notificationService.success('O livro foi devolvido com sucesso', 'Devolução Concluída');
                    if (updatedReserva.multa && updatedReserva.multa.valorTotal > 0) {
                        this.notificationService.info(`Multa total: R$ ${updatedReserva.multa.valorTotal.toFixed(2)}`, 'Multa Aplicada');
                    }
                    this.loadReservas();
                    this.closeModal();
                },
                error: (err) => {
                    const msg = err.error?.message || 'Erro ao processar devolução';
                    this.notificationService.error(msg, 'Erro');
                    this.closeModal();
                }
            });
        } else if (type === 'delete') {
            this.reservasService.remove(reserva._id!).subscribe({
                next: () => {
                    this.reservas = this.reservas.filter(r => r._id !== reserva._id);
                    this.notificationService.success('A reserva foi removida do sistema');
                    this.closeModal();
                },
                error: (err) => {
                    const msg = err.error?.message || 'Erro ao remover reserva';
                    this.notificationService.error(msg, 'Erro');
                    this.closeModal();
                }
            });
        }
    }

    onModalCancel(): void {
        this.closeModal();
    }

    private closeModal(): void {
        this.modalOpen = false;
        this.pendingAction = null;
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
