# Changelog

## [1.0.1] - 2026-05-25
### Fixed
- Corrigida falha de validação no Service Layer que permitia a exclusão de livros com status EMPRESTADO (#7)

## [1.0.0] - 2026-05-25
### Added
- RF01: CRUD Categorias com validação de exclusão (#1)
- RF02: CRUD Livros com filtros e status (#3)
- RF03: Sistema de empréstimos (emprestar/devolver) (#5)
- Pipeline CI: build backend (Maven) e frontend (Angular)
- Status automático: DISPONIVEL ↔ EMPRESTADO
### Technical
- 3 Entidades: Categoria, Livro, Emprestimo
- Service Layer com lógica emprestar/devolver
- Branch protection configurado no main

## [0.1.0] - 2026-05-25
### Added
- Configuração inicial do repositório