package com.nimbus.util;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

/**
 * Validates user input — replicates the frontend auth.js validation rules.
 */
public class InputValidator {

    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$");
    private static final Pattern MOBILE_PATTERN = Pattern.compile("^\\d{10}$");
    private static final Pattern UPPERCASE_PATTERN = Pattern.compile("[A-Z]");
    private static final Pattern LOWERCASE_PATTERN = Pattern.compile("[a-z]");
    private static final Pattern DIGIT_PATTERN = Pattern.compile("\\d");
    private static final Pattern SPECIAL_PATTERN = Pattern.compile("[!@#$%^&*(),.?\":{}|<>]");

    /**
     * Validate registration form data. Returns list of error messages (empty = valid).
     */
    public static List<String> validateRegistration(String firstName, String lastName,
                                                      String email, String mobile,
                                                      String street, String zipCode,
                                                      String city, String state,
                                                      String password, String confirmPassword) {
        List<String> errors = new ArrayList<>();

        // First Name
        if (firstName == null || firstName.trim().isEmpty()) {
            errors.add("First name is required.");
        } else if (firstName.trim().length() > 25) {
            errors.add("First name must be under 25 characters.");
        }

        // Last Name
        if (lastName == null || lastName.trim().isEmpty()) {
            errors.add("Last name is required.");
        } else if (lastName.trim().length() > 25) {
            errors.add("Last name must be under 25 characters.");
        }

        // Email
        if (email == null || !EMAIL_PATTERN.matcher(email).matches()) {
            errors.add("Please enter a valid email address.");
        }

        // Mobile
        if (mobile == null || !MOBILE_PATTERN.matcher(mobile).matches()) {
            errors.add("Please enter a valid 10-digit mobile number.");
        }

        // Street
        if (street == null || street.trim().length() < 5) {
            errors.add("Please enter your street address (min 5 chars).");
        }

        // ZIP
        if (zipCode == null || zipCode.trim().length() < 4) {
            errors.add("Please enter a valid ZIP / postal code.");
        }

        // City
        if (city == null || city.trim().isEmpty()) {
            errors.add("City is required.");
        }

        // State
        if (state == null || state.trim().isEmpty()) {
            errors.add("State is required.");
        }

        // Password
        errors.addAll(validatePassword(password));

        // Confirm Password
        if (password != null && !password.equals(confirmPassword)) {
            errors.add("Passwords do not match.");
        }

        return errors;
    }

    /**
     * Validate password rules (matches auth.js exactly).
     */
    public static List<String> validatePassword(String password) {
        List<String> errors = new ArrayList<>();

        if (password == null || password.length() < 8 || password.length() > 30) {
            errors.add("Password must be 8-30 characters.");
            return errors;
        }

        if (!UPPERCASE_PATTERN.matcher(password).find()) {
            errors.add("Password must contain at least one uppercase letter.");
        }
        if (!LOWERCASE_PATTERN.matcher(password).find()) {
            errors.add("Password must contain at least one lowercase letter.");
        }
        if (!DIGIT_PATTERN.matcher(password).find()) {
            errors.add("Password must contain at least one digit.");
        }
        if (!SPECIAL_PATTERN.matcher(password).find()) {
            errors.add("Password must contain at least one special character.");
        }
        if (hasSequentialChars(password)) {
            errors.add("Password must not contain 3 sequential characters (abc, 123).");
        }

        return errors;
    }

    /**
     * Check for 3+ sequential characters (abc, 123, cba, 321).
     * Matches the frontend auth.js hasSequentialChars() method.
     */
    public static boolean hasSequentialChars(String pwd) {
        String s = pwd.toLowerCase();
        for (int i = 0; i < s.length() - 2; i++) {
            int a = s.charAt(i);
            int b = s.charAt(i + 1);
            int c = s.charAt(i + 2);
            // Ascending (abc, 123) or descending (cba, 321)
            if ((b == a + 1 && c == b + 1) || (b == a - 1 && c == b - 1)) {
                return true;
            }
        }
        return false;
    }

    /** Check if a string is null or blank */
    public static boolean isBlank(String s) {
        return s == null || s.trim().isEmpty();
    }
}
