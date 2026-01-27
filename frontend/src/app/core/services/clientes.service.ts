import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Cliente, CreateClienteDto, UpdateClienteDto, PaginatedResponse } from '../models';

@Injectable({
    providedIn: 'root'
})
export class ClientesService {
    private readonly apiUrl = `${environment.apiUrl}/clientes`;

    constructor(private http: HttpClient) { }

    /**
     * Lista todos os clientes ou filtra por termo de busca com paginação
     */
    findAll(q?: string, page: number = 1, limit: number = 10, sortField: string = 'createdAt', sortDirection: 'asc' | 'desc' = 'desc'): Observable<PaginatedResponse<Cliente>> {
        const params: any = { page, limit, sortField, sortDirection };
        if (q) params.q = q;

        return this.http.get<PaginatedResponse<Cliente>>(this.apiUrl, { params }).pipe(
            catchError(this.handleError)
        );
    }

    /**
     * Busca cliente por ID
     */
    findOne(id: string): Observable<Cliente> {
        return this.http.get<Cliente>(`${this.apiUrl}/${id}`).pipe(
            catchError(this.handleError)
        );
    }

    /**
     * Busca cliente por CPF
     */
    findByCpf(cpf: string): Observable<Cliente> {
        return this.http.get<Cliente>(`${this.apiUrl}/cpf/${cpf}`).pipe(
            catchError(this.handleError)
        );
    }

    /**
     * Cria um novo cliente
     */
    create(cliente: CreateClienteDto): Observable<Cliente> {
        return this.http.post<Cliente>(this.apiUrl, cliente).pipe(
            catchError(this.handleError)
        );
    }

    /**
     * Atualiza um cliente existente
     */
    update(id: string, cliente: UpdateClienteDto): Observable<Cliente> {
        return this.http.put<Cliente>(`${this.apiUrl}/${id}`, cliente).pipe(
            catchError(this.handleError)
        );
    }

    /**
     * Remove um cliente
     */
    remove(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
            catchError(this.handleError)
        );
    }

    /**
     * Tratamento de erros HTTP
     * Preserva o HttpErrorResponse para que os componentes possam acessar status, message, etc.
     */
    private handleError(error: HttpErrorResponse) {
        // Retornar o erro HTTP original para permitir tratamento específico nos componentes
        return throwError(() => error);
    }
}
