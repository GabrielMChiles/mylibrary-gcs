package com.senai.mylibrary_backend.dto;

import java.util.List;

public record DashboardResponseDTO(
    Long totalLivros,
    Long totalDisponiveis,
    Long totalEmprestados,
    Long totalEmprestimosAtivos,
    List<EmprestimoResponseDTO> ultimosEmprestimos
) {}