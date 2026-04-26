package com.nimbus.console;

import com.nimbus.dao.BookingDAO;
import com.nimbus.dao.IssueDAO;
import com.nimbus.dao.UserDAO;
import com.nimbus.model.Booking;
import com.nimbus.model.Issue;
import com.nimbus.model.User;
import com.nimbus.util.IdGenerator;
import com.nimbus.util.InputValidator;
import com.nimbus.util.PricingCalculator;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Scanner;

/**
 * ConsoleApp — Phase 2 main entry point.
 * A console-based menu-driven application that connects to H2 database via JDBC.
 *
 * Implements all 13 TCS Sprint 2 features:
 *   1. Register Customer
 *   2. Login (Customer / Officer / Support)
 *   3. Customer: Book Parcel
 *   4. Customer: Track Parcel
 *   5. Customer: View Booking History
 *   6. Customer: View Invoice
 *   7. Customer: Contact Support
 *   8. Customer: View Profile
 *   9. Officer: Book Parcel (Walk-in)
 *  10. Officer: Track Any Parcel
 *  11. Officer: Update Delivery Status
 *  12. Officer: Schedule Pickup
 *  13. Officer: View All History
 *  14. Officer: Manage Issues
 *  15. Support: View Assigned Issues
 *  16. Support: Update Issue
 *
 * HOW TO RUN IN ECLIPSE:
 *   Right-click this file > Run As > Java Application
 */
public class ConsoleApp {

    private static final DateTimeFormatter DT_FORMAT = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    private final UserDAO userDAO = new UserDAO();
    private final BookingDAO bookingDAO = new BookingDAO();
    private final IssueDAO issueDAO = new IssueDAO();
    private final Scanner scanner = new Scanner(System.in);
    private final ConsoleMenu menu = new ConsoleMenu(scanner);

    // Currently logged-in user
    private User currentUser = null;

    public static void main(String[] args) {
        ConsoleApp app = new ConsoleApp();
        app.run();
    }

    /**
     * Main application loop.
     */
    public void run() {
        menu.showBanner();

        boolean running = true;
        while (running) {
            int choice = menu.showMainMenu();

            switch (choice) {
                case 1 -> registerCustomer();
                case 2 -> login();
                case 0 -> {
                    System.out.println("\nThank you for using Nimbus. Goodbye!");
                    running = false;
                }
                default -> menu.showError("Invalid option. Please try again.");
            }
        }

        scanner.close();
    }

    // =============================================
    // AUTHENTICATION
    // =============================================

    /**
     * US1: Register a new customer.
     */
    private void registerCustomer() {
        System.out.println("\n--- New Customer Registration ---");

        String firstName = menu.readLine("First Name: ");
        String middleName = menu.readLine("Middle Name (optional, press Enter to skip): ");
        String lastName = menu.readLine("Last Name: ");
        String email = menu.readLine("Email: ");
        String mobile = menu.readLine("Mobile (10 digits): ");
        String street = menu.readLine("Street Address: ");
        String zipCode = menu.readLine("ZIP Code: ");
        String city = menu.readLine("City: ");
        String state = menu.readLine("State: ");
        String country = menu.readLine("Country (default: India): ");
        if (country.isEmpty()) country = "India";
        String password = menu.readLine("Password: ");
        String confirmPassword = menu.readLine("Confirm Password: ");

        // Validate
        List<String> errors = InputValidator.validateRegistration(
                firstName, lastName, email, mobile, street, zipCode, city, state, password, confirmPassword);

        if (!errors.isEmpty()) {
            menu.showError("Registration failed:");
            errors.forEach(e -> System.out.println("  - " + e));
            return;
        }

        // Check duplicate email
        if (userDAO.findByEmail(email.trim().toLowerCase()) != null) {
            menu.showError("This email is already registered.");
            return;
        }

        // Generate User ID
        List<String> existingIds = userDAO.getAllUserIds();
        String userId = IdGenerator.generateUserId(firstName.trim(), lastName.trim(), existingIds);

        // Create and save user
        User user = new User(userId, firstName.trim(), middleName.trim(), lastName.trim(),
                email.trim().toLowerCase(), "+91", mobile.trim(),
                street.trim(), zipCode.trim(), city.trim(), state.trim(), country.trim(),
                password, "customer", "Email notifications");

        User saved = userDAO.save(user);
        if (saved != null) {
            menu.showSuccess("Registration successful!");
            System.out.println("  Your User ID: " + userId);
            System.out.println("  Full Name:    " + saved.getFullName());
            System.out.println("\n  Please save your User ID — you'll need it to login.");
        } else {
            menu.showError("Registration failed. Please try again.");
        }
    }

