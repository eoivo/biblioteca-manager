import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LucideAngularModule, Lock, LogIn, Library } from 'lucide-angular';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule, LucideAngularModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent {
    password = '';
    error = '';
    loading = false;

    readonly LockIcon = Lock;
    readonly LogInIcon = LogIn;
    readonly LibraryIcon = Library;

    constructor(private authService: AuthService, private router: Router) { }

    onSubmit() {
        this.loading = true;
        this.error = '';

        this.authService.login(this.password).subscribe((success: boolean) => {
            this.loading = false;
            if (success) {
                this.router.navigate(['/dashboard']);
            } else {
                this.error = 'Senha incorreta. Tente "admin123"';
            }
        });
    }
}
