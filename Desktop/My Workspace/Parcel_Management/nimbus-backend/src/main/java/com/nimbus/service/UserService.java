package com.nimbus.service;

import com.nimbus.model.User;
import com.nimbus.repository.UserRepository;
import com.nimbus.util.IdGenerator;
import com.nimbus.util.InputValidator;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * UserService — Business logic for user operations.
 * Used by both Servlets (Phase 3) and REST Controllers (Phase 4).
 *
 * This layer sits between the Controller/Servlet and the Repository.
 * It contains validation, business rules, and data transformation.
 */
@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Register a new customer.
     * Validates input, checks for duplicate email, generates user ID, and saves.
     */
    public User register(String firstName, String middleName, String lastName,
                         String email, String countryCode, String mobile,
                         String street, String zipCode, String city, String state, String country,
                         String password, String confirmPassword, String preferences) {

        // Validate input
        List<String> errors = InputValidator.validateRegistration(
                firstName, lastName, email, mobile, street, zipCode, city, state, password, confirmPassword);

        if (!errors.isEmpty()) {
            throw new IllegalArgumentException("Validation failed: " + String.join("; ", errors));
        }

        // Check duplicate email
        String normalizedEmail = email.trim().toLowerCase();
        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new IllegalArgumentException("This email is already registered.");
        }

        // Generate User ID
        List<String> existingIds = userRepository.findAll().stream()
                .map(User::getUserId)
                .collect(Collectors.toList());
        String userId = IdGenerator.generateUserId(firstName.trim(), lastName.trim(), existingIds);

        // Create User
        User user = new User(userId, firstName.trim(),
                middleName != null ? middleName.trim() : "",
                lastName.trim(), normalizedEmail,
                countryCode != null ? countryCode : "+91",
                mobile.trim(), street.trim(), zipCode.trim(),
                city.trim(), state.trim(),
                country != null && !country.isEmpty() ? country.trim() : "India",
                password,
                "customer",
                preferences != null ? preferences : "Email notifications");

        return userRepository.save(user);
    }

    /**
     * Register an admin/officer user (for registerAdmin endpoint).
     */
    public User registerAdmin(String firstName, String lastName, String email,
                              String mobile, String password, String role) {

        String normalizedEmail = email.trim().toLowerCase();
        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new IllegalArgumentException("This email is already registered.");
        }

        List<String> existingIds = userRepository.findAll().stream()
                .map(User::getUserId).collect(Collectors.toList());

        // Officers and support get different ID prefix
        String userId;
        if ("officer".equals(role)) {
            long count = userRepository.findByRole("officer").size();
            userId = "OFF-" + String.format("%03d", count + 1);
        } else if ("support".equals(role)) {
            long count = userRepository.findByRole("support").size();
            userId = "SUP-" + String.format("%03d", count + 1);
        } else {
            userId = IdGenerator.generateUserId(firstName.trim(), lastName.trim(), existingIds);
        }

        User user = new User(userId, firstName.trim(), "", lastName.trim(),
                normalizedEmail, "+91", mobile.trim(),
                "Office", "000000", "Office", "Office", "India",
                password, role, "");

        return userRepository.save(user);
    }

    /**
     * Validate login credentials.
     * Returns the user if valid, throws exception if invalid.
     */
    public User validateLogin(String userId, String password) {
        if (InputValidator.isBlank(userId) || InputValidator.isBlank(password)) {
            throw new IllegalArgumentException("User ID and password are required.");
        }

        Optional<User> user = userRepository.findByUserIdAndPassword(userId.trim(), password);
        if (user.isEmpty()) {
            throw new IllegalArgumentException("Invalid credentials.");
        }

        return user.get();
    }

    /** Get a user by ID. */
    public User getUserById(String userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));
    }

    /** Get all users. */
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    /** Get users by role. */
    public List<User> getUsersByRole(String role) {
        return userRepository.findByRole(role);
    }
}
