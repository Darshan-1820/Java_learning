package com.nimbus.service;

import com.nimbus.model.Booking;
import com.nimbus.repository.BookingRepository;
import com.nimbus.util.IdGenerator;
import com.nimbus.util.PricingCalculator;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

/**
 * BookingService — Business logic for booking operations.
 * Used by Servlets (Phase 3) and REST Controllers (Phase 4).
 */
@Service
public class BookingService {

    private final BookingRepository bookingRepository;

    public BookingService(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    /**
     * Create a new booking.
     * Generates booking ID, calculates cost, and saves.
     */
    public Booking createBooking(String userId, String recName, String recAddress,
                                  String recPin, String recMobile, int parWeightGram,
                                  String parContentsDescription, String parDeliveryType,
                                  String parPackingPreference, String paymentMethod) {

        // Validate required fields
        if (recName == null || recName.trim().isEmpty()) {
            throw new IllegalArgumentException("Receiver name is required.");
        }
        if (recAddress == null || recAddress.trim().isEmpty()) {
            throw new IllegalArgumentException("Receiver address is required.");
        }
        if (parWeightGram <= 0) {
            throw new IllegalArgumentException("Weight must be greater than 0.");
        }

        // Generate Booking ID
        int totalBookings = (int) bookingRepository.count();
        String bookingId = IdGenerator.generateBookingId(totalBookings);

        // Calculate cost
        double cost = PricingCalculator.calculateSimple(
                parWeightGram,
                parDeliveryType != null ? parDeliveryType : "Standard",
                parPackingPreference != null ? parPackingPreference : "Standard Packaging");

        // Calculate estimated pickup and dropoff times
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime pickupTime = now.plusDays(1);
        int deliveryDays = switch (parDeliveryType != null ? parDeliveryType : "Standard") {
            case "Express" -> 3;
            case "Overnight" -> 1;
            default -> 7;
        };
        LocalDateTime dropoffTime = pickupTime.plusDays(deliveryDays);

        // Create booking
        Booking booking = new Booking();
        booking.setBookingId(bookingId);
        booking.setUserId(userId);
        booking.setRecName(recName.trim());
        booking.setRecAddress(recAddress.trim());
        booking.setRecPin(recPin != null ? recPin.trim() : "");
        booking.setRecMobile(recMobile != null ? recMobile.trim() : "");
        booking.setParWeightGram(parWeightGram);
        booking.setParContentsDescription(parContentsDescription != null ? parContentsDescription.trim() : "");
        booking.setParDeliveryType(parDeliveryType != null ? parDeliveryType : "Standard");
        booking.setParPackingPreference(parPackingPreference != null ? parPackingPreference : "Standard Packaging");
        booking.setParPickupTime(pickupTime);
        booking.setParDropoffTime(dropoffTime);
        booking.setParServiceCost(cost);
        booking.setParPaymentTime(now);
        booking.setPaymentMethod(paymentMethod != null ? paymentMethod : "card");
        booking.setParStatus("Booked");
        booking.setCreatedAt(now);

        return bookingRepository.save(booking);
    }

    /**
     * Track a booking by ID.
     * Customers can only see their own bookings; officers can see any.
     */
    public Booking trackBooking(String bookingId, String userId, String role) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found: " + bookingId));

        // Security: customers can only track their own bookings
        if ("customer".equals(role) && !booking.getUserId().equals(userId)) {
            throw new SecurityException("Access denied. This booking belongs to another user.");
        }

        return booking;
    }

    /**
     * Update delivery status (officer operation).
     */
    public Booking updateDeliveryStatus(String bookingId, String newStatus) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found: " + bookingId));

        // Validate status value
        List<String> validStatuses = List.of("Booked", "Picked Up", "In Transit", "Delivered", "Returned");
        if (!validStatuses.contains(newStatus)) {
            throw new IllegalArgumentException("Invalid status: " + newStatus);
        }

        booking.setParStatus(newStatus);
        return bookingRepository.save(booking);
    }

    /**
     * Update pickup and dropoff times (officer scheduling).
     */
    public Booking updatePickupDropoff(String bookingId, LocalDateTime pickupTime, LocalDateTime dropoffTime) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found: " + bookingId));

        booking.setParPickupTime(pickupTime);
        booking.setParDropoffTime(dropoffTime);
        return bookingRepository.save(booking);
    }

    /**
     * Get booking history with optional filters.
     */
    public List<Booking> getHistory(String userId, String role, String startDate, String endDate) {
        if ("customer".equals(role)) {
            // Customers see only their own bookings
            if (startDate != null || endDate != null) {
                LocalDateTime start = startDate != null ?
                        LocalDateTime.parse(startDate + "T00:00:00") : null;
                LocalDateTime end = endDate != null ?
                        LocalDateTime.parse(endDate + "T23:59:59") : null;
                return bookingRepository.findByDateRange(userId, start, end);
            }
            return bookingRepository.findByUserIdOrderByCreatedAtDesc(userId);
        } else {
            // Officers see all bookings (optionally filtered)
            if (userId != null || startDate != null || endDate != null) {
                LocalDateTime start = startDate != null ?
                        LocalDateTime.parse(startDate + "T00:00:00") : null;
                LocalDateTime end = endDate != null ?
                        LocalDateTime.parse(endDate + "T23:59:59") : null;
                return bookingRepository.findByDateRange(userId, start, end);
            }
            return bookingRepository.findAll();
        }
    }

    /** Get a single booking by ID. */
    public Booking getBookingById(String bookingId) {
        return bookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found: " + bookingId));
    }
}
