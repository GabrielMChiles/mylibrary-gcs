package com.senai.mylibrary_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.senai.mylibrary_backend.entity.Livro;
import com.senai.mylibrary_backend.entity.StatusLivro;

import java.util.List;

@Repository
public interface LivroRepository extends JpaRepository<Livro, Long> {

    List<Livro> findByCategoriaId(Long categoriaId);
    long countByCategoriaId(Long categoriaId);
    boolean existsByCategoriaId(Long categoriaId);

    // Filtro dinâmico acumulativo
    @Query("SELECT l FROM Livro l WHERE " +
           "(:categoriaId IS NULL OR l.categoria.id = :categoriaId) AND " +
           "(:status IS NULL OR l.status = :status) AND " +
           "(:busca IS NULL OR LOWER(l.titulo) LIKE LOWER(CONCAT('%', :busca, '%')) " +
           "OR LOWER(l.autor) LIKE LOWER(CONCAT('%', :busca, '%')))")
    List<Livro> buscarComFiltrosAvancados(
            @Param("categoriaId") Long categoriaId,
            @Param("status") StatusLivro status,
            @Param("busca") String busca
    );
}