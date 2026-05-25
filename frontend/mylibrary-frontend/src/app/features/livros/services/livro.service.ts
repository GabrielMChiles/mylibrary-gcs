import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Livro } from '../models/livro.model';

@Injectable({
  providedIn: 'root'
})
export class LivroService {
  
  private apiUrl = 'http://localhost:8080/api/livros';

  constructor(private http: HttpClient) {}

  // Passando os filtros opcionais
  listarComFiltros(categoriaId?: number, status?: string, busca?: string): Observable<Livro[]> {
    let params = new HttpParams();
    
    if (categoriaId) params = params.set('categoriaId', categoriaId.toString());
    if (status && status !== 'TODOS') params = params.set('status', status);
    if (busca && busca.trim() !== '') params = params.set('busca', busca);

    return this.http.get<Livro[]>(this.apiUrl, { params });
  }

  buscarPorId(id: number): Observable<Livro> {
    return this.http.get<Livro>(`${this.apiUrl}/${id}`);
  }

  salvar(livro: Livro): Observable<Livro> {
    return this.http.post<Livro>(this.apiUrl, livro);
  }

  atualizar(id: number, livro: Livro): Observable<Livro> {
    return this.http.put<Livro>(`${this.apiUrl}/${id}`, livro);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}