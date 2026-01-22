import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, User, Mail, Shield, Calendar } from 'lucide-angular';
import { AuthService } from '../../core/services/auth.service';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.scss'
})
export class ProfileComponent {
    private authService = inject(AuthService);
    user$ = this.authService.user$;

    readonly UserIcon = User;
    readonly MailIcon = Mail;
    readonly ShieldIcon = Shield;
    readonly CalendarIcon = Calendar;
}
