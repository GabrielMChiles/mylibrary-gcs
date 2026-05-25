package com.senai.mylibrary_backend.controller;

import com.senai.mylibrary_backend.dto.AtrasadoResponseDTO;
import com.senai.mylibrary_backend.dto.DashboardResponseDTO;
import com.senai.mylibrary_backend.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    // Rota única que alimenta todos os KPIs e o Top 5 (RF05)
    @GetMapping
    public ResponseEntity<DashboardResponseDTO> obterMétricas() {
        return ResponseEntity.ok(dashboardService.obterDadosDashboard());
    }

    // Rota dedicada ao relatório de inadimplência (RF06)
    @GetMapping("/atrasados")
    public ResponseEntity<List<AtrasadoResponseDTO>> obterRelatorioAtrasados() {
        return ResponseEntity.ok(dashboardService.listarAtrasados());
    }
}