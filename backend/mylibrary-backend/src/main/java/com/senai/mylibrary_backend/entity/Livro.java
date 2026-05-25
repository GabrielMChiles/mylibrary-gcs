package com.senai.mylibrary_backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "tb_livro")
public class Livro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String titulo;

    @Column(nullable = false, length = 100)
    private String autor;

    @Column(length = 20)
    private String isbn;

    private Integer ano;

    // Adicionado o Enum mapeado como String
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private StatusLivro status;

    @ManyToOne
    @JoinColumn(name = "categoria_id", nullable = false)
    private Categoria categoria;

    public Livro() {}

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }

    public String getAutor() { return autor; }
    public void setAutor(String autor) { this.autor = autor; }

    public String getIsbn() { return isbn; }
    public void setIsbn(String isbn) { this.isbn = isbn; }

    public Integer getAno() { return ano; }
    public void setAno(Integer ano) { this.ano = ano; }

    public StatusLivro getStatus() { return status; }
    public void setStatus(StatusLivro status) { this.status = status; }

    public Categoria getCategoria() { return categoria; }
    public void setCategoria(Categoria categoria) { this.categoria = categoria; }
}