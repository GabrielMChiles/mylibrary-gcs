import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { EmprestimoService } from '../../services/emprestimo.service';
import { LivroService } from '../../../livros/services/livro.service';
import { StatusLivro } from '../../../livros/models/status-livro.enum';
import { EmprestimoRequest } from '../../models/emprestimo.model';
import { Livro } from '../../../livros/models/livro.model';


@Component({
  selector: 'app-emprestimo-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    SelectModule,
    ButtonModule
  ],
  templateUrl: './emprestimo-form.html',
  styleUrl: './emprestimo-form.css'
})
export class EmprestimoForm implements OnInit {

  formEmprestimo!: FormGroup;
  livrosDisponiveis: any[] = [];

  constructor(
    private fb: FormBuilder,
    private emprestimoService: EmprestimoService,
    private livroService: LivroService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.iniciarFormulario();
    this.carregarLivrosDisponiveis();
  }

  iniciarFormulario() {
    this.formEmprestimo = this.fb.group({
      livroId: [null, Validators.required],
      nomePessoa: ['', Validators.required],
      telefonePessoa: ['', Validators.required]
    });
  }

  carregarLivrosDisponiveis() {
    this.livroService.listarComFiltros(undefined, StatusLivro.DISPONIVEL).subscribe({
      next: (res: Livro[]) => {
        this.livrosDisponiveis = res.map(l => ({ label: l.titulo, value: l.id }));
      },
      error: () => this.mostrarMensagem('error', 'Erro ao carregar livros disponíveis.')
    });
  }

  salvar() {
    if (this.formEmprestimo.invalid) return;

    const request: EmprestimoRequest = this.formEmprestimo.value;

    this.emprestimoService.realizarEmprestimo(request).subscribe({
      next: () => {
        this.mostrarMensagem('success', 'Empréstimo registrado!');
        this.router.navigate(['/emprestimos']); // Volta pra lista
      },
      error: (err) => this.mostrarMensagem('error', err.error?.message || 'Erro ao registrar empréstimo.')
    });
  }

  cancelar() {
    this.router.navigate(['/emprestimos']);
  }

  private mostrarMensagem(severidade: string, texto: string) {
    this.messageService.add({ severity: severidade, summary: severidade === 'success' ? 'Sucesso' : 'Erro', detail: texto, life: 4000 });
  }
}