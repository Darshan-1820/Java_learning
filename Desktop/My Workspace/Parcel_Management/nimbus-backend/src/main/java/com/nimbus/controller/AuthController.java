package com.nimbus.controller;

import com.nimbus.dto.ApiResponse;
import com.nimbus.dto.LoginRequest;
import com.nimbus.dto.LoginResponse;
import com.nimbus.dto.RegisterRequest;
import com.nimbus.model.User;
import com.nimbus.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * AuthController — Phase 4 REST API for authentication.
 *
 * Endpoints (matching TCS Sprint 3 requirements):
 *   POST /api/auth/login            → validateLogin
 *   POST /api/auth/register         → registerCustomer
 *   POST /api/auth/register-admin   → registerAdmin
 *   GET  /api/auth/user/{userId}    → getUserDetails
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    /**
     * POST /api/auth/login
     * TCS Sprint 3: validateLogin
     *
     * Request:  { "userId": "260401-AK01", "password": "Amit@123" }
     * Response: { "success": true, "message": "...", "user": {...} }
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        try {
            User user = userService.validateLogin(request.getUserId(), request.getPassword());

            LoginResponse.UserDTO dto = mapToDTO(user);
            LoginResponse response = new LoginResponse(true, "Login successful.", dto);
            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            LoginResponse response = new LoginResponse(false, e.getMessage(), null);
            return ResponseEntity.status(401).body(response);
        }
    }

    /**
     * POST /api/auth/register
     * TCS Sprint 3: registerCustomer
     */
    @PostMapping("/register")
    public ResponseEntity<ApiResponse> register(@RequestBody RegisterRequest request) {
        try {
            User user = userService.register(
                    request.getFirstName(), request.getMiddleName(), request.getLastName(),
                    request.getEmail(), request.getCountryCode(), request.getMobile(),
                    request.getStreet(), request.getZipCode(), request.getCity(),
                    request.getState(), request.getCountry(),
                    request.getPassword(), request.getConfirmPassword(),
                    request.getPreferences());

            LoginResponse.UserDTO dto = mapToDTO(user);
            return ResponseEntity.ok(ApiResponse.ok("Registration successful. User ID: " + user.getUserId(), dto));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * POST /api/auth/register-admin
     * TCS Sprint 3: registerAdmin
     */
    @PostMapping("/register-admin")
    public ResponseEntity<ApiResponse> registerAdmin(@RequestBody RegisterRequest request) {
        try {
            String role = request.getRole() != null ? request.getRole() : "officer";
            User user = userService.registerAdmin(
                    request.getFirstName(), request.getLastName(),
                    request.getEmail(), request.getMobile(),
                    request.getPassword(), role);

            return ResponseEntity.ok(ApiResponse.ok("Admin registered. User ID: " + user.getUserId(), mapToDTO(user)));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * GET /api/auth/user/{userId}
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse> getUser(@PathVariable String userId) {
        try {
            User user = userService.getUserById(userId);
            return ResponseEntity.ok(ApiResponse.ok(mapToDTO(user)));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).body(ApiResponse.error(e.getMessage()));
        }
    }

    // --- Map User entity to DTO (strips password) ---
    private LoginResponse.UserDTO mapToDTO(User user) {
        LoginResponse.UserDTO dto = new LoginResponse.UserDTO();
        dto.setUserId(user.getUserId());
        dto.setFirstName(user.getFirstName());
        dto.setMiddleName(user.getMiddleName());
        dto.setLastName(user.getLastName());
        dto.setFullName(user.getFullName());
        dto.setEmail(user.getEmail());
        dto.setCountryCode(user.getCountryCode());
        dto.setMobile(user.getMobile());
        dto.setStreet(user.getStreet());
        dto.setZipCode(user.getZipCode());
        dto.setCity(user.getCity());
        dto.setState(user.getState());
        dto.setCountry(user.getCountry());
        dto.setRole(user.getRole());
        dto.setPreferences(user.getPreferences());
        dto.setCreatedAt(user.getCreatedAt() != null ? user.getCreatedAt().toString() : null);
        return dto;
    }
}
