package com.senai.mylibrary_backend.repository;

import com.senai.mylibrary_backend.entity.Emprestimo;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface EmprestimoRepository extends JpaRepository<Emprestimo, Long> {
    
    List<Emprestimo> findByLivroIdOrderByDataEmprestimoDesc(Long livroId);

    @Modifying
    void deleteByLivroId(Long livroId);
    
    // Conta quantos empréstimos estão ativos (sem data de devolução)
    long countByDataDevolucaoEfetivaIsNull();

    // Busca os últimos empréstimos limitados pra fazer o Top 5
    @Query("SELECT e FROM Emprestimo e ORDER BY e.dataEmprestimo DESC, e.id DESC")
    List<Emprestimo> findUltimosEmprestimos(Pageable pageable);

    // Busca empréstimos não devolvidos que venceram antes da data informada
    @Query("SELECT e FROM Emprestimo e WHERE e.dataDevolucaoEfetiva IS NULL AND e.dataDevolucaoPrevista < :hoje")
    List<Emprestimo> buscarAtrasados(@Param("hoje") LocalDate hoje);
}