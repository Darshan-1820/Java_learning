package com.nimbus.controller;

import com.nimbus.dto.ApiResponse;
import com.nimbus.dto.BookingRequest;
import com.nimbus.model.Booking;
import com.nimbus.service.BookingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * BookingController — Phase 4 REST API for booking operations.
 *
 * Endpoints (matching TCS Sprint 3 requirements):
 *   POST /api/bookings                          → bookService
 *   GET  /api/bookings/history                   → viewBookingHistory
 *   PUT  /api/bookings/{id}/delivery-status      → updateDeliveryStatus
 *   PUT  /api/bookings/{id}/pickup-drop          → updatePickupAndDrop
 */
@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    /**
     * POST /api/bookings
     * TCS Sprint 3: bookService (viewBookService)
     *
     * Creates a new booking. Automatically calculates cost.
     */
    @PostMapping
    public ResponseEntity<ApiResponse> createBooking(@RequestBody BookingRequest request) {
        try {
            Booking booking = bookingService.createBooking(
                    request.getUserId(),
                    request.getRecName(),
                    request.getRecAddress(),
                    request.getRecPin(),
                    request.getRecMobile(),
                    request.getParWeightGram(),
                    request.getParContentsDescription(),
                    request.getParDeliveryType(),
                    request.getParPackingPreference(),
                    request.getPaymentMethod()
            );

            return ResponseEntity.ok(ApiResponse.ok("Booking confirmed. ID: " + booking.getBookingId(), booking));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * GET /api/bookings/history
     * TCS Sprint 3: viewBookingHistory
     *
     * Query params:
     *   userId    — filter by user (required for customers, optional for officers)
     *   role      — "customer" or "officer" (determines access level)
     *   startDate — filter start date (yyyy-MM-dd)
     *   endDate   — filter end date (yyyy-MM-dd)
     */
    @GetMapping("/history")
    public ResponseEntity<ApiResponse> getHistory(
            @RequestParam(required = false) String userId,
            @RequestParam(required = false, defaultValue = "officer") String role,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {

        List<Booking> bookings = bookingService.getHistory(userId, role, startDate, endDate);
        return ResponseEntity.ok(ApiResponse.ok("Found " + bookings.size() + " booking(s).", bookings));
    }

    /**
     * GET /api/bookings/{id}
     * Get a single booking by ID.
     */
    @GetMapping("/{bookingId}")
    public ResponseEntity<ApiResponse> getBooking(@PathVariable String bookingId) {
        try {
            Booking booking = bookingService.getBookingById(bookingId);
            return ResponseEntity.ok(ApiResponse.ok(booking));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * PUT /api/bookings/{id}/delivery-status
     * TCS Sprint 3: updateDeliveryStatus
     *
     * Request body: { "status": "In Transit" }
     */
    @PutMapping("/{bookingId}/delivery-status")
    public ResponseEntity<ApiResponse> updateDeliveryStatus(
            @PathVariable String bookingId,
            @RequestBody Map<String, String> request) {
        try {
            String newStatus = request.get("status");
            Booking updated = bookingService.updateDeliveryStatus(bookingId, newStatus);
            return ResponseEntity.ok(ApiResponse.ok("Status updated to: " + newStatus, updated));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * PUT /api/bookings/{id}/pickup-drop
     * TCS Sprint 3: updatePickupAndDrop
     *
     * Request body: { "pickupTime": "2026-04-02T10:00:00", "dropoffTime": "2026-04-05T18:00:00" }
     */
    @PutMapping("/{bookingId}/pickup-drop")
    public ResponseEntity<ApiResponse> updatePickupDropoff(
            @PathVariable String bookingId,
            @RequestBody Map<String, String> request) {
        try {
            LocalDateTime pickup = LocalDateTime.parse(request.get("pickupTime"));
            LocalDateTime dropoff = LocalDateTime.parse(request.get("dropoffTime"));
            Booking updated = bookingService.updatePickupDropoff(bookingId, pickup, dropoff);
            return ResponseEntity.ok(ApiResponse.ok("Pickup/dropoff updated.", updated));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
