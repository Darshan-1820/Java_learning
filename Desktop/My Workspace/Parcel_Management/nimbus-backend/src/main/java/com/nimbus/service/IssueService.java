package com.nimbus.service;

import com.nimbus.model.Issue;
import com.nimbus.repository.IssueRepository;
import com.nimbus.util.IdGenerator;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

/**
 * IssueService — Business logic for support issue operations.
 */
@Service
public class IssueService {

    private final IssueRepository issueRepository;

    public IssueService(IssueRepository issueRepository) {
        this.issueRepository = issueRepository;
    }

    /** Create a new support issue (customer action). */
    public Issue createIssue(String userId, String bookingId, String subject,
                              String description, String severity) {

        if (subject == null || subject.trim().isEmpty()) {
            throw new IllegalArgumentException("Subject is required.");
        }

        int count = (int) issueRepository.count();
        String issueId = IdGenerator.generateIssueId(count);

        Issue issue = new Issue(issueId, userId,
                bookingId != null && !bookingId.isEmpty() ? bookingId : null,
                subject.trim(),
                description != null ? description.trim() : "",
                severity != null ? severity : "Low");

        return issueRepository.save(issue);
    }

    /** Update issue status, assignment, and notes (officer/support action). */
    public Issue updateIssue(String issueId, String status, String assignedTo, String notes) {
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new IllegalArgumentException("Issue not found: " + issueId));

        if (status != null) issue.setStatus(status);
        if (assignedTo != null) issue.setAssignedTo(assignedTo);
        if (notes != null) issue.setNotes(notes);
        issue.setUpdatedAt(LocalDateTime.now());

        return issueRepository.save(issue);
    }

    /** Get all issues. */
    public List<Issue> getAllIssues() {
        return issueRepository.findAll();
    }

    /** Get issues by user. */
    public List<Issue> getIssuesByUser(String userId) {
        return issueRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    /** Get issues assigned to a support agent. */
    public List<Issue> getAssignedIssues(String supportUserId) {
        return issueRepository.findByAssignedToOrderByCreatedAtDesc(supportUserId);
    }

    /** Get a single issue. */
    public Issue getIssueById(String issueId) {
        return issueRepository.findById(issueId)
                .orElseThrow(() -> new IllegalArgumentException("Issue not found: " + issueId));
    }
}
