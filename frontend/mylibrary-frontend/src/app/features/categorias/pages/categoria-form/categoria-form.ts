import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';

import { CategoriaService } from '../../services/categoria.service';

@Component({
  selector: 'app-categoria-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    TextareaModule,
    ButtonModule
  ],
  templateUrl: './categoria-form.html',
  styleUrl: './categoria-form.css'
})
export class CategoriaForm implements OnInit {
  
  // variavel q vai segurar os dados da tela
  formCategoria!: FormGroup;

  // mantendo o construtor pra nao bugar a injeção do vite
  constructor(
    private fb: FormBuilder,
    private categoriaService: CategoriaService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    // montando as regras do form. nome é obrigatorio
    this.formCategoria = this.fb.group({
      nome: ['', Validators.required],
      descricao: ['']
    });
  }

  salvar() {
    // Barra se tentar salvar vazio
    if (this.formCategoria.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Preencha os campos obrigatórios.',
        life: 3000
      });
      return;
    }

    // pega os valores digitados e manda pro back
    const dados = this.formCategoria.value;
    
    this.categoriaService.cadastrarCategoria(dados).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Categoria cadastrada no acervo!',
          life: 3000
        });
        // volta pra tabela dps q salvar
        this.router.navigate(['/categorias']);
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Falha ao salvar categoria no banco.',
          life: 4000
        });
      }
    });
  }

  // botao de cancelar e voltar
  voltar() {
    this.router.navigate(['/categorias']);
  }
}