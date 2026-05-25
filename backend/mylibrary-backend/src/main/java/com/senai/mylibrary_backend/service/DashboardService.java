package com.senai.mylibrary_backend.service;

import com.senai.mylibrary_backend.dto.AtrasadoResponseDTO;
import com.senai.mylibrary_backend.dto.DashboardResponseDTO;
import com.senai.mylibrary_backend.dto.EmprestimoResponseDTO;
import com.senai.mylibrary_backend.entity.Emprestimo;
import com.senai.mylibrary_backend.entity.StatusLivro;
import com.senai.mylibrary_backend.repository.EmprestimoRepository;
import com.senai.mylibrary_backend.repository.LivroRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final LivroRepository livroRepository;
    private final EmprestimoRepository streamEmprestimoRepository;

    public DashboardService(LivroRepository livroRepository, EmprestimoRepository streamEmprestimoRepository) {
        this.livroRepository = livroRepository;
        this.streamEmprestimoRepository = streamEmprestimoRepository;
    }

    @Transactional(readOnly = true)
    public DashboardResponseDTO obterDadosDashboard() {
        // Coleta
        long totalLivros = livroRepository.count();
        long totalDisponiveis = livroRepository.countByStatus(StatusLivro.DISPONIVEL);
        long totalEmprestados = livroRepository.countByStatus(StatusLivro.EMPRESTADO);
        long totalAtivos = streamEmprestimoRepository.countByDataDevolucaoEfetivaIsNull();

        // Pega exatamente os 5 últimos empréstimos salvos
        List<EmprestimoResponseDTO> ultimos5 = streamEmprestimoRepository.findUltimosEmprestimos(PageRequest.of(0, 5))
                .stream()
                .map(this::converterParaEmprestimoDTO)
                .collect(Collectors.toList());

        return new DashboardResponseDTO(totalLivros, totalDisponiveis, totalEmprestados, totalAtivos, ultimos5);
    }

    @Transactional(readOnly = true)
    public List<AtrasadoResponseDTO> listarAtrasados() {
        LocalDate hoje = LocalDate.now();

        // Calcula matematicamente
        return streamEmprestimoRepository.buscarAtrasados(hoje)
                .stream()
                .map(e -> {
                    long diasAtraso = ChronoUnit.DAYS.between(e.getDataDevolucaoPrevista(), hoje);
                    
                    return new AtrasadoResponseDTO(
                            e.getId(),
                            e.getLivro().getTitulo(),
                            e.getNomePessoa(),
                            e.getDataDevolucaoPrevista(),
                            diasAtraso
                    );
                })
                .collect(Collectors.toList());
    }

    private EmprestimoResponseDTO converterParaEmprestimoDTO(Emprestimo e) {
        return new EmprestimoResponseDTO(
                e.getId(),
                e.getLivro().getId(),
                e.getLivro().getTitulo(),
                e.getNomePessoa(),
                e.getTelefonePessoa(),
                e.getDataEmprestimo(),
                e.getDataDevolucaoPrevista(),
                e.getDataDevolucaoEfetiva()
        );
    }
}