package com.senai.mylibrary_backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.senai.mylibrary_backend.dto.CategoriaRequestDTO;
import com.senai.mylibrary_backend.dto.CategoriaResponseDTO;
import com.senai.mylibrary_backend.service.CategoriaService;

import java.util.List;

@RestController
@RequestMapping("/api/categorias")
// Importante para permitir que seu Angular em localhost acesse a API
@CrossOrigin(origins = "*") 
public class CategoriaController {

    private final CategoriaService service;

    public CategoriaController(CategoriaService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<CategoriaResponseDTO>> listar() {
        return ResponseEntity.ok(service.listarTodas());
    }

    @PostMapping
    public ResponseEntity<CategoriaResponseDTO> criar(@RequestBody CategoriaRequestDTO dto) {
        CategoriaResponseDTO novaCategoria = service.salvar(dto);
        // Retorna 201 (Created)
        return ResponseEntity.status(HttpStatus.CREATED).body(novaCategoria);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        service.excluir(id);
        // Retorna 204 (No Content)
        return ResponseEntity.noContent().build();
    }
}