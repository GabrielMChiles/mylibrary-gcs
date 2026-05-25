import { Livro } from '../../livros/models/livro.model';

export interface Emprestimo {
  id?: number;
  livroId: number;
  livroTitulo: string;
  nomePessoa: string;
  telefonePessoa: string;
  dataEmprestimo: string; // Vem como string ISO (YYYY-MM-DD) do backend
  dataDevolucaoPrevista: string;
  dataDevolucaoEfetiva?: string;
}