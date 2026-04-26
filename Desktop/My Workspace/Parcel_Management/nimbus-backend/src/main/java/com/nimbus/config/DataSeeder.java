package com.nimbus.config;

import com.nimbus.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

/**
 * DataSeeder — Runs on application startup.
 * Logs the initial data state. The actual seed data comes from data.sql.
 */
@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;

    public DataSeeder(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void run(String... args) {
        long userCount = userRepository.count();
        System.out.println("[DataSeeder] Database initialized with " + userCount + " users.");
        System.out.println("[DataSeeder] Demo credentials:");
        System.out.println("  Customer: 260401-AK01 / Amit@123");
        System.out.println("  Officer:  OFF-001 / Officer@123");
        System.out.println("  Support:  SUP-001 / Support@123");
    }
}
