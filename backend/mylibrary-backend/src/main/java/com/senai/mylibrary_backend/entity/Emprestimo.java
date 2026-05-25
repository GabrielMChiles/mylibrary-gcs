package com.senai.mylibrary_backend.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "tb_emprestimo")
public class Emprestimo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String nomePessoa;

    @Column(nullable = false, length = 20)
    private String telefonePessoa;

    @Column(nullable = false)
    private LocalDate dataEmprestimo;

    @Column(nullable = false)
    private LocalDate dataDevolucaoPrevista;

    // Pode ser nulo, pois o livro só recebe essa data quando for devolvido
    private LocalDate dataDevolucaoEfetiva;

    @ManyToOne
    @JoinColumn(name = "livro_id", nullable = false)
    private Livro livro;

    public Emprestimo() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNomePessoa() { return nomePessoa; }
    public void setNomePessoa(String nomePessoa) { this.nomePessoa = nomePessoa; }

    public String getTelefonePessoa() { return telefonePessoa; }
    public void setTelefonePessoa(String telefonePessoa) 
    { this.telefonePessoa = telefonePessoa; }

    public LocalDate getDataEmprestimo() { return dataEmprestimo; }
    public void setDataEmprestimo(LocalDate dataEmprestimo) 
    { this.dataEmprestimo = dataEmprestimo; }

    public LocalDate getDataDevolucaoPrevista() { return dataDevolucaoPrevista; }
    public void setDataDevolucaoPrevista(LocalDate dataDevolucaoPrevista) 
    { this.dataDevolucaoPrevista = dataDevolucaoPrevista; }

    public LocalDate getDataDevolucaoEfetiva() { return dataDevolucaoEfetiva; }
    public void setDataDevolucaoEfetiva(LocalDate dataDevolucaoEfetiva) 
    { this.dataDevolucaoEfetiva = dataDevolucaoEfetiva; }

    public Livro getLivro() { return livro; }
    public void setLivro(Livro livro) { this.livro = livro; }
}