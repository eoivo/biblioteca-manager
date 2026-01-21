import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LucideAngularModule, Calendar, Save, X, ArrowLeft } from 'lucide-angular';
import { ReservasService } from '../../core/services/reservas.service';
import { ClientesService } from '../../core/services/clientes.service';
import { LivrosService } from '../../core/services/livros.service';
import { Cliente } from '../../core/models/cliente.model';
import { Livro } from '../../core/models/livro.model';

@Component({
    selector: 'app-reserva-form',
    standalone: true,
    imports: [CommonModule, RouterModule, ReactiveFormsModule, LucideAngularModule],
    templateUrl: './reserva-form.component.html',
    styleUrl: './reserva-form.component.scss'
})
export class ReservaFormComponent implements OnInit {
    form!: FormGroup;
    clientes: Cliente[] = [];
    livrosDisponiveis: Livro[] = [];
    loading = true;
    submitting = false;
    error: string | null = null;

    readonly CalendarIcon = Calendar;
    readonly SaveIcon = Save;
    readonly XIcon = X;
    readonly ArrowLeftIcon = ArrowLeft;

    constructor(
        private fb: FormBuilder,
        private reservasService: ReservasService,
        private clientesService: ClientesService,
        private livrosService: LivrosService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.initForm();
        this.loadData();
    }

    private initForm(): void {
        // Data mínima de devolução: amanhã
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const minDate = tomorrow.toISOString().split('T')[0];

        this.form = this.fb.group({
            clienteId: ['', [Validators.required]],
            livroId: ['', [Validators.required]],
            dataPrevistaDevolucao: [minDate, [Validators.required]]
        });
    }

    private loadData(): void {
        this.loading = true;

        // Carregar clientes e livros disponíveis
        Promise.all([
            this.clientesService.findAll().toPromise(),
            this.livrosService.findDisponiveis().toPromise()
        ]).then(([clientes, livros]) => {
            this.clientes = clientes || [];
            this.livrosDisponiveis = livros || [];
            this.loading = false;
        }).catch(err => {
            this.error = 'Erro ao carregar dados';
            this.loading = false;
        });
    }

    onSubmit(): void {
        if (this.form.invalid) {
            this.markFormGroupTouched();
            return;
        }

        this.submitting = true;
        this.error = null;

        this.reservasService.create(this.form.value).subscribe({
            next: () => {
                this.router.navigate(['/reservas']);
            },
            error: (err) => {
                this.error = err.message;
                this.submitting = false;
            }
        });
    }

    private markFormGroupTouched(): void {
        Object.values(this.form.controls).forEach(control => control.markAsTouched());
    }

    isFieldInvalid(field: string): boolean {
        const control = this.form.get(field);
        return control ? control.invalid && control.touched : false;
    }

    getFieldError(field: string): string {
        const control = this.form.get(field);
        if (!control || !control.errors) return '';
        if (control.errors['required']) return 'Campo obrigatório';
        return 'Valor inválido';
    }

    getMinDate(): string {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
    }
}
