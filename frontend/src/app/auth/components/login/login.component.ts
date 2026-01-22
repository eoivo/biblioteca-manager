import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LucideAngularModule, Lock, LogIn, Library, Mail } from 'lucide-angular';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule, LucideAngularModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent {
    identifier = 'admin';
    password = '';
    error = '';
    loading = false;

    readonly LockIcon = Lock;
    readonly LogInIcon = LogIn;
    readonly LibraryIcon = Library;
    readonly MailIcon = Mail;

    constructor(
        private authService: AuthService,
        private router: Router,
        private notificationService: NotificationService
    ) { }

    onSubmit() {
        if (!this.identifier || !this.password) {
            this.notificationService.warning('Por favor, preencha todos os campos', 'Campos Obrigatórios');
            return;
        }

        this.loading = true;
        this.error = '';

        this.authService.login(this.identifier, this.password).subscribe({
            next: (success: boolean) => {
                this.loading = false;
                if (success) {
                    this.notificationService.success('Bem-vindo de volta ao BiblioManager!', 'Autenticação Concluída');
                    this.router.navigate(['/dashboard']);
                }
            },
            error: (err) => {
                this.loading = false;
                const msg = err.error?.message || 'Credenciais inválidas. Tente admin / admin123';
                this.notificationService.error(msg, 'Falha no Login');
                this.error = msg;
            }
        });
    }
}
