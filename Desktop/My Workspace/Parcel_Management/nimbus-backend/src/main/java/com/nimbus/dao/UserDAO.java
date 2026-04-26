package com.nimbus.dao;

import com.nimbus.model.User;

import java.sql.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * UserDAO — Raw JDBC operations for the users table.
 * This is the Phase 2 approach: direct JDBC with PreparedStatement.
 *
 * In Phase 3/4, we use Spring Data JPA (UserRepository) instead.
 * Both exist in the project so you can see the evolution from
 * manual JDBC → Spring Data JPA.
 */
public class UserDAO {

    // H2 embedded database URL — file-based so data survives restarts
    private static final String DB_URL = "jdbc:h2:file:./nimbusdb;MODE=MySQL;AUTO_RECONNECT=TRUE";
    private static final String DB_USER = "sa";
    private static final String DB_PASS = "";

    /**
     * Get a database connection.
     * Uses DriverManager (simple approach for Phase 2).
     * In Phase 3+, Spring manages the connection pool automatically.
     */
    public Connection getConnection() throws SQLException {
        return DriverManager.getConnection(DB_URL, DB_USER, DB_PASS);
    }

    /**
     * Find a user by their User ID (primary key).
     */
    public User findById(String userId) {
        String sql = "SELECT * FROM users WHERE user_id = ?";

        try (Connection conn = getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, userId);
            ResultSet rs = ps.executeQuery();

            if (rs.next()) {
                return mapRow(rs);
            }
        } catch (SQLException e) {
            System.err.println("Error finding user by ID: " + e.getMessage());
        }
        return null;
    }

    /**
     * Find a user by their email address.
     * Used for duplicate email check during registration.
     */
    public User findByEmail(String email) {
        String sql = "SELECT * FROM users WHERE email = ?";

        try (Connection conn = getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, email);
            ResultSet rs = ps.executeQuery();

            if (rs.next()) {
                return mapRow(rs);
            }
        } catch (SQLException e) {
            System.err.println("Error finding user by email: " + e.getMessage());
        }
        return null;
    }

    /**
     * Validate login credentials.
     * Returns the User if credentials match, null otherwise.
     */
    public User validateLogin(String userId, String password) {
        String sql = "SELECT * FROM users WHERE user_id = ? AND password = ?";

        try (Connection conn = getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, userId);
            ps.setString(2, password);
            ResultSet rs = ps.executeQuery();

            if (rs.next()) {
                return mapRow(rs);
            }
        } catch (SQLException e) {
            System.err.println("Error validating login: " + e.getMessage());
        }
        return null;
    }

    /**
     * Get all users from the database.
     */
    public List<User> findAll() {
        String sql = "SELECT * FROM users ORDER BY created_at DESC";
        List<User> users = new ArrayList<>();

        try (Connection conn = getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                users.add(mapRow(rs));
            }
        } catch (SQLException e) {
            System.err.println("Error fetching all users: " + e.getMessage());
        }
        return users;
    }

    /**
     * Get all users with a specific role (customer, officer, support).
     */
    public List<User> findByRole(String role) {
        String sql = "SELECT * FROM users WHERE role = ? ORDER BY created_at DESC";
        List<User> users = new ArrayList<>();

        try (Connection conn = getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, role);
            ResultSet rs = ps.executeQuery();

            while (rs.next()) {
                users.add(mapRow(rs));
            }
        } catch (SQLException e) {
            System.err.println("Error fetching users by role: " + e.getMessage());
        }
        return users;
    }

    /**
     * Get all existing user IDs (used for generating new user IDs).
     */
    public List<String> getAllUserIds() {
        String sql = "SELECT user_id FROM users";
        List<String> ids = new ArrayList<>();

        try (Connection conn = getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                ids.add(rs.getString("user_id"));
            }
        } catch (SQLException e) {
            System.err.println("Error fetching user IDs: " + e.getMessage());
        }
        return ids;
    }

    /**
     * Save a new user to the database.
     */
    public User save(User user) {
        String sql = "INSERT INTO users (user_id, first_name, middle_name, last_name, full_name, " +
                     "email, country_code, mobile, street, zip_code, city, state, country, " +
                     "password, role, preferences, created_at) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        try (Connection conn = getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, user.getUserId());
            ps.setString(2, user.getFirstName());
            ps.setString(3, user.getMiddleName());
            ps.setString(4, user.getLastName());
            ps.setString(5, user.getFullName());
            ps.setString(6, user.getEmail());
            ps.setString(7, user.getCountryCode());
            ps.setString(8, user.getMobile());
            ps.setString(9, user.getStreet());
            ps.setString(10, user.getZipCode());
            ps.setString(11, user.getCity());
            ps.setString(12, user.getState());
            ps.setString(13, user.getCountry());
            ps.setString(14, user.getPassword());
            ps.setString(15, user.getRole());
            ps.setString(16, user.getPreferences());
            ps.setTimestamp(17, Timestamp.valueOf(user.getCreatedAt() != null ? user.getCreatedAt() : LocalDateTime.now()));

            ps.executeUpdate();
            return user;

        } catch (SQLException e) {
            System.err.println("Error saving user: " + e.getMessage());
            return null;
        }
    }

    /**
     * Map a ResultSet row to a User object.
     * Called for every row returned from a query.
     */
    private User mapRow(ResultSet rs) throws SQLException {
        User user = new User();
        user.setUserId(rs.getString("user_id"));
        user.setFirstName(rs.getString("first_name"));
        user.setMiddleName(rs.getString("middle_name"));
        user.setLastName(rs.getString("last_name"));
        user.setFullName(rs.getString("full_name"));
        user.setEmail(rs.getString("email"));
        user.setCountryCode(rs.getString("country_code"));
        user.setMobile(rs.getString("mobile"));
        user.setStreet(rs.getString("street"));
        user.setZipCode(rs.getString("zip_code"));
        user.setCity(rs.getString("city"));
        user.setState(rs.getString("state"));
        user.setCountry(rs.getString("country"));
        user.setPassword(rs.getString("password"));
        user.setRole(rs.getString("role"));
        user.setPreferences(rs.getString("preferences"));
        Timestamp ts = rs.getTimestamp("created_at");
        if (ts != null) user.setCreatedAt(ts.toLocalDateTime());
        return user;
    }
}
