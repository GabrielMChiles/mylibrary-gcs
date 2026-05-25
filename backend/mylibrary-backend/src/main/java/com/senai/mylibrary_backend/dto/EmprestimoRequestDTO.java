package com.senai.mylibrary_backend.dto;

public record EmprestimoRequestDTO(
    Long livroId,
    String nomePessoa,
    String telefonePessoa
) {}