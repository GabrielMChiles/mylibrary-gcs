package com.senai.mylibrary_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.senai.mylibrary_backend.entity.Emprestimo;

import java.util.List;

@Repository
public interface EmprestimoRepository extends JpaRepository<Emprestimo, Long> {
    
    // Traz o histórico de um livro ordenado por data
    List<Emprestimo> findByLivroIdOrderByDataEmprestimoDesc(Long livroId);
}