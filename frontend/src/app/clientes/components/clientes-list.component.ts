import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, User, Plus, Edit, Trash2, Search, Mail, Phone, ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from 'lucide-angular';
import { ClientesService, NotificationService } from '../../core/services';
import { Cliente } from '../../core/models';
import { formatCpf, formatTelefone } from '../../shared/validators/cpf.validator';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

import { ConfirmationModalComponent } from '../../shared/components/confirmation-modal/confirmation-modal.component';

@Component({
    selector: 'app-clientes-list',
    standalone: true,
    imports: [CommonModule, RouterModule, LucideAngularModule, ConfirmationModalComponent],
    templateUrl: './clientes-list.component.html',
    styleUrl: './clientes-list.component.scss'
})
export class ClientesListComponent implements OnInit {
    clientes: Cliente[] = [];
    loading = true;
    error: string | null = null;
    private searchSubject = new Subject<string>();
    protected readonly Math = Math;

    // Modal State
    modalOpen = false;
    pendingDeleteId: string | null = null;
    modalConfig = {
        title: '',
        message: '',
        confirmText: 'Excluir',
        cancelText: 'Cancelar',
        type: 'danger' as 'danger' | 'warning' | 'info'
    };

    // Pagination
    currentPage = 1;
    pageSize = 10;
    // Sorting
    currentSortField = 'createdAt';
    currentSortDirection: 'asc' | 'desc' = 'desc';
    private lastSearch = '';
    totalItems = 0;

    // Icons
    readonly UserIcon = User;
    readonly PlusIcon = Plus;
    readonly EditIcon = Edit;
    readonly Trash2Icon = Trash2;
    readonly SearchIcon = Search;
    readonly MailIcon = Mail;
    readonly PhoneIcon = Phone;
    readonly ChevronLeftIcon = ChevronLeft;
    readonly ChevronRightIcon = ChevronRight;
    readonly ChevronUpIcon = ChevronUp;
    readonly ChevronDownIcon = ChevronDown;

    constructor(
        private clientesService: ClientesService,
        private notificationService: NotificationService
    ) { }

    ngOnInit(): void {
        this.loadClientes();

        // Setup debounced search
        this.searchSubject.pipe(
            debounceTime(400),
            distinctUntilChanged()
        ).subscribe(searchTerm => {
            this.lastSearch = searchTerm;
            this.currentPage = 1; // Reset to page 1 on search
            this.loadClientes();
        });
    }

    onSearch(event: Event): void {
        const value = (event.target as HTMLInputElement).value;
        this.searchSubject.next(value);
    }

    sortBy(field: string): void {
        if (this.currentSortField === field) {
            this.currentSortDirection = this.currentSortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.currentSortField = field;
            this.currentSortDirection = 'asc';
        }
        this.currentPage = 1;
        this.loadClientes();
    }

    loadClientes(search?: string): void {
        this.loading = true;
        this.error = null;

        // If search argument is provided, update lastSearch, otherwise use lastSearch
        if (search !== undefined) this.lastSearch = search;

        this.clientesService.findAll(this.lastSearch, this.currentPage, this.pageSize, this.currentSortField, this.currentSortDirection).subscribe({
            next: (response) => {
                this.clientes = response.items;
                this.totalItems = response.total;
                this.loading = false;
            },
            error: (err) => {
                const msg = 'Não foi possível carregar a lista de clientes';
                this.notificationService.error(msg);
                this.error = msg;
                this.loading = false;
            }
        });
    }

    changePage(page: number): void {
        this.currentPage = page;
        this.loadClientes();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    confirmDelete(cliente: Cliente): void {
        if (!cliente._id) return;
        this.pendingDeleteId = cliente._id;
        this.modalConfig = {
            title: 'Excluir Cliente',
            message: `Tem certeza que deseja excluir o cliente "${cliente.nome}"? Esta ação não pode ser desfeita.`,
            confirmText: 'Excluir Cliente',
            cancelText: 'Cancelar',
            type: 'danger'
        };
        this.modalOpen = true;
    }

    onModalConfirm(): void {
        if (this.pendingDeleteId) {
            this.clientesService.remove(this.pendingDeleteId).subscribe({
                next: () => {
                    this.clientes = this.clientes.filter(c => c._id !== this.pendingDeleteId);
                    this.notificationService.success('Cliente removido permanentemente', 'Exclusão Concluída');
                    this.closeModal();
                },
                error: (err) => {
                    const msg = err.error?.message || 'Erro ao remover cliente';
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
        this.pendingDeleteId = null;
    }

    formatCpf(cpf: string): string {
        return formatCpf(cpf);
    }

    formatTelefone(telefone: string): string {
        return formatTelefone(telefone);
    }

    formatDate(date: Date | string | undefined): string {
        if (!date) return '-';
        return new Date(date).toLocaleDateString('pt-BR');
    }
}
