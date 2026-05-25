import { StatusLivro } from './status-livro.enum';

export interface Livro {
  id?: number;
  titulo: string;
  autor: string;
  isbn: string;
  ano: number;
  status?: StatusLivro;
  categoriaId: number;
  categoriaNome?: string;
}