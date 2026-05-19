package com.senai.mylibrary_backend.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.senai.mylibrary_backend.dto.CategoriaRequestDTO;
import com.senai.mylibrary_backend.dto.CategoriaResponseDTO;
import com.senai.mylibrary_backend.entity.Categoria;
import com.senai.mylibrary_backend.repository.CategoriaRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoriaService {

    private final CategoriaRepository repository;

    // Injeção de dependência via construtor 
    public CategoriaService(CategoriaRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<CategoriaResponseDTO> listarTodas() {
        return repository.findAll().stream()
                .map(CategoriaResponseDTO::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public CategoriaResponseDTO salvar(CategoriaRequestDTO dto) {
        // Nome categoria deve ser único
        if (repository.existsByNome(dto.nome())) {
            throw new RuntimeException("Já existe uma categoria com este nome.");
        }

        Categoria categoria = new Categoria(dto.nome(), dto.descricao());
        categoria = repository.save(categoria);
        return new CategoriaResponseDTO(categoria);
    }

    @Transactional
    public void excluir(Long id) {
        Categoria categoria = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoria não encontrada."));

        // Não pode excluir se houver livros vinculados
        if (!categoria.getLivros().isEmpty()) {
            throw new RuntimeException("Não é possível excluir a categoria pois existem livros vinculados a ela.");
        }

        repository.delete(categoria);
    }
}