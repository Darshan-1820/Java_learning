package com.nimbus.dao;

import com.nimbus.model.Booking;

import java.sql.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * BookingDAO — Raw JDBC operations for the bookings table.
 * Phase 2 approach: direct JDBC with PreparedStatement.
 */
public class BookingDAO {

    private static final String DB_URL = "jdbc:h2:file:./nimbusdb;MODE=MySQL;AUTO_RECONNECT=TRUE";
    private static final String DB_USER = "sa";
    private static final String DB_PASS = "";

    public Connection getConnection() throws SQLException {
        return DriverManager.getConnection(DB_URL, DB_USER, DB_PASS);
    }

    /**
     * Find a booking by its Booking ID (primary key).
     */
    public Booking findById(String bookingId) {
        String sql = "SELECT * FROM bookings WHERE booking_id = ?";

        try (Connection conn = getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, bookingId);
            ResultSet rs = ps.executeQuery();

            if (rs.next()) {
                return mapRow(rs);
            }
        } catch (SQLException e) {
            System.err.println("Error finding booking by ID: " + e.getMessage());
        }
        return null;
    }

    /**
     * Get all bookings for a specific user, sorted by creation date (newest first).
     */
    public List<Booking> findByUserId(String userId) {
        String sql = "SELECT * FROM bookings WHERE user_id = ? ORDER BY created_at DESC";
        List<Booking> bookings = new ArrayList<>();

        try (Connection conn = getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, userId);
            ResultSet rs = ps.executeQuery();

            while (rs.next()) {
                bookings.add(mapRow(rs));
            }
        } catch (SQLException e) {
            System.err.println("Error fetching bookings by user: " + e.getMessage());
        }
        return bookings;
    }

    /**
     * Get all bookings (for officers — they can see everything).
     */
    public List<Booking> findAll() {
        String sql = "SELECT * FROM bookings ORDER BY created_at DESC";
        List<Booking> bookings = new ArrayList<>();

        try (Connection conn = getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                bookings.add(mapRow(rs));
            }
        } catch (SQLException e) {
            System.err.println("Error fetching all bookings: " + e.getMessage());
        }
        return bookings;
    }

    /**
     * Get bookings within a date range (for history filtering).
     */
    public List<Booking> findByDateRange(String userId, String startDate, String endDate) {
        StringBuilder sql = new StringBuilder("SELECT * FROM bookings WHERE 1=1 ");
        List<Object> params = new ArrayList<>();

        if (userId != null && !userId.isEmpty()) {
            sql.append("AND user_id = ? ");
            params.add(userId);
        }
        if (startDate != null && !startDate.isEmpty()) {
            sql.append("AND created_at >= ? ");
            params.add(Timestamp.valueOf(startDate + " 00:00:00"));
        }
        if (endDate != null && !endDate.isEmpty()) {
            sql.append("AND created_at <= ? ");
            params.add(Timestamp.valueOf(endDate + " 23:59:59"));
        }
        sql.append("ORDER BY created_at DESC");

        List<Booking> bookings = new ArrayList<>();

        try (Connection conn = getConnection();
             PreparedStatement ps = conn.prepareStatement(sql.toString())) {

            for (int i = 0; i < params.size(); i++) {
                ps.setObject(i + 1, params.get(i));
            }

            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                bookings.add(mapRow(rs));
            }
        } catch (SQLException e) {
            System.err.println("Error fetching bookings by date range: " + e.getMessage());
        }
        return bookings;
    }

    /**
     * Get total number of bookings (used for ID generation).
     */
    public int getCount() {
        String sql = "SELECT COUNT(*) FROM bookings";

        try (Connection conn = getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            if (rs.next()) return rs.getInt(1);
        } catch (SQLException e) {
            System.err.println("Error counting bookings: " + e.getMessage());
        }
        return 0;
    }

    /**
     * Save a new booking to the database.
     */
    public Booking save(Booking booking) {
        String sql = "INSERT INTO bookings (booking_id, user_id, rec_name, rec_address, rec_pin, " +
                     "rec_mobile, par_weight_gram, par_contents_description, par_delivery_type, " +
                     "par_packing_preference, par_pickup_time, par_dropoff_time, par_service_cost, " +
                     "par_payment_time, payment_method, par_status, created_at) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        try (Connection conn = getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, booking.getBookingId());
            ps.setString(2, booking.getUserId());
            ps.setString(3, booking.getRecName());
            ps.setString(4, booking.getRecAddress());
            ps.setString(5, booking.getRecPin());
            ps.setString(6, booking.getRecMobile());
            ps.setInt(7, booking.getParWeightGram());
            ps.setString(8, booking.getParContentsDescription());
            ps.setString(9, booking.getParDeliveryType());
            ps.setString(10, booking.getParPackingPreference());
            ps.setTimestamp(11, booking.getParPickupTime() != null ? Timestamp.valueOf(booking.getParPickupTime()) : null);
            ps.setTimestamp(12, booking.getParDropoffTime() != null ? Timestamp.valueOf(booking.getParDropoffTime()) : null);
            ps.setDouble(13, booking.getParServiceCost());
            ps.setTimestamp(14, Timestamp.valueOf(booking.getParPaymentTime() != null ? booking.getParPaymentTime() : LocalDateTime.now()));
            ps.setString(15, booking.getPaymentMethod());
            ps.setString(16, booking.getParStatus());
            ps.setTimestamp(17, Timestamp.valueOf(booking.getCreatedAt() != null ? booking.getCreatedAt() : LocalDateTime.now()));

            ps.executeUpdate();
            return booking;

        } catch (SQLException e) {
            System.err.println("Error saving booking: " + e.getMessage());
            return null;
        }
    }

    /**
     * Update the delivery status of a booking.
     * Valid statuses: Booked → Picked Up → In Transit → Delivered / Returned
     */
    public boolean updateStatus(String bookingId, String newStatus) {
        String sql = "UPDATE bookings SET par_status = ? WHERE booking_id = ?";

        try (Connection conn = getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, newStatus);
            ps.setString(2, bookingId);
            return ps.executeUpdate() > 0;

        } catch (SQLException e) {
            System.err.println("Error updating booking status: " + e.getMessage());
            return false;
        }
    }

    /**
     * Update pickup and dropoff times (officer scheduling).
     */
    public boolean updatePickupDropoff(String bookingId, LocalDateTime pickupTime, LocalDateTime dropoffTime) {
        String sql = "UPDATE bookings SET par_pickup_time = ?, par_dropoff_time = ? WHERE booking_id = ?";

        try (Connection conn = getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setTimestamp(1, Timestamp.valueOf(pickupTime));
            ps.setTimestamp(2, Timestamp.valueOf(dropoffTime));
            ps.setString(3, bookingId);
            return ps.executeUpdate() > 0;

        } catch (SQLException e) {
            System.err.println("Error updating pickup/dropoff: " + e.getMessage());
            return false;
        }
    }

    /**
     * Map a ResultSet row to a Booking object.
     */
    private Booking mapRow(ResultSet rs) throws SQLException {
        Booking b = new Booking();
        b.setBookingId(rs.getString("booking_id"));
        b.setUserId(rs.getString("user_id"));
        b.setRecName(rs.getString("rec_name"));
        b.setRecAddress(rs.getString("rec_address"));
        b.setRecPin(rs.getString("rec_pin"));
        b.setRecMobile(rs.getString("rec_mobile"));
        b.setParWeightGram(rs.getInt("par_weight_gram"));
        b.setParContentsDescription(rs.getString("par_contents_description"));
        b.setParDeliveryType(rs.getString("par_delivery_type"));
        b.setParPackingPreference(rs.getString("par_packing_preference"));
        Timestamp pickup = rs.getTimestamp("par_pickup_time");
        if (pickup != null) b.setParPickupTime(pickup.toLocalDateTime());
        Timestamp dropoff = rs.getTimestamp("par_dropoff_time");
        if (dropoff != null) b.setParDropoffTime(dropoff.toLocalDateTime());
        b.setParServiceCost(rs.getDouble("par_service_cost"));
        Timestamp payment = rs.getTimestamp("par_payment_time");
        if (payment != null) b.setParPaymentTime(payment.toLocalDateTime());
        b.setPaymentMethod(rs.getString("payment_method"));
        b.setParStatus(rs.getString("par_status"));
        Timestamp created = rs.getTimestamp("created_at");
        if (created != null) b.setCreatedAt(created.toLocalDateTime());
        return b;
    }
}
