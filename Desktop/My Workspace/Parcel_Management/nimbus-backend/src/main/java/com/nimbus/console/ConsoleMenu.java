package com.nimbus.console;

import java.util.Scanner;

/**
 * ConsoleMenu — Displays menus and reads user input.
 * Separates UI display from business logic (Single Responsibility Principle).
 */
public class ConsoleMenu {

    private final Scanner scanner;

    public ConsoleMenu(Scanner scanner) {
        this.scanner = scanner;
    }

    // =============================================
    // MENU DISPLAYS
    // =============================================

    public void showBanner() {
        System.out.println("\n========================================");
        System.out.println("  NIMBUS — Parcel Management System");
        System.out.println("  Console Application (Phase 2)");
        System.out.println("========================================\n");
    }

    public int showMainMenu() {
        System.out.println("\n--- Main Menu ---");
        System.out.println("1. Register (New Customer)");
        System.out.println("2. Login");
        System.out.println("0. Exit");
        return readInt("Choose an option: ");
    }

    public int showCustomerMenu(String name) {
        System.out.println("\n--- Customer Dashboard [" + name + "] ---");
        System.out.println("1. Book a Parcel");
        System.out.println("2. Track Parcel");
        System.out.println("3. Booking History");
        System.out.println("4. View Invoice");
        System.out.println("5. Contact Support");
        System.out.println("6. My Profile");
        System.out.println("0. Logout");
        return readInt("Choose an option: ");
    }

    public int showOfficerMenu(String name) {
        System.out.println("\n--- Officer Dashboard [" + name + "] ---");
        System.out.println("1. Book Parcel (Walk-in Customer)");
        System.out.println("2. Track Any Parcel");
        System.out.println("3. Update Delivery Status");
        System.out.println("4. Schedule Pickup");
        System.out.println("5. All Booking History");
        System.out.println("6. Manage Issues");
        System.out.println("7. My Profile");
        System.out.println("0. Logout");
        return readInt("Choose an option: ");
    }

    public int showSupportMenu(String name) {
        System.out.println("\n--- Support Dashboard [" + name + "] ---");
        System.out.println("1. View Assigned Issues");
        System.out.println("2. Update Issue Status");
        System.out.println("3. My Profile");
        System.out.println("0. Logout");
        return readInt("Choose an option: ");
    }

    // =============================================
    // INPUT HELPERS
    // =============================================

    public String readLine(String prompt) {
        System.out.print(prompt);
        return scanner.nextLine().trim();
    }

    public int readInt(String prompt) {
        System.out.print(prompt);
        try {
            int val = Integer.parseInt(scanner.nextLine().trim());
            return val;
        } catch (NumberFormatException e) {
            return -1;
        }
    }

    public double readDouble(String prompt) {
        System.out.print(prompt);
        try {
            return Double.parseDouble(scanner.nextLine().trim());
        } catch (NumberFormatException e) {
            return -1;
        }
    }

    public int readDeliveryType() {
        System.out.println("\nDelivery Type:");
        System.out.println("1. Standard (5-7 days)");
        System.out.println("2. Express (2-3 days)");
        System.out.println("3. Overnight (next day)");
        return readInt("Choose: ");
    }

    public int readPackagingType() {
        System.out.println("\nPackaging Preference:");
        System.out.println("1. Standard Packaging");
        System.out.println("2. Custom Packaging (+Rs.50)");
        System.out.println("3. Eco-friendly Packaging (+Rs.30)");
        System.out.println("4. Fragile Item Handling (+Rs.80)");
        return readInt("Choose: ");
    }

    public int readSeverity() {
        System.out.println("\nSeverity:");
        System.out.println("1. Low");
        System.out.println("2. Medium");
        System.out.println("3. High");
        System.out.println("4. Critical");
        return readInt("Choose: ");
    }

    public int readStatus() {
        System.out.println("\nNew Status:");
        System.out.println("1. Booked");
        System.out.println("2. Picked Up");
        System.out.println("3. In Transit");
        System.out.println("4. Delivered");
        System.out.println("5. Returned");
        return readInt("Choose: ");
    }

    public int readIssueStatus() {
        System.out.println("\nIssue Status:");
        System.out.println("1. Open");
        System.out.println("2. In Progress");
        System.out.println("3. Resolved");
        return readInt("Choose: ");
    }

    // =============================================
    // OUTPUT HELPERS
    // =============================================

    public void showSuccess(String message) {
        System.out.println("\n[SUCCESS] " + message);
    }

    public void showError(String message) {
        System.out.println("\n[ERROR] " + message);
    }

    public void showInfo(String message) {
        System.out.println("\n[INFO] " + message);
    }

    public void showDivider() {
        System.out.println("----------------------------------------");
    }
}
