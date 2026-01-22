import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-angular';
import { NotificationService, Notification } from '../../../core/services/notification.service';

@Component({
    selector: 'app-notification',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    templateUrl: './notification.component.html',
    styleUrl: './notification.component.scss'
})
export class NotificationComponent {
    private notificationService = inject(NotificationService);
    notifications$ = this.notificationService.getNotifications();

    readonly CheckIcon = CheckCircle;
    readonly ErrorIcon = AlertCircle;
    readonly InfoIcon = Info;
    readonly WarningIcon = AlertTriangle;
    readonly CloseIcon = X;

    remove(id: string) {
        this.notificationService.remove(id);
    }
}
