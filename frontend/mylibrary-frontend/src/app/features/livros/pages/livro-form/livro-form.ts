import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';

import { LivroService } from '../../services/livro.service';
import { StatusLivro } from '../../models/status-livro.enum';
import { CategoriaService } from '../../../categorias/services/categoria.service';

@Component({
  selector: 'app-livro-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    SelectModule,
    ButtonModule
  ],
  templateUrl: './livro-form.html',
  styleUrl: './livro-form.css'
})
export class LivroForm implements OnInit {
  
  formLivro!: FormGroup;
  categorias: any[] = [];
  
  // Opcoes pro select de status
  opcoesStatus = [
    { label: 'Disponível', value: StatusLivro.DISPONIVEL },
    { label: 'Emprestado', value: StatusLivro.EMPRESTADO },
    { label: 'Reservado', value: StatusLivro.RESERVADO }
  ];

  constructor(
    private fb: FormBuilder,
    private livroService: LivroService,
    private categoriaService: CategoriaService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.iniciarFormulario();
    this.carregarCategorias();
  }

  iniciarFormulario() {
    this.formLivro = this.fb.group({
      titulo: ['', Validators.required],
      autor: ['', Validators.required],
      isbn: [''], // ISBN geralmente nao é obrigatorio em bibliotecas pequenas
      ano: ['', [Validators.required, Validators.min(1000), Validators.max(new Date().getFullYear())]],
      categoriaId: [null, Validators.required],
      
      // O form ja nasce preenchido com DISPONIVEL
      status: [StatusLivro.DISPONIVEL, Validators.required] 
    });
  }

  carregarCategorias() {
    this.categoriaService.listarCategorias().subscribe({
      next: (res) => {
        // Mapeia pro formato que o p-select exige
        this.categorias = res.map(cat => ({ label: cat.nome, value: cat.id }));
      },
      error: () => {
        this.mostrarMensagem('error', 'Falha ao carregar as categorias no formulário.');
      }
    });
  }

  salvar() {
    if (this.formLivro.invalid) {
      this.mostrarMensagem('warn', 'Por favor, preencha todos os campos obrigatórios corretamente.');
      return;
    }

    const dadosLivro = this.formLivro.value;

    this.livroService.salvar(dadosLivro).subscribe({
      next: () => {
        this.mostrarMensagem('success', 'Livro cadastrado com sucesso no acervo!');
        this.router.navigate(['/livros']);
      },
      error: (err) => {
        this.mostrarMensagem('error', 'Erro ao salvar o livro no banco de dados.');
      }
    });
  }

  voltar() {
    this.router.navigate(['/livros']);
  }

  private mostrarMensagem(severidade: string, texto: string) {
    this.messageService.add({
      severity: severidade,
      summary: severidade === 'success' ? 'Sucesso' : severidade === 'warn' ? 'Atenção' : 'Erro',
      detail: texto,
      life: 3000
    });
  }
}