    /**
     * US2: Login with User ID and Password.
     */
    private void login() {
        System.out.println("\n--- Login ---");

        String userId = menu.readLine("User ID: ");
        String password = menu.readLine("Password: ");

        if (userId.isEmpty() || password.isEmpty()) {
            menu.showError("User ID and password are required.");
            return;
        }

        User user = userDAO.validateLogin(userId.trim(), password);

        if (user == null) {
            menu.showError("Invalid credentials. Check your User ID and password.");
            return;
        }

        currentUser = user;
        menu.showSuccess("Welcome, " + user.getFullName() + "! (Role: " + user.getRole() + ")");

        // Route to role-specific dashboard
        switch (user.getRole()) {
            case "customer" -> customerDashboard();
            case "officer" -> officerDashboard();
            case "support" -> supportDashboard();
        }

        currentUser = null;
    }

    // =============================================
    // CUSTOMER DASHBOARD
    // =============================================

    private void customerDashboard() {
        boolean active = true;
        while (active) {
            int choice = menu.showCustomerMenu(currentUser.getFullName());

            switch (choice) {
                case 1 -> bookParcel(false);
                case 2 -> trackParcel(false);
                case 3 -> viewBookingHistory(false);
                case 4 -> viewInvoice();
                case 5 -> contactSupport();
                case 6 -> viewProfile();
                case 0 -> {
                    menu.showInfo("Logged out.");
                    active = false;
                }
                default -> menu.showError("Invalid option.");
            }
        }
    }

    // =============================================
    // OFFICER DASHBOARD
    // =============================================

    private void officerDashboard() {
        boolean active = true;
        while (active) {
            int choice = menu.showOfficerMenu(currentUser.getFullName());

            switch (choice) {
                case 1 -> bookParcel(true);
                case 2 -> trackParcel(true);
                case 3 -> updateDeliveryStatus();
                case 4 -> schedulePickup();
                case 5 -> viewBookingHistory(true);
                case 6 -> manageIssues();
                case 7 -> viewProfile();
                case 0 -> {
                    menu.showInfo("Logged out.");
                    active = false;
                }
                default -> menu.showError("Invalid option.");
            }
        }
    }

    // =============================================
    // SUPPORT DASHBOARD
    // =============================================

    private void supportDashboard() {
        boolean active = true;
        while (active) {
            int choice = menu.showSupportMenu(currentUser.getFullName());

            switch (choice) {
                case 1 -> viewAssignedIssues();
                case 2 -> updateIssueStatus();
                case 3 -> viewProfile();
                case 0 -> {
                    menu.showInfo("Logged out.");
                    active = false;
                }
                default -> menu.showError("Invalid option.");
            }
        }
    }

    // =============================================
    // BOOKING (Customer & Officer)
    // =============================================

