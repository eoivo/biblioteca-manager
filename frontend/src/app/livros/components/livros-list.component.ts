import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, Book, Plus, Edit, Trash2, Check, Lock } from 'lucide-angular';
import { LivrosService } from '../../core/services/livros.service';
import { Livro } from '../../core/models/livro.model';

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

    readonly BookIcon = Book;
    readonly PlusIcon = Plus;
    readonly EditIcon = Edit;
    readonly Trash2Icon = Trash2;
    readonly CheckIcon = Check;
    readonly LockIcon = Lock;

    constructor(private livrosService: LivrosService) { }

    ngOnInit(): void {
        this.loadLivros();
    }

    loadLivros(): void {
        this.loading = true;
        this.error = null;

        this.livrosService.findAll().subscribe({
            next: (livros) => {
                this.livros = livros;
                this.loading = false;
            },
            error: (err) => {
                this.error = err.message;
                this.loading = false;
            }
        });
    }

    deleteLivro(livro: Livro): void {
        if (!livro._id) return;

        if (livro.status === 'reservado') {
            alert('Não é possível excluir um livro reservado');
            return;
        }

        if (confirm(`Deseja realmente excluir o livro "${livro.titulo}"?`)) {
            this.livrosService.remove(livro._id).subscribe({
                next: () => {
                    this.livros = this.livros.filter(l => l._id !== livro._id);
                },
                error: (err) => {
                    alert(err.message);
                }
            });
        }
    }
}
