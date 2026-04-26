package com.nimbus.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "issues")
public class Issue {

    @Id
    @Column(name = "issue_id", length = 10)
    private String issueId;

    @Column(name = "user_id", length = 20, nullable = false)
    private String userId;

    @Column(name = "booking_id", length = 20)
    private String bookingId;

    @Column(name = "subject", length = 100, nullable = false)
    private String subject;

    @Column(name = "description", length = 500)
    private String description;

    @Column(name = "severity", length = 10, nullable = false)
    private String severity;

    @Column(name = "status", length = 15, nullable = false)
    private String status;

    @Column(name = "assigned_to", length = 20)
    private String assignedTo;

    @Column(name = "notes", length = 500)
    private String notes;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // --- Constructors ---

    public Issue() {}

    public Issue(String issueId, String userId, String bookingId, String subject,
                 String description, String severity) {
        this.issueId = issueId;
        this.userId = userId;
        this.bookingId = bookingId;
        this.subject = subject;
        this.description = description;
        this.severity = severity;
        this.status = "Open";
        this.assignedTo = "SUP-001";
        this.notes = "";
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    // --- Getters and Setters ---

    public String getIssueId() { return issueId; }
    public void setIssueId(String issueId) { this.issueId = issueId; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getBookingId() { return bookingId; }
    public void setBookingId(String bookingId) { this.bookingId = bookingId; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getAssignedTo() { return assignedTo; }
    public void setAssignedTo(String assignedTo) { this.assignedTo = assignedTo; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    @Override
    public String toString() {
        return String.format("Issue[%s | User: %s | %s | %s | %s]",
                issueId, userId, subject, severity, status);
    }
}
