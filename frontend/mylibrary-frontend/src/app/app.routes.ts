import { Routes } from '@angular/router';
import { CategoriaList } from './features/categorias/pages/categoria-list/categoria-list';
import { CategoriaForm } from './features/categorias/pages/categoria-form/categoria-form';
import { LivroList } from './features/livros/pages/livro-list/livro-list';
import { LivroForm } from './features/livros/pages/livro-form/livro-form';
import { EmprestimoGestao } from './features/emprestimos/pages/emprestimo-gestao/emprestimo-gestao';

export const routes: Routes = [

    { path: '', redirectTo: '/categorias', pathMatch: 'full' },
    { path: 'categorias', component: CategoriaList },
    { path: 'categorias/nova', component: CategoriaForm },
    { path: 'livros', component: LivroList },
    { path: 'livros/novo', component: LivroForm },
    { path: 'emprestimos', component: EmprestimoGestao },




];
