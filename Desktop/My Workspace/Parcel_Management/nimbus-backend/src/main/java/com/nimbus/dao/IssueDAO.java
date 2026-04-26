package com.nimbus.dao;

import com.nimbus.model.Issue;

import java.sql.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * IssueDAO — Raw JDBC operations for the issues table.
 * Phase 2 approach: direct JDBC with PreparedStatement.
 */
public class IssueDAO {

    private static final String DB_URL = "jdbc:h2:file:./nimbusdb;MODE=MySQL;AUTO_RECONNECT=TRUE";
    private static final String DB_USER = "sa";
    private static final String DB_PASS = "";

    public Connection getConnection() throws SQLException {
        return DriverManager.getConnection(DB_URL, DB_USER, DB_PASS);
    }

    /** Find an issue by its Issue ID. */
    public Issue findById(String issueId) {
        String sql = "SELECT * FROM issues WHERE issue_id = ?";

        try (Connection conn = getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, issueId);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) return mapRow(rs);

        } catch (SQLException e) {
            System.err.println("Error finding issue: " + e.getMessage());
        }
        return null;
    }

    /** Get all issues. */
    public List<Issue> findAll() {
        String sql = "SELECT * FROM issues ORDER BY created_at DESC";
        List<Issue> issues = new ArrayList<>();

        try (Connection conn = getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) issues.add(mapRow(rs));

        } catch (SQLException e) {
            System.err.println("Error fetching issues: " + e.getMessage());
        }
        return issues;
    }

    /** Get issues by user ID. */
    public List<Issue> findByUserId(String userId) {
        String sql = "SELECT * FROM issues WHERE user_id = ? ORDER BY created_at DESC";
        List<Issue> issues = new ArrayList<>();

        try (Connection conn = getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, userId);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) issues.add(mapRow(rs));

        } catch (SQLException e) {
            System.err.println("Error fetching issues by user: " + e.getMessage());
        }
        return issues;
    }

    /** Get issues assigned to a specific support agent. */
    public List<Issue> findByAssignedTo(String supportUserId) {
        String sql = "SELECT * FROM issues WHERE assigned_to = ? ORDER BY created_at DESC";
        List<Issue> issues = new ArrayList<>();

        try (Connection conn = getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, supportUserId);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) issues.add(mapRow(rs));

        } catch (SQLException e) {
            System.err.println("Error fetching assigned issues: " + e.getMessage());
        }
        return issues;
    }

    /** Get total number of issues. */
    public int getCount() {
        String sql = "SELECT COUNT(*) FROM issues";

        try (Connection conn = getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            if (rs.next()) return rs.getInt(1);
        } catch (SQLException e) {
            System.err.println("Error counting issues: " + e.getMessage());
        }
        return 0;
    }

    /** Save a new issue. */
    public Issue save(Issue issue) {
        String sql = "INSERT INTO issues (issue_id, user_id, booking_id, subject, description, " +
                     "severity, status, assigned_to, notes, created_at, updated_at) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        try (Connection conn = getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, issue.getIssueId());
            ps.setString(2, issue.getUserId());
            ps.setString(3, issue.getBookingId());
            ps.setString(4, issue.getSubject());
            ps.setString(5, issue.getDescription());
            ps.setString(6, issue.getSeverity());
            ps.setString(7, issue.getStatus());
            ps.setString(8, issue.getAssignedTo());
            ps.setString(9, issue.getNotes());
            ps.setTimestamp(10, Timestamp.valueOf(issue.getCreatedAt() != null ? issue.getCreatedAt() : LocalDateTime.now()));
            ps.setTimestamp(11, Timestamp.valueOf(issue.getUpdatedAt() != null ? issue.getUpdatedAt() : LocalDateTime.now()));

            ps.executeUpdate();
            return issue;

        } catch (SQLException e) {
            System.err.println("Error saving issue: " + e.getMessage());
            return null;
        }
    }

    /** Update issue status and notes. */
    public boolean update(String issueId, String status, String assignedTo, String notes) {
        String sql = "UPDATE issues SET status = ?, assigned_to = ?, notes = ?, updated_at = ? WHERE issue_id = ?";

        try (Connection conn = getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, status);
            ps.setString(2, assignedTo);
            ps.setString(3, notes);
            ps.setTimestamp(4, Timestamp.valueOf(LocalDateTime.now()));
            ps.setString(5, issueId);
            return ps.executeUpdate() > 0;

        } catch (SQLException e) {
            System.err.println("Error updating issue: " + e.getMessage());
            return false;
        }
    }

    private Issue mapRow(ResultSet rs) throws SQLException {
        Issue issue = new Issue();
        issue.setIssueId(rs.getString("issue_id"));
        issue.setUserId(rs.getString("user_id"));
        issue.setBookingId(rs.getString("booking_id"));
        issue.setSubject(rs.getString("subject"));
        issue.setDescription(rs.getString("description"));
        issue.setSeverity(rs.getString("severity"));
        issue.setStatus(rs.getString("status"));
        issue.setAssignedTo(rs.getString("assigned_to"));
        issue.setNotes(rs.getString("notes"));
        Timestamp created = rs.getTimestamp("created_at");
        if (created != null) issue.setCreatedAt(created.toLocalDateTime());
        Timestamp updated = rs.getTimestamp("updated_at");
        if (updated != null) issue.setUpdatedAt(updated.toLocalDateTime());
        return issue;
    }
}
