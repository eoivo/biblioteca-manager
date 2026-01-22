import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LucideAngularModule, Book, Save, X, ArrowLeft } from 'lucide-angular';
import { LivrosService, NotificationService } from '../../core/services';
import { CustomSelectComponent, SelectOption } from '../../shared/components/custom-select/custom-select.component';

@Component({
    selector: 'app-livro-form',
    standalone: true,
    imports: [CommonModule, RouterModule, ReactiveFormsModule, LucideAngularModule, CustomSelectComponent],
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

    categorias: string[] = [
        'Literatura Brasileira',
        'Literatura Estrangeira',
        'Ficção Científica',
        'Fantasia',
        'Suspense/Policial',
        'Autoajuda',
        'Didáticos',
        'Biografia',
        'História',
        'Outro'
    ];

    categoriaOptions: SelectOption[] = this.categorias.map(cat => ({ label: cat, value: cat }));

    mostrarOutraCategoria = false;

    constructor(
        private fb: FormBuilder,
        private livrosService: LivrosService,
        private router: Router,
        private route: ActivatedRoute,
        private notificationService: NotificationService
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
        const currentYear = new Date().getFullYear();
        this.form = this.fb.group({
            titulo: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(200)]],
            autor: ['', [Validators.required]],
            isbn: [''],
            editora: [''],
            anoPublicacao: [null, [Validators.min(1500), Validators.max(currentYear + 1)]],
            categoria: ['', [Validators.required]],
            outraCategoria: ['']
        });
    }

    onCategoriaChange() {
        const categoria = this.form.get('categoria')?.value;
        this.mostrarOutraCategoria = categoria === 'Outro';
        if (this.mostrarOutraCategoria) {
            this.form.get('outraCategoria')?.setValidators([Validators.required]);
        } else {
            this.form.get('outraCategoria')?.clearValidators();
            this.form.get('outraCategoria')?.setValue('');
        }
        this.form.get('outraCategoria')?.updateValueAndValidity();
    }

    private loadLivro(id: string): void {
        this.loading = true;
        this.livrosService.findOne(id).subscribe({
            next: (livro) => {
                if (livro.categoria && !this.categorias.includes(livro.categoria)) {
                    this.form.patchValue({
                        ...livro,
                        categoria: 'Outro',
                        outraCategoria: livro.categoria
                    });
                    this.mostrarOutraCategoria = true;
                } else {
                    this.form.patchValue(livro);
                }
                this.loading = false;
            },
            error: (err) => {
                const msg = 'Não foi possível carregar os dados do livro';
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

        const rawData = this.form.value;
        const formData = {
            ...rawData,
            categoria: rawData.categoria === 'Outro' ? rawData.outraCategoria : rawData.categoria
        };
        delete formData.outraCategoria;

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
                this.notificationService.success(
                    this.isEdit ? 'Livro atualizado com sucesso' : 'Livro adicionado ao acervo'
                );
                this.router.navigate(['/livros']);
            },
            error: (err) => {
                const msg = err.error?.message || 'Erro ao salvar informações do livro';
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
        if (control.errors['minlength']) return `Mínimo ${control.errors['minlength'].requiredLength} caracteres`;
        if (control.errors['maxlength']) return `Máximo ${control.errors['maxlength'].requiredLength} caracteres`;
        if (control.errors['min']) return `Mínimo: ${control.errors['min'].min}`;
        if (control.errors['max']) return `Máximo: ${control.errors['max'].max}`;

        return 'Valor inválido';
    }
}
