package com.nimbus.repository;

import com.nimbus.model.Issue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * IssueRepository — Spring Data JPA interface for the issues table.
 * Replaces IssueDAO from Phase 2.
 */
@Repository
public interface IssueRepository extends JpaRepository<Issue, String> {

    /** Get issues reported by a specific user. */
    List<Issue> findByUserIdOrderByCreatedAtDesc(String userId);

    /** Get issues assigned to a specific support agent. */
    List<Issue> findByAssignedToOrderByCreatedAtDesc(String assignedTo);

    /** Get issues by status. */
    List<Issue> findByStatus(String status);

    /** Get issues by severity. */
    List<Issue> findBySeverity(String severity);
}
