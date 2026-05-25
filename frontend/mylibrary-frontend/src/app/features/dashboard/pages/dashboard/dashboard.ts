import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// Módulos do PrimeNG
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { Atrasado, DashboardMetrics } from '../../models/dashboard.model';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    TagModule,
    ButtonModule
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  metricas: DashboardMetrics | null = null;
  atrasados: Atrasado[] = [];
  
  carregandoMetricas: boolean = true;
  carregandoAtrasados: boolean = true;

  constructor(
    private dashboardService: DashboardService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.carregarDados();
  }

  carregarDados() {
    this.carregandoMetricas = true;
    this.dashboardService.obterMetricas().subscribe({
      next: (res) => {
        this.metricas = res;
        this.carregandoMetricas = false;
      },
      error: () => {
        this.mostrarMensagem('error', 'Falha ao carregar as métricas do acervo.');
        this.carregandoMetricas = false;
      }
    });

    this.carregandoAtrasados = true;
    this.dashboardService.obterRelatorioAtrasados().subscribe({
      next: (res) => {
        this.atrasados = res;
        this.carregandoAtrasados = false;
      },
      error: () => {
        this.mostrarMensagem('error', 'Falha ao carregar o relatório de inadimplência.');
        this.carregandoAtrasados = false;
      }
    });
  }

  private mostrarMensagem(severidade: string, texto: string) {
    this.messageService.add({ severity: severidade, summary: 'Erro', detail: texto, life: 4000 });
  }
}