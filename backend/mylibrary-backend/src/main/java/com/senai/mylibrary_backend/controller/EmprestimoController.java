package com.senai.mylibrary_backend.controller;

import com.senai.mylibrary_backend.dto.EmprestimoRequestDTO;
import com.senai.mylibrary_backend.dto.EmprestimoResponseDTO;
import com.senai.mylibrary_backend.service.EmprestimoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/emprestimos")
public class EmprestimoController {

    private final EmprestimoService emprestimoService;

    public EmprestimoController(EmprestimoService emprestimoService) {
        this.emprestimoService = emprestimoService;
    }

    @PostMapping
    public ResponseEntity<EmprestimoResponseDTO> realizarEmprestimo(@RequestBody EmprestimoRequestDTO dto) {
        EmprestimoResponseDTO novoEmprestimo = emprestimoService.emprestar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoEmprestimo);
    }

    @PutMapping("/{id}/devolucao")
    public ResponseEntity<EmprestimoResponseDTO> realizarDevolucao(@PathVariable Long id) {
        EmprestimoResponseDTO devolucao = emprestimoService.devolver(id);
        return ResponseEntity.ok(devolucao);
    }

    @GetMapping("/livro/{livroId}")
    public ResponseEntity<List<EmprestimoResponseDTO>> listarHistoricoPorLivro(@PathVariable Long livroId) {
        return ResponseEntity.ok(emprestimoService.listarHistoricoPorLivro(livroId));
    }

    @GetMapping
    public ResponseEntity<List<EmprestimoResponseDTO>> listarTodos() {
    return ResponseEntity.ok(emprestimoService.listarTodos());
}
}