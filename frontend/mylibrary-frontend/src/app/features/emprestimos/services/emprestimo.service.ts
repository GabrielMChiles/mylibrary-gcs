import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Emprestimo, EmprestimoRequest } from '../models/emprestimo.model';

@Injectable({
  providedIn: 'root'
})
export class EmprestimoService {
  
  private apiUrl = 'http://localhost:8080/api/emprestimos';

  constructor(private http: HttpClient) {}

  // Busca geral para a tela de gestão
  listarTodos(): Observable<Emprestimo[]> {
    return this.http.get<Emprestimo[]>(this.apiUrl);
  }

  // Busca específica para o botão de histórico na tela de Livros
  listarHistoricoPorLivro(livroId: number): Observable<Emprestimo[]> {
    return this.http.get<Emprestimo[]>(`${this.apiUrl}/livro/${livroId}`);
  }

  // Gravar novo empréstimo
  realizarEmprestimo(dados: EmprestimoRequest): Observable<Emprestimo> {
    return this.http.post<Emprestimo>(this.apiUrl, dados);
  }

  // Registrar devolução e liberar o livro
  registrarDevolucao(id: number): Observable<Emprestimo> {
    return this.http.put<Emprestimo>(`${this.apiUrl}/${id}/devolucao`, {});
  }
}