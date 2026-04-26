package com.nimbus;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.ServletComponentScan;

/**
 * NimbusApplication — Spring Boot main entry point.
 *
 * This starts the embedded Tomcat server with:
 *   - REST API controllers (Phase 4)
 *   - Servlet endpoints (Phase 3)
 *   - JSP pages (Phase 3)
 *   - Static frontend files (Phase 1 HTML/CSS/JS)
 *   - H2 database console
 *
 * HOW TO RUN IN ECLIPSE:
 *   Right-click this file > Run As > Spring Boot App
 *   (or Run As > Java Application)
 *
 * ENDPOINTS:
 *   http://localhost:8080/             → Static frontend (login.html)
 *   http://localhost:8080/h2-console   → Database browser
 *   http://localhost:8080/servlet/*    → Servlet/JSP pages (Phase 3)
 *   http://localhost:8080/api/*        → REST APIs (Phase 4)
 */
@SpringBootApplication
@ServletComponentScan
public class NimbusApplication {

    public static void main(String[] args) {
        SpringApplication.run(NimbusApplication.class, args);
        System.out.println("\n========================================");
        System.out.println("  NIMBUS is running!");
        System.out.println("  Frontend:    http://localhost:8080/login.html");
        System.out.println("  H2 Console:  http://localhost:8080/h2-console");
        System.out.println("  REST API:    http://localhost:8080/api/");
        System.out.println("  Servlets:    http://localhost:8080/servlet/login");
        System.out.println("========================================\n");
    }
}
