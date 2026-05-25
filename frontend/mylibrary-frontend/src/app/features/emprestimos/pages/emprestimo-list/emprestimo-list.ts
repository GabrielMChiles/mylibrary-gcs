import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Emprestimo } from '../../models/emprestimo.model';
import { EmprestimoService } from '../../services/emprestimo.service';


@Component({
  selector: 'app-emprestimo-list',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    TagModule,
    ConfirmDialogModule,
    TooltipModule
  ],
  providers: [ConfirmationService],
  templateUrl: './emprestimo-list.html',
  styleUrl: './emprestimo-list.css' // Pode usar o mesmo CSS de tabelas anterior
})
export class EmprestimoList implements OnInit {

  emprestimos: Emprestimo[] = [];

  constructor(
    private emprestimoService: EmprestimoService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.carregarEmprestimos();
  }

  carregarEmprestimos() {
    this.emprestimoService.listarTodos().subscribe({
      next: (res) => this.emprestimos = res,
      error: () => this.mostrarMensagem('error', 'Erro ao carregar lista de empréstimos.')
    });
  }

  // Redireciona para o componente de formulário (que o professor pediu)
  irParaNovoEmprestimo() {
    this.router.navigate(['/emprestimos/novo']);
  }

  confirmarDevolucao(emprestimo: Emprestimo) {
    this.confirmationService.confirm({
      message: `Confirmar devolução do livro "${emprestimo.livroTitulo}" por ${emprestimo.nomePessoa}?`,
      header: 'Registrar Devolução',
      icon: 'pi pi-check-circle',
      acceptLabel: 'Confirmar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass: 'p-button-secondary',

      accept: () => {
        this.emprestimoService.registrarDevolucao(emprestimo.id!).subscribe({
          next: () => {
            this.mostrarMensagem('success', 'Devolução efetivada com sucesso.');
            this.carregarEmprestimos();
          },
          error: (err) => this.mostrarMensagem('error', err.error?.message || 'Erro processar devolução.')
        });
      }
    });
  }

  private mostrarMensagem(severidade: string, texto: string) {
    this.messageService.add({ severity: severidade, summary: severidade === 'success' ? 'Sucesso' : 'Erro', detail: texto, life: 4000 });
  }
}