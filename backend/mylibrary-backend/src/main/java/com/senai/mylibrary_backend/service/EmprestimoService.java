package com.senai.mylibrary_backend.service;

import com.senai.mylibrary_backend.dto.EmprestimoRequestDTO;
import com.senai.mylibrary_backend.dto.EmprestimoResponseDTO;
import com.senai.mylibrary_backend.entity.Emprestimo;
import com.senai.mylibrary_backend.entity.Livro;
import com.senai.mylibrary_backend.entity.StatusLivro;
import com.senai.mylibrary_backend.repository.EmprestimoRepository;
import com.senai.mylibrary_backend.repository.LivroRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EmprestimoService {

    private final EmprestimoRepository emprestimoRepository;
    private final LivroRepository livroRepository;

    public EmprestimoService(EmprestimoRepository emprestimoRepository, LivroRepository livroRepository) {
        this.emprestimoRepository = emprestimoRepository;
        this.livroRepository = livroRepository;
    }

    @Transactional
    public EmprestimoResponseDTO emprestar(EmprestimoRequestDTO dto) {
        Livro livro = livroRepository.findById(dto.livroId())
                .orElseThrow(() -> new RuntimeException("Livro não encontrado."));

        // Não permite emprestar livro já emprestado/reservado
        if (livro.getStatus() != StatusLivro.DISPONIVEL) {
            throw new RuntimeException("Este livro não está disponível para empréstimo. Status atual: " + livro.getStatus());
        }

        Emprestimo emprestimo = new Emprestimo();
        emprestimo.setLivro(livro);
        // Grava nome e telefone
        emprestimo.setNomePessoa(dto.nomePessoa());
        emprestimo.setTelefonePessoa(dto.telefonePessoa());
        
        // Registrar data de empréstimo (hoje) e previsão (hoje + 14 dias)
        emprestimo.setDataEmprestimo(LocalDate.now());
        emprestimo.setDataDevolucaoPrevista(LocalDate.now().plusDays(14));

        // Ao emprestar: status do livro vai pra EMPRESTADO
        livro.setStatus(StatusLivro.EMPRESTADO);
        livroRepository.save(livro);

        Emprestimo salvo = emprestimoRepository.save(emprestimo);
        return converterParaResponseDTO(salvo);
    }

    @Transactional
    public EmprestimoResponseDTO devolver(Long id) {
        Emprestimo emprestimo = emprestimoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Empréstimo não encontrado."));

        // Proteção contra duplicação
        if (emprestimo.getDataDevolucaoEfetiva() != null) {
            throw new RuntimeException("Este livro já foi devolvido anteriormente.");
        }

        Livro livro = emprestimo.getLivro();

        // Não permitir devolver livro disponível
        if (livro.getStatus() == StatusLivro.DISPONIVEL) {
            throw new RuntimeException("Inconsistência: O livro já consta como DISPONÍVEL no sistema.");
        }

        // Registrar data devolução
        emprestimo.setDataDevolucaoEfetiva(LocalDate.now());

        // Dps de devolver: status do livro vai DISPONIVEL
        livro.setStatus(StatusLivro.DISPONIVEL);
        livroRepository.save(livro);

        Emprestimo atualizado = emprestimoRepository.save(emprestimo);
        return converterParaResponseDTO(atualizado);
    }

    public List<EmprestimoResponseDTO> listarTodos() {
        return emprestimoRepository.findAll()
                .stream()
                .map(this::converterParaResponseDTO)
                .collect(Collectors.toList());
    }

    // Histórico
    public List<EmprestimoResponseDTO> listarHistoricoPorLivro(Long livroId) {
        return emprestimoRepository.findByLivroIdOrderByDataEmprestimoDesc(livroId)
                .stream()
                .map(this::converterParaResponseDTO)
                .collect(Collectors.toList());
    }

    private EmprestimoResponseDTO converterParaResponseDTO(Emprestimo e) {
        return new EmprestimoResponseDTO(
                e.getId(),
                e.getLivro().getId(),
                e.getLivro().getTitulo(),
                e.getNomePessoa(),
                e.getTelefonePessoa(),
                e.getDataEmprestimo(),
                e.getDataDevolucaoPrevista(),
                e.getDataDevolucaoEfetiva()
        );
    }
}