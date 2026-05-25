package com.senai.mylibrary_backend.dto;

import com.senai.mylibrary_backend.entity.Categoria;

public record CategoriaResponseDTO(Long id, String nome, String descricao, int quantidadeLivros) {
    
    // Construtor que converte uma Entidade para DTO e já calcula os livros
    public CategoriaResponseDTO(Categoria entity) {
        this(
            entity.getId(), 
            entity.getNome(), 
            entity.getDescricao(), 
            entity.getLivros() != null ? entity.getLivros().size() : 0
        );
    }
}