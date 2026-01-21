import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, User, Plus, Edit, Trash2, Search } from 'lucide-angular';
import { ClientesService } from '../../core/services';
import { Cliente } from '../../core/models';
import { formatCpf, formatTelefone } from '../../shared/validators/cpf.validator';

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

    // Icons
    readonly UserIcon = User;
    readonly PlusIcon = Plus;
    readonly EditIcon = Edit;
    readonly Trash2Icon = Trash2;
    readonly SearchIcon = Search;

    constructor(private clientesService: ClientesService) { }

    ngOnInit(): void {
        this.loadClientes();
    }

    loadClientes(): void {
        this.loading = true;
        this.error = null;

        this.clientesService.findAll().subscribe({
            next: (clientes) => {
                this.clientes = clientes;
                this.loading = false;
            },
            error: (err) => {
                this.error = err.message;
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
                },
                error: (err) => {
                    alert(err.message);
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
