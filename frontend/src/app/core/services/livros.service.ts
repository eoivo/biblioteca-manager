import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Livro, CreateLivroDto, UpdateLivroDto, PaginatedResponse } from '../models';

@Injectable({
    providedIn: 'root'
})
export class LivrosService {
    private readonly apiUrl = `${environment.apiUrl}/livros`;

    constructor(private http: HttpClient) { }

    findAll(q?: string, page: number = 1, limit: number = 10): Observable<PaginatedResponse<Livro>> {
        const params: any = { page, limit };
        if (q) params.q = q;

        return this.http.get<PaginatedResponse<Livro>>(this.apiUrl, { params }).pipe(
            catchError(this.handleError)
        );
    }

    findDisponiveis(): Observable<Livro[]> {
        return this.http.get<Livro[]>(`${this.apiUrl}/disponiveis`).pipe(
            catchError(this.handleError)
        );
    }

    findOne(id: string): Observable<Livro> {
        return this.http.get<Livro>(`${this.apiUrl}/${id}`).pipe(
            catchError(this.handleError)
        );
    }

    create(livro: CreateLivroDto): Observable<Livro> {
        return this.http.post<Livro>(this.apiUrl, livro).pipe(
            catchError(this.handleError)
        );
    }

    update(id: string, livro: UpdateLivroDto): Observable<Livro> {
        return this.http.put<Livro>(`${this.apiUrl}/${id}`, livro).pipe(
            catchError(this.handleError)
        );
    }

    remove(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
            catchError(this.handleError)
        );
    }

    private handleError(error: any) {
        let errorMessage = 'Ocorreu um erro desconhecido';
        if (error.error?.message) {
            errorMessage = error.error.message;
        } else if (error.status === 404) {
            errorMessage = 'Livro não encontrado';
        } else if (error.status === 400) {
            errorMessage = error.error?.message || 'Dados inválidos';
        }
        return throwError(() => new Error(errorMessage));
    }
}
