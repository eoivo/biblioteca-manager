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
    findAll(q?: string, page: number = 1, limit: number = 10): Observable<PaginatedResponse<Cliente>> {
        const params: any = { page, limit };
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
     */
    private handleError(error: HttpErrorResponse) {
        let errorMessage = 'Ocorreu um erro desconhecido';

        if (error.error instanceof ErrorEvent) {
            // Erro do lado do cliente
            errorMessage = error.error.message;
        } else {
            // Erro do lado do servidor
            switch (error.status) {
                case 400:
                    errorMessage = error.error?.message || 'Dados inválidos';
                    break;
                case 404:
                    errorMessage = 'Registro não encontrado';
                    break;
                case 409:
                    errorMessage = error.error?.message || 'CPF já cadastrado';
                    break;
                case 500:
                    errorMessage = 'Erro interno do servidor';
                    break;
                default:
                    errorMessage = error.error?.message || 'Erro ao processar requisição';
            }
        }

        return throwError(() => new Error(errorMessage));
    }
}
