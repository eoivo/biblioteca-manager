import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, Book, Plus, Edit, Trash2, Check, Lock, Search, ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from 'lucide-angular';
import { LivrosService, NotificationService } from '../../core/services';
import { Livro } from '../../core/models/livro.model';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { ConfirmationModalComponent } from '../../shared/components/confirmation-modal/confirmation-modal.component';

@Component({
    selector: 'app-livros-list',
    standalone: true,
    imports: [CommonModule, RouterModule, LucideAngularModule, ConfirmationModalComponent],
    templateUrl: './livros-list.component.html',
    styleUrl: './livros-list.component.scss'
})
export class LivrosListComponent implements OnInit {
    livros: Livro[] = [];
    loading = true;
    error: string | null = null;
    statusFilter: 'todos' | 'disponivel' | 'reservado' = 'todos';
    private searchSubject = new Subject<string>();
    private lastSearch = '';
    protected readonly Math = Math;

    // Sorting
    currentSortField = 'createdAt';
    currentSortDirection: 'asc' | 'desc' = 'desc';

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
    totalItems = 0;

    readonly BookIcon = Book;
    readonly PlusIcon = Plus;
    readonly EditIcon = Edit;
    readonly Trash2Icon = Trash2;
    readonly CheckIcon = Check;
    readonly LockIcon = Lock;
    readonly SearchIcon = Search;
    readonly ChevronLeftIcon = ChevronLeft;
    readonly ChevronRightIcon = ChevronRight;
    readonly ChevronUpIcon = ChevronUp;
    readonly ChevronDownIcon = ChevronDown;

    constructor(
        private livrosService: LivrosService,
        private notificationService: NotificationService
    ) { }

    ngOnInit(): void {
        this.loadLivros();

        // Setup debounced search
        this.searchSubject.pipe(
            debounceTime(400),
            distinctUntilChanged()
        ).subscribe(searchTerm => {
            this.lastSearch = searchTerm;
            this.currentPage = 1;
            this.loadLivros();
        });
    }

    onSearch(event: Event): void {
        const value = (event.target as HTMLInputElement).value;
        this.searchSubject.next(value);
    }

    setStatusFilter(status: 'todos' | 'disponivel' | 'reservado'): void {
        this.statusFilter = status;
        this.currentPage = 1;
        this.loadLivros();
    }

    sortBy(field: string): void {
        if (this.currentSortField === field) {
            this.currentSortDirection = this.currentSortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.currentSortField = field;
            this.currentSortDirection = 'asc';
        }
        this.currentPage = 1;
        this.loadLivros();
    }

    loadLivros(): void {
        this.loading = true;
        this.error = null;

        this.livrosService.findAll(this.lastSearch, this.currentPage, this.pageSize, this.currentSortField, this.currentSortDirection).subscribe({
            next: (response) => {
                let items = response.items;
                if (this.statusFilter !== 'todos') {
                    items = items.filter(l => l.status === this.statusFilter);
                }
                this.livros = items;
                this.totalItems = response.total;
                this.loading = false;
            },
            error: (err) => {
                const msg = 'Erro ao carregar o acervo de livros';
                this.notificationService.error(msg);
                this.error = msg;
                this.loading = false;
            }
        });
    }

    changePage(page: number): void {
        this.currentPage = page;
        this.loadLivros();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    confirmDelete(livro: Livro): void {
        if (!livro._id) return;

        if (livro.status === 'reservado') {
            this.notificationService.warning('Este livro está reservado e não pode ser excluído', 'Ação Bloqueada');
            return;
        }

        this.pendingDeleteId = livro._id;
        this.modalConfig = {
            title: 'Excluir Livro',
            message: `Tem certeza que deseja excluir o livro "${livro.titulo}"? Esta ação não pode ser desfeita.`,
            confirmText: 'Excluir Livro',
            cancelText: 'Cancelar',
            type: 'danger'
        };
        this.modalOpen = true;
    }

    onModalConfirm(): void {
        if (this.pendingDeleteId) {
            this.livrosService.remove(this.pendingDeleteId).subscribe({
                next: () => {
                    this.livros = this.livros.filter(l => l._id !== this.pendingDeleteId);
                    this.notificationService.success('Livro removido do acervo', 'Exclusão Concluída');
                    this.closeModal();
                },
                error: (err) => {
                    const msg = err.error?.message || 'Erro ao remover livro';
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

    formatDate(date: Date | string | undefined): string {
        if (!date) return '-';
        return new Date(date).toLocaleDateString('pt-BR');
    }
}
