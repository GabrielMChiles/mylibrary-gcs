import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

// Modulos do PrimeNG pra nossa interface rica
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmationService, MessageService } from 'primeng/api';

import { Livro } from '../../models/livro.model';
import { LivroService } from '../../services/livro.service';
import { StatusLivro } from '../../models/status-livro.enum';
import { SelectModule } from 'primeng/select';
import { CategoriaService } from '../../../categorias/services/categoria.service';

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
    TooltipModule
  ],
  providers: [ConfirmationService],
  templateUrl: './livro-list.html',
  styleUrl: './livro-list.css'
})
export class LivroList implements OnInit {

  livros: Livro[] = [];
  categorias: any[] = []; // Array formatado pro dropdown

  // Variaveis pros filtros
  filtroBusca: string = '';
  filtroCategoria: number | null = null;
  filtroStatus: string = 'TODOS';

  opcoesStatus = [
    { label: 'Todos os Status', value: 'TODOS' },
    { label: 'Disponível', value: 'DISPONIVEL' },
    { label: 'Emprestado', value: 'EMPRESTADO' },
    { label: 'Reservado', value: 'RESERVADO' }
  ];

  constructor(
    private livroService: LivroService,
    private categoriaService: CategoriaService,
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
        // Formata os dados pro formato que o Dropdown do PrimeNG entende
        this.categorias = res.map(cat => ({ label: cat.nome, value: cat.id }));
        // Joga a opcao de "Todas" no topo da lista
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
    // Chamado sempre que o usuario digitar no input ou mudar um select
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

  excluirLivro(livro: Livro) {
    // Não deixa excluir livro emprestado
    if (livro.status !== StatusLivro.DISPONIVEL) {
      this.mostrarMensagem('warn', `Bloqueado: Não é possível excluir um livro que está ${livro.status}.`);
      return;
    }

    this.confirmationService.confirm({
      message: `Deseja excluir "${livro.titulo}" do acervo?`,
      header: 'Confirmar Exclusão',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Excluir',
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

  // Metodo auxiliar para estilizacao
  getSeverityStatus(status: StatusLivro | undefined): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
    switch (status) {
      case StatusLivro.DISPONIVEL: return 'success';
      case StatusLivro.EMPRESTADO: return 'warn';
      case StatusLivro.RESERVADO: return 'info';
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