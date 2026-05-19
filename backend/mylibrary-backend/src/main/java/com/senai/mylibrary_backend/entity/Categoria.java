package com.senai.mylibrary_backend.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tb_categoria")
public class Categoria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // O nome da categoria deve ser único (unique = true)
    @Column(nullable = false, unique = true, length = 100)
    private String nome;

    @Column(length = 255)
    private String descricao;

    // Relacionamento 1 para N com Livros
    @OneToMany(mappedBy = "categoria")
    private List<Livro> livros = new ArrayList<>();

    public Categoria() {}

    public Categoria(String nome, String descricao) {
        this.nome = nome;
        this.descricao = descricao;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }
    public List<Livro> getLivros() { return livros; }
    public void setLivros(List<Livro> livros) { this.livros = livros; }
}