    /**
     * US3/US9: Book a parcel.
     * @param isOfficer true = officer booking for walk-in customer (sender info is entered manually)
     */
    private void bookParcel(boolean isOfficer) {
        System.out.println("\n--- Book a Parcel ---");

        // Step 1: Sender info
        String senderUserId;
        if (isOfficer) {
            System.out.println("\n[Step 1] Walk-in Customer Details:");
            senderUserId = menu.readLine("Customer User ID (or press Enter for new): ");
            if (senderUserId.isEmpty()) {
                menu.showInfo("Register the customer first, then use their User ID.");
                return;
            }
            User sender = userDAO.findById(senderUserId);
            if (sender == null) {
                menu.showError("User ID not found. Please register them first.");
                return;
            }
            System.out.println("  Sender: " + sender.getFullName() + " (" + sender.getEmail() + ")");
        } else {
            senderUserId = currentUser.getUserId();
            System.out.println("\n[Step 1] Sender: " + currentUser.getFullName());
        }

        // Step 2: Receiver info
        System.out.println("\n[Step 2] Receiver Details:");
        String recName = menu.readLine("Receiver Name: ");
        String recAddress = menu.readLine("Receiver Address: ");
        String recPin = menu.readLine("Receiver PIN Code: ");
        String recMobile = menu.readLine("Receiver Mobile: ");

        if (recName.isEmpty() || recAddress.isEmpty()) {
            menu.showError("Receiver name and address are required.");
            return;
        }

        // Step 3: Parcel details
        System.out.println("\n[Step 3] Parcel Details:");
        int weight = menu.readInt("Parcel Weight (grams): ");
        if (weight <= 0) {
            menu.showError("Weight must be greater than 0.");
            return;
        }
        String contents = menu.readLine("Contents Description: ");

        // Step 4: Shipping options
        System.out.println("\n[Step 4] Shipping Options:");
        int dtChoice = menu.readDeliveryType();
        String deliveryType = switch (dtChoice) {
            case 2 -> "Express";
            case 3 -> "Overnight";
            default -> "Standard";
        };

        int pkgChoice = menu.readPackagingType();
        String packaging = switch (pkgChoice) {
            case 2 -> "Custom Packaging";
            case 3 -> "Eco-friendly Packaging";
            case 4 -> "Fragile Item Handling";
            default -> "Standard Packaging";
        };

        // Calculate cost
        double cost = PricingCalculator.calculateSimple(weight, deliveryType, packaging);
        PricingCalculator.PricingResult pricing = PricingCalculator.calculate(weight, deliveryType, packaging, "None", 0);

        // Step 5: Review & Confirm
        System.out.println("\n[Step 5] Review & Pay:");
        menu.showDivider();
        System.out.println("  Receiver:   " + recName);
        System.out.println("  Address:    " + recAddress + ", " + recPin);
        System.out.println("  Weight:     " + weight + "g");
        System.out.println("  Delivery:   " + deliveryType + " (" + pricing.deliveryDays + " days)");
        System.out.println("  Packaging:  " + packaging);
        System.out.println("  Cost:       Rs. " + String.format("%.0f", cost));
        menu.showDivider();

        String confirm = menu.readLine("Confirm booking? (yes/no): ");
        if (!confirm.equalsIgnoreCase("yes") && !confirm.equalsIgnoreCase("y")) {
            menu.showInfo("Booking cancelled.");
            return;
        }

        // Generate Booking ID and save
        String bookingId = IdGenerator.generateBookingId(bookingDAO.getCount());

        Booking booking = new Booking();
        booking.setBookingId(bookingId);
        booking.setUserId(senderUserId);
        booking.setRecName(recName.trim());
        booking.setRecAddress(recAddress.trim());
        booking.setRecPin(recPin.trim());
        booking.setRecMobile(recMobile.trim());
        booking.setParWeightGram(weight);
        booking.setParContentsDescription(contents.trim());
        booking.setParDeliveryType(deliveryType);
        booking.setParPackingPreference(packaging);
        booking.setParPickupTime(LocalDateTime.now().plusDays(1));
        booking.setParDropoffTime(LocalDateTime.now().plusDays(deliveryType.equals("Overnight") ? 2 :
                deliveryType.equals("Express") ? 4 : 8));
        booking.setParServiceCost(cost);
        booking.setParPaymentTime(LocalDateTime.now());
        booking.setPaymentMethod("card");
        booking.setParStatus("Booked");
        booking.setCreatedAt(LocalDateTime.now());

        Booking saved = bookingDAO.save(booking);
        if (saved != null) {
            menu.showSuccess("Booking confirmed!");
            System.out.println("  Booking ID: " + bookingId);
            System.out.println("  Amount:     Rs. " + String.format("%.0f", cost));
            System.out.println("  Status:     Booked");
        } else {
            menu.showError("Booking failed. Please try again.");
        }
    }

