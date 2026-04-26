package com.nimbus.repository;

import com.nimbus.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * BookingRepository — Spring Data JPA interface for the bookings table.
 * Replaces BookingDAO from Phase 2.
 */
@Repository
public interface BookingRepository extends JpaRepository<Booking, String> {

    /** Get all bookings for a user, sorted newest first. */
    List<Booking> findByUserIdOrderByCreatedAtDesc(String userId);

    /** Get bookings by status. */
    List<Booking> findByParStatus(String parStatus);

    /** Get bookings by user and status. */
    List<Booking> findByUserIdAndParStatus(String userId, String parStatus);

    /** Get bookings within a date range (for history filtering). */
    @Query("SELECT b FROM Booking b WHERE " +
           "(:userId IS NULL OR b.userId = :userId) AND " +
           "(:startDate IS NULL OR b.createdAt >= :startDate) AND " +
           "(:endDate IS NULL OR b.createdAt <= :endDate) " +
           "ORDER BY b.createdAt DESC")
    List<Booking> findByDateRange(
            @Param("userId") String userId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    /** Count bookings for a specific user. */
    long countByUserId(String userId);
}
