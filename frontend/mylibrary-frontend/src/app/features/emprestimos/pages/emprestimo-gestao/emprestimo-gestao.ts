import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Emprestimo, EmprestimoRequest } from '../../models/emprestimo.model';
import { EmprestimoService } from '../../services/emprestimo.service';
import { LivroService } from '../../../livros/services/livro.service';
import { StatusLivro } from '../../../livros/models/status-livro.enum';
import { Livro } from '../../../livros/models/livro.model';



@Component({
  selector: 'app-emprestimo-gestao',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    TagModule,
    DialogModule,
    InputTextModule,
    SelectModule,
    ConfirmDialogModule,
    TooltipModule
  ],
  providers: [ConfirmationService],
  templateUrl: './emprestimo-gestao.html',
  styleUrl: './emprestimo-gestao.css'
})
export class EmprestimoGestao implements OnInit {

  emprestimos: Emprestimo[] = [];
  livrosDisponiveis: any[] = [];
  
  exibirModalNovo: boolean = false;
  formEmprestimo!: FormGroup;

  constructor(
    private emprestimoService: EmprestimoService,
    private livroService: LivroService,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.carregarEmprestimos();
    this.iniciarFormulario();
  }

  iniciarFormulario() {
    this.formEmprestimo = this.fb.group({
      livroId: [null, Validators.required],
      nomePessoa: ['', Validators.required],
      telefonePessoa: ['', Validators.required]
    });
  }

  carregarEmprestimos() {
    this.emprestimoService.listarTodos().subscribe({
      next: (res) => this.emprestimos = res,
      error: () => this.mostrarMensagem('error', 'Erro ao carregar lista de empréstimos.')
    });
  }

  abrirModalNovo() {
    // Ao abrir o modal, buscamos APENAS livros com status DISPONIVEL (CA03.1)
    this.livroService.listarComFiltros(undefined, StatusLivro.DISPONIVEL).subscribe({
      next: (res: Livro[]) => {
        this.livrosDisponiveis = res.map(l => ({ label: l.titulo, value: l.id }));
        this.formEmprestimo.reset();
        this.exibirModalNovo = true;
      },
      error: () => this.mostrarMensagem('error', 'Erro ao buscar livros disponíveis.')
    });
  }

  salvarEmprestimo() {
    if (this.formEmprestimo.invalid) return;

    const request: EmprestimoRequest = this.formEmprestimo.value;

    this.emprestimoService.realizarEmprestimo(request).subscribe({
      next: () => {
        this.mostrarMensagem('success', 'Empréstimo registrado com sucesso!');
        this.exibirModalNovo = false;
        this.carregarEmprestimos(); // Atualiza a tabela
      },
      error: (err) => this.mostrarMensagem('error', err.error?.message || 'Erro ao registrar empréstimo.')
    });
  }

  confirmarDevolucao(emprestimo: Emprestimo) {
    this.confirmationService.confirm({
      message: `Confirmar devolução do livro "${emprestimo.livroTitulo}" por ${emprestimo.nomePessoa}?`,
      header: 'Registrar Devolução',
      icon: 'pi pi-check-circle',
      acceptLabel: 'Confirmar Devolução',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        this.emprestimoService.registrarDevolucao(emprestimo.id!).subscribe({
          next: () => {
            this.mostrarMensagem('success', 'Devolução efetivada. O livro está disponível novamente.');
            this.carregarEmprestimos();
          },
          error: (err) => this.mostrarMensagem('error', err.error?.message || 'Erro ao processar devolução.')
        });
      }
    });
  }

  private mostrarMensagem(severidade: string, texto: string) {
    this.messageService.add({ severity: severidade, summary: severidade === 'success' ? 'Sucesso' : 'Erro', detail: texto, life: 4000 });
  }
}