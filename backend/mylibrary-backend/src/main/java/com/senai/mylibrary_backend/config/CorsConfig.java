package com.senai.mylibrary_backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Aplica o CORS a todos os endpoints da API (/api/categorias, /api/livros)
                .allowedOrigins("http://localhost:4200") // Permite a rota
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Permite as requisições
                .allowedHeaders("*") // Permite qualquer cabeçalho
                .allowCredentials(true); // Caso usar token na implementação
    }
}