    // =============================================
    // TRACKING
    // =============================================

    /**
     * US4/US10: Track a parcel by Booking ID.
     */
    private void trackParcel(boolean isOfficer) {
        System.out.println("\n--- Track Parcel ---");
        String bookingId = menu.readLine("Enter Booking ID: ");

        if (bookingId.isEmpty()) {
            menu.showError("Booking ID is required.");
            return;
        }

        Booking booking = bookingDAO.findById(bookingId.trim());
        if (booking == null) {
            menu.showError("Booking not found: " + bookingId);
            return;
        }

        // Security check: customers can only see their own bookings
        if (!isOfficer && !booking.getUserId().equals(currentUser.getUserId())) {
            menu.showError("Access denied. This booking belongs to another user.");
            return;
        }

        displayBookingDetails(booking);
    }

    // =============================================
    // HISTORY
    // =============================================

    /**
     * US5/US13: View booking history.
     */
    private void viewBookingHistory(boolean isOfficer) {
        System.out.println("\n--- Booking History ---");

        List<Booking> bookings;
        if (isOfficer) {
            // Officers see all bookings
            String filterUser = menu.readLine("Filter by User ID (press Enter for all): ");
            String startDate = menu.readLine("Start Date (yyyy-MM-dd, Enter to skip): ");
            String endDate = menu.readLine("End Date (yyyy-MM-dd, Enter to skip): ");

            if (!filterUser.isEmpty() || !startDate.isEmpty() || !endDate.isEmpty()) {
                bookings = bookingDAO.findByDateRange(
                        filterUser.isEmpty() ? null : filterUser,
                        startDate.isEmpty() ? null : startDate,
                        endDate.isEmpty() ? null : endDate);
            } else {
                bookings = bookingDAO.findAll();
            }
        } else {
            bookings = bookingDAO.findByUserId(currentUser.getUserId());
        }

        if (bookings.isEmpty()) {
            menu.showInfo("No bookings found.");
            return;
        }

        System.out.println("\nFound " + bookings.size() + " booking(s):\n");
        System.out.printf("%-18s %-12s %-20s %-12s %10s  %-12s%n",
                "Booking ID", "User ID", "Receiver", "Status", "Cost", "Date");
        menu.showDivider();

        for (Booking b : bookings) {
            System.out.printf("%-18s %-12s %-20s %-12s Rs.%7.0f  %s%n",
                    b.getBookingId(),
                    b.getUserId(),
                    truncate(b.getRecName(), 18),
                    b.getParStatus(),
                    b.getParServiceCost(),
                    b.getCreatedAt() != null ? b.getCreatedAt().format(DT_FORMAT) : "N/A");
        }
    }

    // =============================================
    // INVOICE
    // =============================================

