export interface Categoria {
  id?: number;          // Opcional (?) porque ao criar uma categoria nova, ela ainda não tem ID
  nome: string;
  descricao?: string;   // Opcional pq nos RF não obriga a descrição
  quantidadeLivros?: number; // Retornado pelo backend no DTO para exibição na lista
}