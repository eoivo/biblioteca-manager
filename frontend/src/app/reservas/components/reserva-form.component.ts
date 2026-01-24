import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LucideAngularModule, Calendar, Save, X, ArrowLeft } from 'lucide-angular';
import { ReservasService, ClientesService, LivrosService, NotificationService } from '../../core/services';
import { Cliente } from '../../core/models/cliente.model';
import { Livro } from '../../core/models/livro.model';
import { CalendarComponent } from '../../shared/components/calendar/calendar.component';
import { CustomSelectComponent, SelectOption } from '../../shared/components/custom-select/custom-select.component';

@Component({
    selector: 'app-reserva-form',
    standalone: true,
    imports: [CommonModule, RouterModule, ReactiveFormsModule, LucideAngularModule, CalendarComponent, CustomSelectComponent],
    templateUrl: './reserva-form.component.html',
    styleUrl: './reserva-form.component.scss'
})
export class ReservaFormComponent implements OnInit {
    form!: FormGroup;
    clientes: Cliente[] = [];
    livrosDisponiveis: Livro[] = [];
    clienteOptions: SelectOption[] = [];
    livroOptions: SelectOption[] = [];
    loading = true;
    submitting = false;
    error: string | null = null;
    minDateValue: Date;

    readonly CalendarIcon = Calendar;
    readonly SaveIcon = Save;
    readonly XIcon = X;
    readonly ArrowLeftIcon = ArrowLeft;

    constructor(
        private fb: FormBuilder,
        private reservasService: ReservasService,
        private clientesService: ClientesService,
        private livrosService: LivrosService,
        private router: Router,
        private notificationService: NotificationService
    ) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        this.minDateValue = tomorrow;
    }

    ngOnInit(): void {
        this.initForm();
        this.loadData();
    }

    private initForm(): void {
        this.form = this.fb.group({
            clienteId: ['', [Validators.required]],
            livroId: ['', [Validators.required]],
            dataPrevistaDevolucao: [this.minDateValue.toISOString().split('T')[0], [Validators.required, this.futureDateValidator]]
        });
    }

    private futureDateValidator(control: any) {
        if (!control.value) return null;
        const date = new Date(control.value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date < today ? { pastDate: true } : null;
    }

    private loadData(): void {
        this.loading = true;

        // Carregar clientes e livros disponíveis
        Promise.all([
            this.clientesService.findAll(undefined, 1, 1000).toPromise(),
            this.livrosService.findDisponiveis().toPromise()
        ]).then(([clientesResponse, livros]) => {
            this.clientes = clientesResponse?.items || [];
            this.livrosDisponiveis = livros || [];

            this.clienteOptions = this.clientes.map(c => ({
                label: `${c.nome} (${c.cpf})`,
                value: c._id
            }));

            this.livroOptions = this.livrosDisponiveis.map(l => ({
                label: `${l.titulo} - ${l.autor}`,
                value: l._id
            }));

            this.loading = false;
        }).catch(err => {
            const msg = 'Erro ao carregar dados de clientes ou livros';
            this.notificationService.error(msg);
            this.error = msg;
            this.loading = false;
        });
    }

    onSubmit(): void {
        if (this.form.invalid) {
            this.markFormGroupTouched();
            this.notificationService.warning('Verifique os campos da reserva');
            return;
        }

        this.submitting = true;
        this.error = null;

        this.reservasService.create(this.form.value).subscribe({
            next: () => {
                this.notificationService.success('Reserva efetuada com sucesso!', 'Reserva Confirmada');
                this.router.navigate(['/reservas']);
            },
            error: (err) => {
                const msg = err.error?.message || 'Erro ao processar reserva';
                this.notificationService.error(msg);
                this.error = msg;
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
        if (control.errors['pastDate']) return 'A data não pode ser anterior a hoje';
        return 'Valor inválido';
    }

    getMinDate(): string {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
    }
}