    /**
     * US6: View invoice for a booking.
     */
    private void viewInvoice() {
        System.out.println("\n--- View Invoice ---");
        String bookingId = menu.readLine("Enter Booking ID: ");

        Booking booking = bookingDAO.findById(bookingId.trim());
        if (booking == null) {
            menu.showError("Booking not found.");
            return;
        }

        if (!booking.getUserId().equals(currentUser.getUserId())) {
            menu.showError("Access denied.");
            return;
        }

        User sender = userDAO.findById(booking.getUserId());

        System.out.println("\n========================================");
        System.out.println("         NIMBUS — INVOICE");
        System.out.println("========================================");
        System.out.println("Booking ID:     " + booking.getBookingId());
        System.out.println("Date:           " + (booking.getCreatedAt() != null ? booking.getCreatedAt().format(DT_FORMAT) : "N/A"));
        System.out.println("Status:         " + booking.getParStatus());
        menu.showDivider();
        System.out.println("SENDER");
        System.out.println("  Name:         " + (sender != null ? sender.getFullName() : booking.getUserId()));
        if (sender != null) {
            System.out.println("  Address:      " + sender.getStreet() + ", " + sender.getCity());
        }
        menu.showDivider();
        System.out.println("RECEIVER");
        System.out.println("  Name:         " + booking.getRecName());
        System.out.println("  Address:      " + booking.getRecAddress());
        System.out.println("  PIN:          " + booking.getRecPin());
        System.out.println("  Mobile:       " + booking.getRecMobile());
        menu.showDivider();
        System.out.println("PARCEL");
        System.out.println("  Weight:       " + booking.getParWeightGram() + "g");
        System.out.println("  Contents:     " + booking.getParContentsDescription());
        System.out.println("  Delivery:     " + booking.getParDeliveryType());
        System.out.println("  Packaging:    " + booking.getParPackingPreference());
        menu.showDivider();
        System.out.println("PAYMENT");
        System.out.println("  Method:       " + booking.getPaymentMethod());
        System.out.println("  Amount:       Rs. " + String.format("%.0f", booking.getParServiceCost()));
        System.out.println("  Paid At:      " + (booking.getParPaymentTime() != null ? booking.getParPaymentTime().format(DT_FORMAT) : "N/A"));
        System.out.println("========================================\n");
    }

    // =============================================
    // SUPPORT (Customer side)
    // =============================================

    /**
     * US7: Customer raises a support issue.
     */
    private void contactSupport() {
        System.out.println("\n--- Contact Support ---");

        String bookingId = menu.readLine("Related Booking ID (optional, Enter to skip): ");
        String subject = menu.readLine("Issue Subject: ");
        String description = menu.readLine("Describe the issue: ");

        if (subject.isEmpty()) {
            menu.showError("Subject is required.");
            return;
        }

        int sevChoice = menu.readSeverity();
        String severity = switch (sevChoice) {
            case 2 -> "Medium";
            case 3 -> "High";
            case 4 -> "Critical";
            default -> "Low";
        };

        String issueId = IdGenerator.generateIssueId(issueDAO.getCount());

        Issue issue = new Issue(issueId, currentUser.getUserId(),
                bookingId.isEmpty() ? null : bookingId.trim(),
                subject.trim(), description.trim(), severity);

        Issue saved = issueDAO.save(issue);
        if (saved != null) {
            menu.showSuccess("Issue submitted!");
            System.out.println("  Issue ID:  " + issueId);
            System.out.println("  Severity:  " + severity);
            System.out.println("  Status:    Open");
            System.out.println("  Assigned:  Support Team (SUP-001)");
        } else {
            menu.showError("Failed to submit issue.");
        }
    }

    // =============================================
    // PROFILE
    // =============================================

    /**
     * US8: View current user's profile.
     */
    private void viewProfile() {
        System.out.println("\n--- My Profile ---");
        menu.showDivider();
        System.out.println("User ID:     " + currentUser.getUserId());
        System.out.println("Name:        " + currentUser.getFullName());
        System.out.println("Email:       " + currentUser.getEmail());
        System.out.println("Mobile:      " + currentUser.getCountryCode() + " " + currentUser.getMobile());
        System.out.println("Address:     " + currentUser.getStreet() + ", " + currentUser.getCity()
                + ", " + currentUser.getState() + " " + currentUser.getZipCode());
        System.out.println("Country:     " + currentUser.getCountry());
        System.out.println("Role:        " + currentUser.getRole());
        System.out.println("Preferences: " + currentUser.getPreferences());
        System.out.println("Member Since:" + (currentUser.getCreatedAt() != null ? currentUser.getCreatedAt().format(DT_FORMAT) : "N/A"));
        menu.showDivider();
    }

