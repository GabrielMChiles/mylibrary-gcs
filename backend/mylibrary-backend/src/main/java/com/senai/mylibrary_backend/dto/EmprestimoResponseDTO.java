package com.senai.mylibrary_backend.dto;

import java.time.LocalDate;

public record EmprestimoResponseDTO(
    Long id,
    Long livroId,
    String livroTitulo,
    String nomePessoa,
    String telefonePessoa,
    LocalDate dataEmprestimo,
    LocalDate dataDevolucaoPrevista,
    LocalDate dataDevolucaoEfetiva
) {}