package com.nimbus.repository;

import com.nimbus.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * UserRepository — Spring Data JPA interface for the users table.
 *
 * This replaces UserDAO from Phase 2. Instead of writing SQL manually,
 * Spring generates the SQL from method names automatically.
 *
 * Phase 2: UserDAO.findByEmail("amit@email.com")  → manual SQL + PreparedStatement
 * Phase 3: userRepository.findByEmail("amit@email.com") → Spring generates the SQL
 *
 * JpaRepository provides: save(), findById(), findAll(), deleteById(), count(), etc.
 * We just add custom query methods below.
 */
@Repository
public interface UserRepository extends JpaRepository<User, String> {

    /** Find a user by email address (for duplicate check). */
    Optional<User> findByEmail(String email);

    /** Validate login: find user by both userId and password. */
    Optional<User> findByUserIdAndPassword(String userId, String password);

    /** Get all users with a specific role (customer, officer, support). */
    List<User> findByRole(String role);

    /** Check if an email already exists. */
    boolean existsByEmail(String email);
}