    // =============================================
    // OFFICER — Delivery Status Update
    // =============================================

    /**
     * US11: Update the delivery status of a booking.
     */
    private void updateDeliveryStatus() {
        System.out.println("\n--- Update Delivery Status ---");
        String bookingId = menu.readLine("Booking ID: ");

        Booking booking = bookingDAO.findById(bookingId.trim());
        if (booking == null) {
            menu.showError("Booking not found.");
            return;
        }

        System.out.println("Current Status: " + booking.getParStatus());

        int statusChoice = menu.readStatus();
        String newStatus = switch (statusChoice) {
            case 1 -> "Booked";
            case 2 -> "Picked Up";
            case 3 -> "In Transit";
            case 4 -> "Delivered";
            case 5 -> "Returned";
            default -> null;
        };

        if (newStatus == null) {
            menu.showError("Invalid status.");
            return;
        }

        if (bookingDAO.updateStatus(bookingId.trim(), newStatus)) {
            menu.showSuccess("Status updated: " + booking.getParStatus() + " -> " + newStatus);
        } else {
            menu.showError("Failed to update status.");
        }
    }

    // =============================================
    // OFFICER — Schedule Pickup
    // =============================================

    /**
     * US12: Schedule pickup and dropoff times.
     */
    private void schedulePickup() {
        System.out.println("\n--- Schedule Pickup ---");
        String bookingId = menu.readLine("Booking ID: ");

        Booking booking = bookingDAO.findById(bookingId.trim());
        if (booking == null) {
            menu.showError("Booking not found.");
            return;
        }

        displayBookingDetails(booking);

        String pickupStr = menu.readLine("Pickup Date-Time (yyyy-MM-dd HH:mm): ");
        String dropoffStr = menu.readLine("Dropoff Date-Time (yyyy-MM-dd HH:mm): ");

        try {
            LocalDateTime pickup = LocalDateTime.parse(pickupStr, DT_FORMAT);
            LocalDateTime dropoff = LocalDateTime.parse(dropoffStr, DT_FORMAT);

            if (bookingDAO.updatePickupDropoff(bookingId.trim(), pickup, dropoff)) {
                menu.showSuccess("Pickup scheduled!");
                System.out.println("  Pickup:  " + pickup.format(DT_FORMAT));
                System.out.println("  Dropoff: " + dropoff.format(DT_FORMAT));
            } else {
                menu.showError("Failed to schedule.");
            }
        } catch (Exception e) {
            menu.showError("Invalid date format. Use: yyyy-MM-dd HH:mm");
        }
    }

    // =============================================
    // OFFICER — Issue Management
    // =============================================

    /**
     * US14: Officer views and manages all issues.
     */
    private void manageIssues() {
        System.out.println("\n--- Issue Management ---");

        List<Issue> issues = issueDAO.findAll();
        if (issues.isEmpty()) {
            menu.showInfo("No issues found.");
            return;
        }

        System.out.printf("%-8s %-12s %-25s %-10s %-12s %-10s%n",
                "ID", "User", "Subject", "Severity", "Status", "Assigned");
        menu.showDivider();

        for (Issue issue : issues) {
            System.out.printf("%-8s %-12s %-25s %-10s %-12s %-10s%n",
                    issue.getIssueId(),
                    issue.getUserId(),
                    truncate(issue.getSubject(), 23),
                    issue.getSeverity(),
                    issue.getStatus(),
                    issue.getAssignedTo());
        }

        System.out.println();
        String issueId = menu.readLine("Enter Issue ID to manage (or Enter to skip): ");
        if (issueId.isEmpty()) return;

        Issue issue = issueDAO.findById(issueId.trim());
        if (issue == null) {
            menu.showError("Issue not found.");
            return;
        }

        String assignTo = menu.readLine("Assign to (Support User ID, Enter to keep " + issue.getAssignedTo() + "): ");
        if (assignTo.isEmpty()) assignTo = issue.getAssignedTo();

        int statusChoice = menu.readIssueStatus();
        String newStatus = switch (statusChoice) {
            case 2 -> "In Progress";
            case 3 -> "Resolved";
            default -> "Open";
        };

        String notes = menu.readLine("Notes: ");

        if (issueDAO.update(issueId.trim(), newStatus, assignTo, notes)) {
            menu.showSuccess("Issue updated.");
        } else {
            menu.showError("Failed to update issue.");
        }
    }

