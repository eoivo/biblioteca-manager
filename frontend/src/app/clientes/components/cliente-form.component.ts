import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LucideAngularModule, User, Save, X, ArrowLeft } from 'lucide-angular';
import { ClientesService } from '../../core/services';
import { Cliente } from '../../core/models';
import { isValidCpf, sanitizeCpf } from '../../shared/validators/cpf.validator';

@Component({
    selector: 'app-cliente-form',
    standalone: true,
    imports: [CommonModule, RouterModule, ReactiveFormsModule, LucideAngularModule],
    templateUrl: './cliente-form.component.html',
    styleUrl: './cliente-form.component.scss'
})
export class ClienteFormComponent implements OnInit {
    form!: FormGroup;
    isEdit = false;
    clienteId: string | null = null;
    loading = false;
    submitting = false;
    error: string | null = null;

    // Icons
    readonly UserIcon = User;
    readonly SaveIcon = Save;
    readonly XIcon = X;
    readonly ArrowLeftIcon = ArrowLeft;

    constructor(
        private fb: FormBuilder,
        private clientesService: ClientesService,
        private router: Router,
        private route: ActivatedRoute
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
            endereco: this.fb.group({
                rua: [''],
                numero: [''],
                cidade: [''],
                estado: ['', [Validators.maxLength(2)]],
                cep: ['', [Validators.maxLength(9)]]
            })
        });
    }

    private loadCliente(id: string): void {
        this.loading = true;
        this.clientesService.findOne(id).subscribe({
            next: (cliente) => {
                this.form.patchValue(cliente);
                this.loading = false;
            },
            error: (err) => {
                this.error = err.message;
                this.loading = false;
            }
        });
    }

    onSubmit(): void {
        if (this.form.invalid) {
            this.markFormGroupTouched();
            return;
        }

        // Validar CPF
        const cpfValue = sanitizeCpf(this.form.value.cpf);
        if (!isValidCpf(cpfValue)) {
            this.error = 'CPF inválido';
            return;
        }

        const formData = {
            ...this.form.value,
            cpf: cpfValue,
            telefone: this.form.value.telefone.replace(/\D/g, '')
        };

        // Remover endereço vazio
        if (!formData.endereco?.rua && !formData.endereco?.cidade) {
            delete formData.endereco;
        }

        this.submitting = true;
        this.error = null;

        const request$ = this.isEdit && this.clienteId
            ? this.clientesService.update(this.clienteId, formData)
            : this.clientesService.create(formData);

        request$.subscribe({
            next: () => {
                this.router.navigate(['/clientes']);
            },
            error: (err) => {
                this.error = err.message;
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
