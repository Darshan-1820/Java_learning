package com.nimbus.controller;

import com.nimbus.dto.ApiResponse;
import com.nimbus.model.Booking;
import com.nimbus.service.BookingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * TrackingController — Phase 4 REST API for parcel tracking.
 *
 * Endpoint (matching TCS Sprint 3 requirement):
 *   GET /api/bookings/{id}/track → trackParcelStatus
 */
@RestController
@RequestMapping("/api/bookings")
public class TrackingController {

    private final BookingService bookingService;

    public TrackingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    /**
     * GET /api/bookings/{bookingId}/track
     * TCS Sprint 3: trackParcelStatus
     *
     * Query params:
     *   userId — the requesting user's ID (for access control)
     *   role   — "customer" or "officer"
     */
    @GetMapping("/{bookingId}/track")
    public ResponseEntity<ApiResponse> trackParcel(
            @PathVariable String bookingId,
            @RequestParam(required = false) String userId,
            @RequestParam(required = false, defaultValue = "officer") String role) {
        try {
            Booking booking = bookingService.trackBooking(bookingId, userId, role);
            return ResponseEntity.ok(ApiResponse.ok("Booking found.", booking));

        } catch (SecurityException e) {
            return ResponseEntity.status(403).body(ApiResponse.error(e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).body(ApiResponse.error(e.getMessage()));
        }
    }
}
