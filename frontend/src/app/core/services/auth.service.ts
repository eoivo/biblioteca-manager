import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private loggedIn = new BehaviorSubject<boolean>(this.hasToken());

    constructor(private router: Router) { }

    private hasToken(): boolean {
        return !!localStorage.getItem('auth_token');
    }

    isLoggedIn(): Observable<boolean> {
        return this.loggedIn.asObservable();
    }

    login(password: string): Observable<boolean> {
        // Simples validação para o desafio
        if (password === 'admin123') {
            localStorage.setItem('auth_token', 'fake-jwt-token');
            this.loggedIn.next(true);
            return of(true);
        }
        return of(false);
    }

    logout() {
        localStorage.removeItem('auth_token');
        this.loggedIn.next(false);
        this.router.navigate(['/login']);
    }
}
