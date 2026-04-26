package com.nimbus.config;

import com.nimbus.servlet.BookingServlet;
import com.nimbus.servlet.DashboardServlet;
import com.nimbus.servlet.LoginServlet;
import com.nimbus.servlet.RegisterServlet;
import com.nimbus.servlet.TrackingServlet;
import org.springframework.boot.web.servlet.ServletRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * ServletConfig — Registers traditional Servlets inside Spring Boot.
 *
 * This lets us demonstrate Phase 3 Servlets alongside Phase 4 REST controllers.
 * Each Servlet is mapped to /servlet/* URLs.
 *
 * In a pure Servlet project (no Spring Boot), you'd configure these in web.xml.
 * Spring Boot's ServletRegistrationBean is the Java-config equivalent.
 */
@Configuration
public class ServletConfig {

    @Bean
    public ServletRegistrationBean<LoginServlet> loginServlet() {
        return new ServletRegistrationBean<>(new LoginServlet(), "/servlet/login");
    }

    @Bean
    public ServletRegistrationBean<RegisterServlet> registerServlet() {
        return new ServletRegistrationBean<>(new RegisterServlet(), "/servlet/register");
    }

    @Bean
    public ServletRegistrationBean<BookingServlet> bookingServlet() {
        return new ServletRegistrationBean<>(new BookingServlet(), "/servlet/booking");
    }

    @Bean
    public ServletRegistrationBean<TrackingServlet> trackingServlet() {
        return new ServletRegistrationBean<>(new TrackingServlet(), "/servlet/tracking");
    }

    @Bean
    public ServletRegistrationBean<DashboardServlet> dashboardServlet() {
        return new ServletRegistrationBean<>(new DashboardServlet(), "/servlet/dashboard");
    }
}
