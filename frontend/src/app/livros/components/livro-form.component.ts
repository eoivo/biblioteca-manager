import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LucideAngularModule, Book, Save, X, ArrowLeft } from 'lucide-angular';
import { LivrosService } from '../../core/services/livros.service';

@Component({
    selector: 'app-livro-form',
    standalone: true,
    imports: [CommonModule, RouterModule, ReactiveFormsModule, LucideAngularModule],
    templateUrl: './livro-form.component.html',
    styleUrl: './livro-form.component.scss'
})
export class LivroFormComponent implements OnInit {
    form!: FormGroup;
    isEdit = false;
    livroId: string | null = null;
    loading = false;
    submitting = false;
    error: string | null = null;

    readonly BookIcon = Book;
    readonly SaveIcon = Save;
    readonly XIcon = X;
    readonly ArrowLeftIcon = ArrowLeft;

    constructor(
        private fb: FormBuilder,
        private livrosService: LivrosService,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        this.initForm();

        this.livroId = this.route.snapshot.paramMap.get('id');
        if (this.livroId) {
            this.isEdit = true;
            this.loadLivro(this.livroId);
        }
    }

    private initForm(): void {
        this.form = this.fb.group({
            titulo: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(200)]],
            autor: ['', [Validators.required]],
            isbn: [''],
            editora: [''],
            anoPublicacao: [null, [Validators.min(1000), Validators.max(2100)]],
            categoria: ['']
        });
    }

    private loadLivro(id: string): void {
        this.loading = true;
        this.livrosService.findOne(id).subscribe({
            next: (livro) => {
                this.form.patchValue(livro);
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

        const formData = { ...this.form.value };

        // Limpar campos vazios
        Object.keys(formData).forEach(key => {
            if (formData[key] === '' || formData[key] === null) {
                delete formData[key];
            }
        });

        this.submitting = true;
        this.error = null;

        const request$ = this.isEdit && this.livroId
            ? this.livrosService.update(this.livroId, formData)
            : this.livrosService.create(formData);

        request$.subscribe({
            next: () => {
                this.router.navigate(['/livros']);
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
        if (control.errors['minlength']) return `Mínimo ${control.errors['minlength'].requiredLength} caracteres`;
        if (control.errors['maxlength']) return `Máximo ${control.errors['maxlength'].requiredLength} caracteres`;
        if (control.errors['min']) return `Mínimo: ${control.errors['min'].min}`;
        if (control.errors['max']) return `Máximo: ${control.errors['max'].max}`;

        return 'Valor inválido';
    }
}
