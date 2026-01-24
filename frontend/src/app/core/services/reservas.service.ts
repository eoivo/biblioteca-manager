import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Reserva, CreateReservaDto, PaginatedResponse } from '../models';

@Injectable({
  providedIn: 'root',
})
export class ReservasService {
  private readonly apiUrl = `${environment.apiUrl}/reservas`;

  constructor(private http: HttpClient) {}

  findAll(
    page: number = 1,
    limit: number = 10,
    status?: string,
  ): Observable<PaginatedResponse<Reserva>> {
    const params: any = { page, limit };
    if (status) params.status = status;

    return this.http
      .get<PaginatedResponse<Reserva>>(this.apiUrl, { params })
      .pipe(catchError(this.handleError));
  }

  findAtrasadas(): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(`${this.apiUrl}/atrasadas`).pipe(catchError(this.handleError));
  }

  findByCliente(clienteId: string): Observable<Reserva[]> {
    return this.http
      .get<Reserva[]>(`${this.apiUrl}/cliente/${clienteId}`)
      .pipe(catchError(this.handleError));
  }

  findOne(id: string): Observable<Reserva> {
    return this.http.get<Reserva>(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
  }

  create(reserva: CreateReservaDto): Observable<Reserva> {
    return this.http.post<Reserva>(this.apiUrl, reserva).pipe(catchError(this.handleError));
  }

  devolver(id: string): Observable<Reserva> {
    return this.http
      .put<Reserva>(`${this.apiUrl}/${id}/devolver`, {})
      .pipe(catchError(this.handleError));
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
  }

  gerarRelatorioCaixa(dataInicio?: string, dataFim?: string): void {
    let url = `${this.apiUrl}/relatorio-caixa`;
    const params: string[] = [];

    if (dataInicio) {
      params.push(`inicio=${dataInicio}`);
    }
    if (dataFim) {
      params.push(`fim=${dataFim}`);
    }

    if (params.length > 0) {
      url += '?' + params.join('&');
    }

    // Fazer download do arquivo
    window.open(url, '_blank');
  }

  private handleError(error: any) {
    let errorMessage = 'Ocorreu um erro desconhecido';
    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.status === 400) {
      errorMessage = error.error?.message || 'Operação inválida';
    }
    return throwError(() => new Error(errorMessage));
  }
}
