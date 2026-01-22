import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, User, Plus, Edit, Trash2, Search } from 'lucide-angular';
import { ClientesService, NotificationService } from '../../core/services';
import { Cliente } from '../../core/models';
import { formatCpf, formatTelefone } from '../../shared/validators/cpf.validator';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
    selector: 'app-clientes-list',
    standalone: true,
    imports: [CommonModule, RouterModule, LucideAngularModule],
    templateUrl: './clientes-list.component.html',
    styleUrl: './clientes-list.component.scss'
})
export class ClientesListComponent implements OnInit {
    clientes: Cliente[] = [];
    loading = true;
    error: string | null = null;
    private searchSubject = new Subject<string>();

    // Icons
    readonly UserIcon = User;
    readonly PlusIcon = Plus;
    readonly EditIcon = Edit;
    readonly Trash2Icon = Trash2;
    readonly SearchIcon = Search;

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
            this.loadClientes(searchTerm);
        });
    }

    onSearch(event: Event): void {
        const value = (event.target as HTMLInputElement).value;
        this.searchSubject.next(value);
    }

    loadClientes(search?: string): void {
        this.loading = true;
        this.error = null;

        this.clientesService.findAll(search).subscribe({
            next: (clientes) => {
                this.clientes = clientes;
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

    deleteCliente(cliente: Cliente): void {
        if (!cliente._id) return;

        if (confirm(`Deseja realmente excluir o cliente "${cliente.nome}"?`)) {
            this.clientesService.remove(cliente._id).subscribe({
                next: () => {
                    this.clientes = this.clientes.filter(c => c._id !== cliente._id);
                    this.notificationService.success('Cliente removido permanentemente', 'Exclusão Concluída');
                },
                error: (err) => {
                    const msg = err.error?.message || 'Erro ao remover cliente';
                    this.notificationService.error(msg, 'Erro');
                }
            });
        }
    }

    formatCpf(cpf: string): string {
        return formatCpf(cpf);
    }

    formatTelefone(telefone: string): string {
        return formatTelefone(telefone);
    }
}
