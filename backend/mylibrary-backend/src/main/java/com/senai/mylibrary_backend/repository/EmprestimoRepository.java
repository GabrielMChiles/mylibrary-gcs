package com.senai.mylibrary_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.senai.mylibrary_backend.entity.Emprestimo;

import java.util.List;

@Repository
public interface EmprestimoRepository extends JpaRepository<Emprestimo, Long> {
    
    // Traz o histórico de um livro ordenado por data
    List<Emprestimo> findByLivroIdOrderByDataEmprestimoDesc(Long livroId);

    @Modifying
    @Query("DELETE FROM Emprestimo e WHERE e.livro.id = :livroId")
    void deletarPorLivroId(@Param("livroId") Long livroId);
}