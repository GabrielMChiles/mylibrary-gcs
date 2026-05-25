import { Routes } from '@angular/router';
import { CategoriaList } from './features/categorias/pages/categoria-list/categoria-list';
import { CategoriaForm } from './features/categorias/pages/categoria-form/categoria-form';
import { LivroList } from './features/livros/pages/livro-list/livro-list';
import { LivroForm } from './features/livros/pages/livro-form/livro-form';
import { Dashboard } from './features/dashboard/pages/dashboard/dashboard';
import { EmprestimoList } from './features/emprestimos/pages/emprestimo-list/emprestimo-list';
import { EmprestimoForm } from './features/emprestimos/pages/emprestimo-form/emprestimo-form';

export const routes: Routes = [

    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: 'categorias', component: CategoriaList },
    { path: 'categorias/nova', component: CategoriaForm },
    { path: 'livros', component: LivroList },
    { path: 'livros/novo', component: LivroForm },
    { path: 'emprestimos', component: EmprestimoList },
    { path: 'emprestimos/novo', component: EmprestimoForm },
    { path: 'dashboard', component: Dashboard },
];
