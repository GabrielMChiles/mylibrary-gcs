package com.senai.mylibrary_backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.senai.mylibrary_backend.dto.LivroRequestDTO;
import com.senai.mylibrary_backend.dto.LivroResponseDTO;
import com.senai.mylibrary_backend.service.LivroService;

import java.util.List;

@RestController
@RequestMapping("/api/livros")
public class LivroController {

    private final LivroService livroService;

    public LivroController(LivroService livroService) {
        this.livroService = livroService;
    }

    // Rota que suporta filtros
    @GetMapping
    public ResponseEntity<List<LivroResponseDTO>> listarComFiltros(
            @RequestParam(value = "categoriaId", required = false) Long categoriaId,
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "busca", required = false) String busca
    ) {
        List<LivroResponseDTO> livros = livroService.listarComFiltros(categoriaId, status, busca);
        return ResponseEntity.ok(livros);
    }

    @GetMapping("/{id}")
    public ResponseEntity<LivroResponseDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(livroService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<LivroResponseDTO> criar(@RequestBody LivroRequestDTO livroDTO) {
        LivroResponseDTO novoLivro = livroService.salvar(livroDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoLivro);
    }

    @PutMapping("/{id}")
    public ResponseEntity<LivroResponseDTO> atualizar(@PathVariable Long id, @RequestBody LivroRequestDTO livroDTO) {
        return ResponseEntity.ok(livroService.atualizar(id, livroDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        livroService.excluir(id);
        return ResponseEntity.noContent().build();
    }
}