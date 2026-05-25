import { Component, OnInit, signal } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MenuItem } from 'primeng/api';

import { MenubarModule } from 'primeng/menubar'; 
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, RouterOutlet, MenubarModule, ToastModule], 
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  
  protected readonly title = signal('mylibrary-frontend');

  items!: MenuItem[]; 

  ngOnInit() {
    this.items = [
      { label: 'Dashboard', icon: 'pi pi-home', routerLink: '/' },
      { label: 'Categorias', icon: 'pi pi-tags', routerLink: '/categorias' },
       { label: 'Livros', icon: 'pi pi-book', routerLink: '/livros' },
       { label: 'Empréstimos', icon: 'pi pi-calendar', routerLink: '/emprestimos' }
    ];
  }
}