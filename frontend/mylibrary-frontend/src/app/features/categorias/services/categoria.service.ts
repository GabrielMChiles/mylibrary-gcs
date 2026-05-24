import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Categoria } from '../models/categoria.model';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  // pegando o HttpClient
  private http = inject(HttpClient);

  // url da nossa api q roda no spring. 
  private apiUrl = 'http://localhost:8080/api/categorias';

  // endpoint q traz todas as categorias
  // ja vem com a qtd de livros calculada pelo DTO do back
  listarCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.apiUrl);
  }

  // manda a categoria nova pro spring salvar. 
  // o back devolve a categoria ja com o ID gerado no banco
  cadastrarCategoria(categoria: Categoria): Observable<Categoria> {
    return this.http.post<Categoria>(this.apiUrl, categoria);
  }

  // exclui a categoria pelo id. 
  // obs: se a categoria tiver livros vinculados, o back vai barrar e devolver erro
  excluirCategoria(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}