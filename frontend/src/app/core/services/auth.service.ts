import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap, map } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private loggedIn = new BehaviorSubject<boolean>(this.hasToken());
    private currentUserSubject = new BehaviorSubject<any>(this.getUser());
    user$ = this.currentUserSubject.asObservable();

    constructor(
        private router: Router,
        private http: HttpClient
    ) { }

    private hasToken(): boolean {
        return !!localStorage.getItem('auth_token');
    }

    private getUser(): any {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }

    isLoggedIn(): Observable<boolean> {
        return this.loggedIn.asObservable();
    }

    getCurrentUser(): Observable<any> {
        return this.currentUserSubject.asObservable();
    }

    login(identifier: string, password: string): Observable<boolean> {
        return this.http.post<any>(`${environment.apiUrl}/auth/login`, { identifier, password })
            .pipe(
                tap(response => {
                    localStorage.setItem('auth_token', response.access_token);
                    localStorage.setItem('user', JSON.stringify(response.user));
                    this.loggedIn.next(true);
                    this.currentUserSubject.next(response.user);
                }),
                map(() => true)
            );
    }

    logout() {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        this.loggedIn.next(false);
        this.currentUserSubject.next(null);
        this.router.navigate(['/login']);
    }
}
