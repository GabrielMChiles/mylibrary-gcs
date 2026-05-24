package com.senai.mylibrary_backend.dto;

import com.senai.mylibrary_backend.entity.StatusLivro;

public record LivroRequestDTO(
    String titulo,
    String autor,
    String isbn,
    Integer ano,
    StatusLivro status,
    Long categoriaId
) {}