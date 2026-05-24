package com.senai.mylibrary_backend.dto;

import com.senai.mylibrary_backend.entity.StatusLivro;

public record LivroResponseDTO(
    Long id,
    String titulo,
    String autor,
    String isbn,
    Integer ano,
    StatusLivro status,
    Long categoriaId,
    String categoriaNome
) {}