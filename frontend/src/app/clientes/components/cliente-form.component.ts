import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LucideAngularModule, User, Save, X, ArrowLeft } from 'lucide-angular';
import { ClientesService, NotificationService, CepService } from '../../core/services';
import { Cliente } from '../../core/models';
import { isValidCpf, sanitizeCpf, formatCpf, formatTelefone } from '../../shared/validators/cpf.validator';
import { CalendarComponent } from '../../shared/components/calendar/calendar.component';

@Component({
    selector: 'app-cliente-form',
    standalone: true,
    imports: [CommonModule, RouterModule, ReactiveFormsModule, LucideAngularModule, CalendarComponent],
    templateUrl: './cliente-form.component.html',
    styleUrl: './cliente-form.component.scss'
})
export class ClienteFormComponent implements OnInit {
    form!: FormGroup;
    isEdit = false;
    clienteId: string | null = null;
    loading = false;
    submitting = false;
    searchingCep = false;
    error: string | null = null;

    // Icons
    readonly UserIcon = User;
    readonly SaveIcon = Save;
    readonly XIcon = X;
    readonly ArrowLeftIcon = ArrowLeft;

    constructor(
        private fb: FormBuilder,
        private clientesService: ClientesService,
        private cepService: CepService,
        private router: Router,
        private route: ActivatedRoute,
        private notificationService: NotificationService
    ) { }

    ngOnInit(): void {
        this.initForm();

        this.clienteId = this.route.snapshot.paramMap.get('id');
        if (this.clienteId) {
            this.isEdit = true;
            this.loadCliente(this.clienteId);
        }
    }

    private initForm(): void {
        this.form = this.fb.group({
            nome: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
            cpf: ['', [Validators.required, Validators.minLength(11), Validators.maxLength(14)]],
            email: ['', [Validators.required, Validators.email]],
            telefone: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(15)]],
            dataNascimento: [null],
            endereco: this.fb.group({
                cep: ['', [Validators.required, Validators.maxLength(9)]],
                rua: ['', [Validators.required]],
                numero: ['', [Validators.required]],
                cidade: ['', [Validators.required]],
                estado: ['', [Validators.required, Validators.maxLength(2)]]
            })
        });
    }

    onCepChange() {
        const cep = this.form.get('endereco.cep')?.value;
        const cleanedCep = cep?.replace(/\D/g, '');

        if (cleanedCep?.length === 8) {
            this.searchingCep = true;
            this.cepService.buscar(cleanedCep).subscribe({
                next: (data) => {
                    this.searchingCep = false;
                    if (data) {
                        this.form.get('endereco')?.patchValue({
                            rua: data.logradouro,
                            cidade: data.localidade,
                            estado: data.uf
                        });
                        this.notificationService.success('Endereço preenchido automaticamente');
                    } else {
                        this.notificationService.warning('CEP não encontrado');
                    }
                },
                error: () => this.searchingCep = false
            });
        }
    }

    applyCpfMask(event: any) {
        const value = event.target.value;
        this.form.get('cpf')?.setValue(formatCpf(value), { emitEvent: false });
    }

    applyPhoneMask(event: any) {
        const value = event.target.value;
        this.form.get('telefone')?.setValue(formatTelefone(value), { emitEvent: false });
    }

    applyCepMask(event: any) {
        let value = event.target.value.replace(/\D/g, '');
        if (value.length > 5) {
            value = value.substring(0, 5) + '-' + value.substring(5, 8);
        }
        this.form.get('endereco.cep')?.setValue(value, { emitEvent: false });
    }

    private loadCliente(id: string): void {
        this.loading = true;
        this.clientesService.findOne(id).subscribe({
            next: (cliente) => {
                const formattedCliente = {
                    ...cliente,
                    cpf: formatCpf(cliente.cpf),
                    telefone: formatTelefone(cliente.telefone),
                    dataNascimento: cliente.dataNascimento ? cliente.dataNascimento.toString().split('T')[0] : null,
                    endereco: cliente.endereco ? {
                        ...cliente.endereco,
                        cep: cliente.endereco.cep ? (cliente.endereco.cep.length === 8 ? cliente.endereco.cep.substring(0, 5) + '-' + cliente.endereco.cep.substring(5) : cliente.endereco.cep) : ''
                    } : undefined
                };
                this.form.patchValue(formattedCliente);
                this.loading = false;
            },
            error: (err) => {
                const msg = 'Erro ao carregar dados do cliente';
                this.notificationService.error(msg);
                this.error = msg;
                this.loading = false;
            }
        });
    }

    onSubmit(): void {
        if (this.form.invalid) {
            this.markFormGroupTouched();
            this.notificationService.warning('Verifique os campos do formulário', 'Campos Inválidos');
            return;
        }

        // Validar CPF
        const cpfValue = sanitizeCpf(this.form.value.cpf);
        if (!isValidCpf(cpfValue)) {
            this.notificationService.warning('O CPF informado não é válido', 'CPF Inválido');
            this.error = 'CPF inválido';
            return;
        }

        const formData = {
            ...this.form.value,
            cpf: cpfValue,
            telefone: this.form.value.telefone.replace(/\D/g, '')
        };

        // Sanitizar CEP se existir
        if (formData.endereco && formData.endereco.cep) {
            formData.endereco.cep = formData.endereco.cep.replace(/\D/g, '');
        }

        // Remover endereço vazio
        if (!formData.endereco?.rua && !formData.endereco?.cidade && !formData.endereco?.cep) {
            delete formData.endereco;
        }

        this.submitting = true;
        this.error = null;

        const request$ = this.isEdit && this.clienteId
            ? this.clientesService.update(this.clienteId, formData)
            : this.clientesService.create(formData);

        request$.subscribe({
            next: () => {
                this.notificationService.success(
                    this.isEdit ? 'Cliente atualizado com sucesso' : 'Cliente cadastrado com sucesso'
                );
                this.router.navigate(['/clientes']);
            },
            error: (err) => {
                const msg = err.error?.message || 'Erro ao salvar cliente';
                this.notificationService.error(msg);
                this.error = msg;
                this.submitting = false;
            }
        });
    }

    private markFormGroupTouched(): void {
        Object.values(this.form.controls).forEach(control => {
            control.markAsTouched();
            if ((control as any).controls) {
                Object.values((control as any).controls).forEach((c: any) => c.markAsTouched());
            }
        });
    }

    isFieldInvalid(field: string): boolean {
        const control = this.form.get(field);
        return control ? control.invalid && control.touched : false;
    }

    getFieldError(field: string): string {
        const control = this.form.get(field);
        if (!control || !control.errors) return '';

        if (control.errors['required']) return 'Campo obrigatório';
        if (control.errors['minlength']) return `Mínimo ${control.errors['minlength'].requiredLength} caracteres`;
        if (control.errors['maxlength']) return `Máximo ${control.errors['maxlength'].requiredLength} caracteres`;
        if (control.errors['email']) return 'Email inválido';

        return 'Valor inválido';
    }
}
