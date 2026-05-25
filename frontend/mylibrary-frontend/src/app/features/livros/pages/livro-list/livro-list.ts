import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

// Módulos do PrimeNG
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select'; 
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { ConfirmationService, MessageService } from 'primeng/api';

import { Livro } from '../../models/livro.model';
import { LivroService } from '../../services/livro.service';
import { CategoriaService } from '../../../categorias/services/categoria.service';
import { EmprestimoService } from '../../../emprestimos/services/emprestimo.service';
import { Emprestimo } from '../../../emprestimos/models/emprestimo.model';
import { StatusLivro } from '../../models/status-livro.enum';

@Component({
  selector: 'app-livro-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    TagModule,
    InputTextModule,
    SelectModule,
    ConfirmDialogModule,
    TooltipModule,
    DialogModule
  ],
  providers: [ConfirmationService],
  templateUrl: './livro-list.html',
  styleUrl: './livro-list.css'
})
export class LivroList implements OnInit {

  livros: Livro[] = [];
  categorias: any[] = []; 

  // Variáveis dos filtros
  filtroBusca: string = '';
  filtroCategoria: number | null = null;
  filtroStatus: string = 'TODOS';

  // Ajustado: Apenas os status reais pedidos pelo professor
  opcoesStatus = [
    { label: 'Todos os Status', value: 'TODOS' },
    { label: 'Disponível', value: 'DISPONIVEL' },
    { label: 'Emprestado', value: 'EMPRESTADO' }
  ];

  // Controle do Modal de Histórico (CA02.7)
  exibirModalHistorico: boolean = false;
  livroSelecionadoTitulo: string = '';
  historicoEmprestimos: Emprestimo[] = [];
  carregandoHistorico: boolean = false;

  // Controle do Modal de Visualização de Detalhes
  exibirModalVisualizar: boolean = false;
  livroDetalhe: Livro | null = null;

  constructor(
    private livroService: LivroService,
    private categoriaService: CategoriaService,
    private emprestimoService: EmprestimoService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.carregarFiltroCategorias();
    this.carregarLivros();
  }

  carregarFiltroCategorias() {
    this.categoriaService.listarCategorias().subscribe({ 
      next: (res) => {
        this.categorias = res.map(cat => ({ label: cat.nome, value: cat.id }));
        this.categorias.unshift({ label: 'Todas as Categorias', value: null });
      },
      error: () => this.mostrarMensagem('error', 'Falha ao carregar categorias para o filtro.')
    });
  }

  carregarLivros() {
    this.livroService.listarComFiltros(this.filtroCategoria || undefined, this.filtroStatus, this.filtroBusca).subscribe({
      next: (res) => this.livros = res,
      error: () => this.mostrarMensagem('error', 'Erro ao carregar o acervo de livros.')
    });
  }

  aplicarFiltros() {
    this.carregarLivros();
  }

  limparFiltros() {
    this.filtroBusca = '';
    this.filtroCategoria = null;
    this.filtroStatus = 'TODOS';
    this.carregarLivros();
  }

  irParaNovoLivro() {
    this.router.navigate(['/livros/novo']);
  }

  // Abre o modal de Detalhes do Livro
  visualizarLivro(livro: Livro) {
    this.livroDetalhe = livro;
    this.exibirModalVisualizar = true;
  }

  // Abre o modal de Histórico de Empréstimos (CA02.7)
  abrirHistorico(livro: Livro) {
    this.livroSelecionadoTitulo = livro.titulo;
    this.exibirModalHistorico = true;
    this.carregandoHistorico = true;

    this.emprestimoService.listarHistoricoPorLivro(livro.id!).subscribe({
      next: (res) => {
        this.historicoEmprestimos = res;
        this.carregandoHistorico = false;
      },
      error: () => {
        this.mostrarMensagem('error', 'Não foi possível carregar o histórico deste livro.');
        this.carregandoHistorico = false;
      }
    });
  }

  excluirLivro(livro: Livro) {
    if (livro.status !== StatusLivro.DISPONIVEL) {
      this.mostrarMensagem('warn', `Bloqueado: Não é possível excluir um livro que está ${livro.status}.`);
      return;
    }

    this.confirmationService.confirm({
      message: `Tem certeza que deseja excluir "${livro.titulo}" do acervo?`,
      header: 'Confirmar Exclusão',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim, excluir',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.livroService.excluir(livro.id!).subscribe({
          next: () => {
            this.mostrarMensagem('success', 'Livro removido com sucesso!');
            this.carregarLivros();
          },
          error: (err) => this.mostrarMensagem('error', err.error?.message || 'Erro ao excluir o livro.')
        });
      }
    });
  }

  // Ajustado: Removido o case do Reservado
  getSeverityStatus(status: StatusLivro | undefined): 'success' | 'warn' | 'secondary' {
    switch (status) {
      case StatusLivro.DISPONIVEL: return 'success';
      case StatusLivro.EMPRESTADO: return 'warn';
      default: return 'secondary';
    }
  }

  private mostrarMensagem(severidade: string, texto: string) {
    this.messageService.add({
      severity: severidade,
      summary: severidade === 'success' ? 'Sucesso' : severidade === 'warn' ? 'Atenção' : 'Erro',
      detail: texto,
      life: 4000
    });
  }
}