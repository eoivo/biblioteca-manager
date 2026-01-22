import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface ViaCepResponse {
    cep: string;
    logradouro: string;
    complemento: string;
    bairro: string;
    localidade: string;
    uf: string;
    erro?: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class CepService {
    private readonly baseUrl = 'https://viacep.com.br/ws';

    constructor(private http: HttpClient) { }

    buscar(cep: string): Observable<ViaCepResponse | null> {
        const cleanedCep = cep.replace(/\D/g, '');
        if (cleanedCep.length !== 8) {
            return of(null);
        }

        return this.http.get<ViaCepResponse>(`${this.baseUrl}/${cleanedCep}/json/`).pipe(
            map(res => res.erro ? null : res),
            catchError(() => of(null))
        );
    }
}
