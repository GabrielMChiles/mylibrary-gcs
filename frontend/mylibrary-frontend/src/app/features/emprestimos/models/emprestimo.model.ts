import { Livro } from '../../livros/models/livro.model';

export interface Emprestimo {
  id?: number;
  livroId: number;
  livroTitulo: string;
  nomePessoa: string;
  telefonePessoa: string;
  dataEmprestimo: string; 
  dataDevolucaoPrevista: string;
  dataDevolucaoEfetiva?: string;
}

export interface EmprestimoRequest {
  livroId: number;
  nomePessoa: string;
  telefonePessoa: string;
}