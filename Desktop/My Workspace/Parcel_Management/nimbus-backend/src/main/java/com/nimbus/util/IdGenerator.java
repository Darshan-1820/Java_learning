package com.nimbus.util;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * Generates unique IDs for Users and Bookings.
 * Matches the exact format used by the frontend (storage.js).
 *
 * User ID format:  YYMMDD-XX## (e.g., 260401-AK01)
 *   YY = last 2 digits of year
 *   MM = month (01-12)
 *   DD = day (01-31)
 *   XX = first letter of firstName + first letter of lastName (uppercase)
 *   ## = sequential number, zero-padded (01, 02, 03...)
 *
 * Booking ID format: NMB-YYMMDD-#### (e.g., NMB-260401-0001)
 *   NMB = Nimbus prefix
 *   #### = sequential booking number, zero-padded
 */
public class IdGenerator {

    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("yyMMdd");

    /**
     * Generate a User ID based on today's date, name initials, and existing user count.
     */
    public static String generateUserId(String firstName, String lastName, List<String> existingUserIds) {
        String datePart = LocalDate.now().format(DATE_FORMAT);
        String initials = ("" + firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
        String prefix = datePart + "-" + initials;

        long count = existingUserIds.stream()
                .filter(id -> id.startsWith(prefix))
                .count();

        String seq = String.format("%02d", count + 1);
        return prefix + seq;
    }

    /**
     * Generate a Booking ID based on today's date and total booking count.
     */
    public static String generateBookingId(int totalBookings) {
        String datePart = LocalDate.now().format(DATE_FORMAT);
        String seq = String.format("%04d", totalBookings + 1);
        return "NMB-" + datePart + "-" + seq;
    }

    /**
     * Generate an Issue ID based on total issue count.
     */
    public static String generateIssueId(int totalIssues) {
        return "ISS-" + String.format("%03d", totalIssues + 1);
    }
}
