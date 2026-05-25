export interface EmprestimoResumo {
  id: number;
  livroTitulo: string;
  nomePessoa: string;
  dataEmprestimo: string;
}

export interface DashboardMetrics {
  totalLivros: number;
  totalDisponiveis: number;
  totalEmprestados: number;
  totalEmprestimosAtivos: number;
  ultimosEmprestimos: EmprestimoResumo[];
}

export interface Atrasado {
  emprestimoId: number;
  livroTitulo: string;
  nomePessoa: string;
  dataDevolucaoPrevista: string;
  diasDeAtraso: number;
}