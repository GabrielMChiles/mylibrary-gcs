package com.senai.mylibrary_backend.service;

import org.springframework.stereotype.Service;

import com.senai.mylibrary_backend.dto.LivroRequestDTO;
import com.senai.mylibrary_backend.dto.LivroResponseDTO;
import com.senai.mylibrary_backend.entity.Categoria;
import com.senai.mylibrary_backend.entity.Livro;
import com.senai.mylibrary_backend.entity.StatusLivro;
import com.senai.mylibrary_backend.repository.CategoriaRepository;
import com.senai.mylibrary_backend.repository.LivroRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LivroService {

    private final LivroRepository livroRepository;
    private final CategoriaRepository categoriaRepository;

    public LivroService(LivroRepository livroRepository, CategoriaRepository categoriaRepository) {
        this.livroRepository = livroRepository;
        this.categoriaRepository = categoriaRepository;
    }

    // Recebe os filtros opcionais da tela
    public List<LivroResponseDTO> listarComFiltros(Long categoriaId, String statusString, String busca) {
        StatusLivro statusEnum = null;
        
        // Se o front mandar "TODOS" ou vazio, tratamos como nulo para a query ignorar o filtro
        if (statusString != null && !statusString.isBlank() && !"TODOS".equalsIgnoreCase(statusString)) {
            statusEnum = StatusLivro.valueOf(statusString.toUpperCase());
        }
        
        // Limpa o texto de busca se vier só espaços em branco
        String buscaTratada = (busca != null && !busca.isBlank()) ? busca.trim() : null;

        return livroRepository.buscarComFiltrosAvancados(categoriaId, statusEnum, buscaTratada)
                .stream()
                .map(this::converterParaResponseDTO)
                .collect(Collectors.toList());
    }

    public LivroResponseDTO buscarPorId(Long id) {
        Livro livro = livroRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Livro nao encontrado com ID: " + id));
        return converterParaResponseDTO(livro);
    }

    public LivroResponseDTO salvar(LivroRequestDTO dto) {
        if (dto.categoriaId() == null) {
            throw new RuntimeException("O livro precisa estar vinculado a uma categoria.");
        }

        Categoria categoria = categoriaRepository.findById(dto.categoriaId())
                .orElseThrow(() -> new RuntimeException("Categoria informada nao existe."));

        Livro livro = new Livro();
        livro.setTitulo(dto.titulo());
        livro.setAutor(dto.autor());
        livro.setIsbn(dto.isbn());
        livro.setAno(dto.ano());
        
        // Garantindo que sempre nasça dispon no cadastro inicial
        livro.setStatus(StatusLivro.DISPONIVEL);
        livro.setCategoria(categoria);

        Livro livroSalvo = livroRepository.save(livro);
        return converterParaResponseDTO(livroSalvo);
    }

    public LivroResponseDTO atualizar(Long id, LivroRequestDTO dto) {
        Livro livroExistente = livroRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Livro nao encontrado com ID: " + id));

        Categoria categoria = categoriaRepository.findById(dto.categoriaId())
                .orElseThrow(() -> new RuntimeException("Categoria informada nao existe."));

        livroExistente.setTitulo(dto.titulo());
        livroExistente.setAutor(dto.autor());
        livroExistente.setIsbn(dto.isbn());
        livroExistente.setAno(dto.ano());
        
        // Na atualizacao mantem o status atual ou o enviado pelo form
        if (dto.status() != null) {
            livroExistente.setStatus(dto.status());
        }
        livroExistente.setCategoria(categoria);

        Livro livroAtualizado = livroRepository.save(livroExistente);
        return converterParaResponseDTO(livroAtualizado);
    }

    // Trava de seguranca de exclusao
    public void excluir(Long id) {
        Livro livro = livroRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Livro nao encontrado com ID: " + id));

        // Se o status for qualquer coisa diferente de DISPONIVEL, bloqueia
        if (livro.getStatus() != StatusLivro.DISPONIVEL) {
            throw new RuntimeException("Nao e possivel excluir um livro com status: " + livro.getStatus() + 
                    ". Apenas livros DISPONIVEIS podem ser removidos.");
        }

        livroRepository.delete(livro);
    }

    private LivroResponseDTO converterParaResponseDTO(Livro livro) {
        return new LivroResponseDTO(
                livro.getId(),
                livro.getTitulo(),
                livro.getAutor(),
                livro.getIsbn(),
                livro.getAno(),
                livro.getStatus(),
                livro.getCategoria().getId(),
                livro.getCategoria().getNome()
        );
    }
}