    // =============================================
    // SUPPORT — View & Update Issues
    // =============================================

    private void viewAssignedIssues() {
        System.out.println("\n--- My Assigned Issues ---");

        List<Issue> issues = issueDAO.findByAssignedTo(currentUser.getUserId());
        if (issues.isEmpty()) {
            menu.showInfo("No issues assigned to you.");
            return;
        }

        System.out.printf("%-8s %-12s %-25s %-10s %-12s%n", "ID", "Customer", "Subject", "Severity", "Status");
        menu.showDivider();

        for (Issue issue : issues) {
            System.out.printf("%-8s %-12s %-25s %-10s %-12s%n",
                    issue.getIssueId(),
                    issue.getUserId(),
                    truncate(issue.getSubject(), 23),
                    issue.getSeverity(),
                    issue.getStatus());
        }
    }

    private void updateIssueStatus() {
        System.out.println("\n--- Update Issue ---");
        String issueId = menu.readLine("Issue ID: ");

        Issue issue = issueDAO.findById(issueId.trim());
        if (issue == null) {
            menu.showError("Issue not found.");
            return;
        }

        if (!issue.getAssignedTo().equals(currentUser.getUserId())) {
            menu.showError("This issue is not assigned to you.");
            return;
        }

        System.out.println("Current Status: " + issue.getStatus());

        int statusChoice = menu.readIssueStatus();
        String newStatus = switch (statusChoice) {
            case 2 -> "In Progress";
            case 3 -> "Resolved";
            default -> "Open";
        };

        String notes = menu.readLine("Add Notes: ");

        if (issueDAO.update(issueId.trim(), newStatus, currentUser.getUserId(), notes)) {
            menu.showSuccess("Issue updated: " + issue.getStatus() + " -> " + newStatus);
        } else {
            menu.showError("Failed to update issue.");
        }
    }

    // =============================================
    // HELPERS
    // =============================================

    private void displayBookingDetails(Booking b) {
        menu.showDivider();
        System.out.println("Booking ID:  " + b.getBookingId());
        System.out.println("Sender:      " + b.getUserId());
        System.out.println("Receiver:    " + b.getRecName());
        System.out.println("Address:     " + b.getRecAddress() + ", " + b.getRecPin());
        System.out.println("Weight:      " + b.getParWeightGram() + "g");
        System.out.println("Contents:    " + b.getParContentsDescription());
        System.out.println("Delivery:    " + b.getParDeliveryType());
        System.out.println("Packaging:   " + b.getParPackingPreference());
        System.out.println("Cost:        Rs. " + String.format("%.0f", b.getParServiceCost()));
        System.out.println("Status:      " + b.getParStatus());
        System.out.println("Pickup:      " + (b.getParPickupTime() != null ? b.getParPickupTime().format(DT_FORMAT) : "Not scheduled"));
        System.out.println("Dropoff:     " + (b.getParDropoffTime() != null ? b.getParDropoffTime().format(DT_FORMAT) : "Not scheduled"));
        System.out.println("Created:     " + (b.getCreatedAt() != null ? b.getCreatedAt().format(DT_FORMAT) : "N/A"));
        menu.showDivider();
    }

    private String truncate(String s, int maxLen) {
        if (s == null) return "";
        return s.length() > maxLen ? s.substring(0, maxLen - 2) + ".." : s;
    }
}
