package com.senai.mylibrary_backend.dto;

import java.time.LocalDate;

public record AtrasadoResponseDTO(
    Long emprestimoId,
    String livroTitulo,
    String nomePessoa,
    LocalDate dataDevolucaoPrevista,
    Long diasDeAtraso
) {}