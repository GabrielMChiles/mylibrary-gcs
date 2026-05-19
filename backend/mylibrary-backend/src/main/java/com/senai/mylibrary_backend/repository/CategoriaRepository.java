package com.senai.mylibrary_backend.repository;

import com.senai.mylibrary_backend.entity.Categoria;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoriaRepository extends JpaRepository<Categoria, Long> {
    
    // Método para validar a RN01 (Nome único) antes de salvar
    boolean existsByNome(String nome);
}