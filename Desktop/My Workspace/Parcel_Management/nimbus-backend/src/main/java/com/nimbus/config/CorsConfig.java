package com.nimbus.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * CorsConfig — Cross-Origin Resource Sharing configuration.
 *
 * This allows the frontend (running on a different port or file://) to
 * make API calls to the Spring Boot backend at http://localhost:8080.
 *
 * Without CORS, the browser blocks requests from different origins.
 * Example: nimbus/login.html (file://) calling http://localhost:8080/api/auth/login
 */
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("*")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*");
    }
}
