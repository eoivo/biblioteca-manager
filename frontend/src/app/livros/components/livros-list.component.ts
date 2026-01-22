import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, Book, Plus, Edit, Trash2, Check, Lock, Search } from 'lucide-angular';
import { LivrosService, NotificationService } from '../../core/services';
import { Livro } from '../../core/models/livro.model';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
    selector: 'app-livros-list',
    standalone: true,
    imports: [CommonModule, RouterModule, LucideAngularModule],
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

    readonly BookIcon = Book;
    readonly PlusIcon = Plus;
    readonly EditIcon = Edit;
    readonly Trash2Icon = Trash2;
    readonly CheckIcon = Check;
    readonly LockIcon = Lock;
    readonly SearchIcon = Search;

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
            this.loadLivros();
        });
    }

    onSearch(event: Event): void {
        const value = (event.target as HTMLInputElement).value;
        this.searchSubject.next(value);
    }

    setStatusFilter(status: 'todos' | 'disponivel' | 'reservado'): void {
        this.statusFilter = status;
        this.loadLivros();
    }

    loadLivros(): void {
        this.loading = true;
        this.error = null;

        this.livrosService.findAll(this.lastSearch).subscribe({
            next: (livros) => {
                if (this.statusFilter === 'todos') {
                    this.livros = livros;
                } else {
                    this.livros = livros.filter(l => l.status === this.statusFilter);
                }
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

    deleteLivro(livro: Livro): void {
        if (!livro._id) return;

        if (livro.status === 'reservado') {
            this.notificationService.warning('Este livro está reservado e não pode ser excluído', 'Ação Bloqueada');
            return;
        }

        if (confirm(`Deseja realmente excluir o livro "${livro.titulo}"?`)) {
            this.livrosService.remove(livro._id).subscribe({
                next: () => {
                    this.livros = this.livros.filter(l => l._id !== livro._id);
                    this.notificationService.success('Livro removido do acervo', 'Exclusão Concluída');
                },
                error: (err) => {
                    const msg = err.error?.message || 'Erro ao remover livro';
                    this.notificationService.error(msg, 'Erro');
                }
            });
        }
    }
}
