package com.nimbus.controller;

import com.nimbus.dto.ApiResponse;
import com.nimbus.model.Issue;
import com.nimbus.service.IssueService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * IssueController — Phase 4 REST API for support issues.
 *
 * Endpoints:
 *   POST /api/issues                → Create issue (customer)
 *   GET  /api/issues                → Get all issues (officer)
 *   GET  /api/issues/user/{userId}  → Get issues by user
 *   GET  /api/issues/assigned/{id}  → Get assigned issues (support)
 *   PUT  /api/issues/{issueId}      → Update issue status
 */
@RestController
@RequestMapping("/api/issues")
public class IssueController {

    private final IssueService issueService;

    public IssueController(IssueService issueService) {
        this.issueService = issueService;
    }

    /** POST /api/issues — Create a new support issue. */
    @PostMapping
    public ResponseEntity<ApiResponse> createIssue(@RequestBody Map<String, String> request) {
        try {
            Issue issue = issueService.createIssue(
                    request.get("userId"),
                    request.get("bookingId"),
                    request.get("subject"),
                    request.get("description"),
                    request.get("severity")
            );
            return ResponseEntity.ok(ApiResponse.ok("Issue created. ID: " + issue.getIssueId(), issue));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /** GET /api/issues — Get all issues. */
    @GetMapping
    public ResponseEntity<ApiResponse> getAllIssues() {
        List<Issue> issues = issueService.getAllIssues();
        return ResponseEntity.ok(ApiResponse.ok(issues));
    }

    /** GET /api/issues/user/{userId} — Get issues by user. */
    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse> getIssuesByUser(@PathVariable String userId) {
        List<Issue> issues = issueService.getIssuesByUser(userId);
        return ResponseEntity.ok(ApiResponse.ok(issues));
    }

    /** GET /api/issues/assigned/{supportUserId} — Get assigned issues. */
    @GetMapping("/assigned/{supportUserId}")
    public ResponseEntity<ApiResponse> getAssignedIssues(@PathVariable String supportUserId) {
        List<Issue> issues = issueService.getAssignedIssues(supportUserId);
        return ResponseEntity.ok(ApiResponse.ok(issues));
    }

    /** PUT /api/issues/{issueId} — Update issue. */
    @PutMapping("/{issueId}")
    public ResponseEntity<ApiResponse> updateIssue(
            @PathVariable String issueId,
            @RequestBody Map<String, String> request) {
        try {
            Issue issue = issueService.updateIssue(
                    issueId,
                    request.get("status"),
                    request.get("assignedTo"),
                    request.get("notes")
            );
            return ResponseEntity.ok(ApiResponse.ok("Issue updated.", issue));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
