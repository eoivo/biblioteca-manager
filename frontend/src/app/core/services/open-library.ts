import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of, catchError } from 'rxjs';

export interface OpenLibraryBook {
    titulo: string;
    autor: string;
    editora: string;
    ano: number;
    isbn: string;
    coverUrl?: string;
}

@Injectable({
    providedIn: 'root'
})
export class OpenLibraryService {
    private readonly API_URL = 'https://openlibrary.org/api/books';

    constructor(private http: HttpClient) { }

    getBookByIsbn(isbn: string): Observable<OpenLibraryBook | null> {
        const cleanIsbn = isbn.replace(/[^0-9X]/gi, '');
        if (!cleanIsbn) return of(null);

        const query = `ISBN:${cleanIsbn}`;
        const url = `${this.API_URL}?bibkeys=${query}&format=json&jscmd=data`;

        return this.http.get<any>(url).pipe(
            map(response => {
                const data = response[query];
                if (!data) return null;

                const titulo = data.title;
                const autor = data.authors ? data.authors.map((a: any) => a.name).join(', ') : '';
                const editora = data.publishers ? data.publishers.map((p: any) => p.name).join(', ') : '';

                // Ano usually comes as "2008" or "Oct 2008"
                let ano = null;
                if (data.publish_date) {
                    const match = data.publish_date.match(/\d{4}/);
                    if (match) ano = parseInt(match[0], 10);
                }

                const coverUrl = data.cover ? data.cover.large : null;

                return {
                    titulo,
                    autor,
                    editora,
                    ano,
                    isbn: cleanIsbn,
                    coverUrl
                } as OpenLibraryBook;
            }),
            catchError((err) => {
                console.error('Error fetching from Open Library', err);
                return of(null);
            })
        );
    }

    searchBooksByTitle(title: string): Observable<OpenLibraryBook[]> {
        if (!title || title.length < 3) return of([]);

        const url = `https://openlibrary.org/search.json?title=${encodeURIComponent(title)}&limit=5`;

        return this.http.get<any>(url).pipe(
            map(response => {
                if (!response.docs) return [];
                return response.docs.map((doc: any) => ({
                    titulo: doc.title,
                    autor: doc.author_name ? doc.author_name.slice(0, 3).join(', ') : '',
                    editora: doc.publisher ? doc.publisher[0] : '',
                    ano: doc.first_publish_year,
                    isbn: doc.isbn ? doc.isbn[0] : '',
                    coverUrl: doc.cover_i ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg` : null
                }));
            }),
            catchError((err) => {
                console.error('Error searching Open Library', err);
                return of([]);
            })
        );
    }
}
