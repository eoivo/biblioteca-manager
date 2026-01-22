import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Notification {
    id: string;
    type: 'success' | 'error' | 'info' | 'warning';
    title?: string;
    message: string;
    duration?: number;
}

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private notifications$ = new BehaviorSubject<Notification[]>([]);

    getNotifications(): Observable<Notification[]> {
        return this.notifications$.asObservable();
    }

    success(message: string, title: string = 'Sucesso', duration: number = 5000) {
        this.addNotification('success', message, title, duration);
    }

    error(message: string, title: string = 'Erro', duration: number = 7000) {
        this.addNotification('error', message, title, duration);
    }

    info(message: string, title: string = 'Informação', duration: number = 5000) {
        this.addNotification('info', message, title, duration);
    }

    warning(message: string, title: string = 'Aviso', duration: number = 5000) {
        this.addNotification('warning', message, title, duration);
    }

    private addNotification(type: Notification['type'], message: string, title?: string, duration?: number) {
        const id = Math.random().toString(36).substr(2, 9);
        const notification: Notification = { id, type, title, message, duration };

        const current = this.notifications$.value;
        this.notifications$.next([...current, notification]);

        if (duration !== 0) {
            setTimeout(() => {
                this.remove(id);
            }, duration || 5000);
        }
    }

    remove(id: string) {
        const current = this.notifications$.value;
        this.notifications$.next(current.filter(n => n.id !== id));
    }
}
