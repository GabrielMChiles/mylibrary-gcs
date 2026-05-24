import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';

import { Categoria } from '../../models/categoria.model';
import { CategoriaService } from '../../services/categoria.service';

@Component({
  selector: 'app-categoria-list',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    ConfirmDialogModule
  ],
  providers: [ConfirmationService], 
  templateUrl: './categoria-list.html',
  styleUrl: './categoria-list.css',
})
export class CategoriaList implements OnInit {

constructor(
    private categoriaService: CategoriaService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  categorias: Categoria[] = [];

  ngOnInit() {
    // qnd a tela carregar, chama a busca no banco
    this.carregarCategorias();
  }

  carregarCategorias() {
    this.categoriaService.listarCategorias().subscribe({
      next: (dados) => {
        this.categorias = dados;

        // se não vier nada, joga um aviso na tela usando o toast
        if (this.categorias.length === 0) {
          this.exibirMensagem('info', 'Nenhuma categoria encontrada.', 'Seu acervo está vazio.');
        }
      },
      error: (err) => {
        this.exibirMensagem('error', 'Erro de Conexão', 'Não foi possível carregar as categorias.');
      }
    });
  }

  // chama o popup brabo do primeng pra confirmar antes de deletar
  excluirCategoria(categoria: Categoria) {
    this.confirmationService.confirm({
      message: `Deseja excluir a categoria <b>${categoria.nome}</b>?`,
      header: 'Confirmação de Exclusão',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Excluir',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        // chamar o back
        this.categoriaService.excluirCategoria(categoria.id!).subscribe({
          next: () => {
            this.exibirMensagem('success', 'Sucesso!', 'Categoria excluída com sucesso.');
            // atualiza a tabela pra sumir a linha deletada
            this.carregarCategorias(); 
          },
          error: (err) => {
            // se der erro, provavelmente é a regra de não apagar categoria com livros (RN02 do pdf)
            this.exibirMensagem(
              'error', 
              'Exclusão Bloqueada', 
              'Não é possível excluir esta categoria pois há livros vinculados a ela.'
            );
          }
        });
      }
    });
  }

  // redireciona pro form de criacao
  navegarParaNovaCategoria() {
    this.router.navigate(['/categorias/nova']);
  }

  // funçãozinha utilitária economizar código
  private exibirMensagem(tipo: string, titulo: string, texto: string) {
    this.messageService.add({ 
      severity: tipo, 
      summary: titulo, 
      detail: texto, 
      life: 4000 // tempo q o toast fica na tela
    });
  }
}