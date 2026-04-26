package com.nimbus.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @Column(name = "booking_id", length = 20)
    private String bookingId;

    @Column(name = "user_id", length = 20, nullable = false)
    private String userId;

    // --- Receiver Details ---
    @Column(name = "rec_name", length = 50, nullable = false)
    private String recName;

    @Column(name = "rec_address", length = 200, nullable = false)
    private String recAddress;

    @Column(name = "rec_pin", length = 10, nullable = false)
    private String recPin;

    @Column(name = "rec_mobile", length = 20, nullable = false)
    private String recMobile;

    // --- Parcel Details ---
    @Column(name = "par_weight_gram", nullable = false)
    private int parWeightGram;

    @Column(name = "par_contents_description", length = 200)
    private String parContentsDescription;

    @Column(name = "par_delivery_type", length = 20, nullable = false)
    private String parDeliveryType;

    @Column(name = "par_packing_preference", length = 30)
    private String parPackingPreference;

    @Column(name = "par_pickup_time")
    private LocalDateTime parPickupTime;

    @Column(name = "par_dropoff_time")
    private LocalDateTime parDropoffTime;

    // --- Payment ---
    @Column(name = "par_service_cost")
    private double parServiceCost;

    @Column(name = "par_payment_time")
    private LocalDateTime parPaymentTime;

    @Column(name = "payment_method", length = 10)
    private String paymentMethod;

    // --- Status ---
    @Column(name = "par_status", length = 20, nullable = false)
    private String parStatus;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // --- Constructors ---

    public Booking() {}

    public Booking(String bookingId, String userId, String recName, String recAddress,
                   String recPin, String recMobile, int parWeightGram,
                   String parContentsDescription, String parDeliveryType,
                   String parPackingPreference, LocalDateTime parPickupTime,
                   LocalDateTime parDropoffTime, double parServiceCost,
                   String paymentMethod, String parStatus) {
        this.bookingId = bookingId;
        this.userId = userId;
        this.recName = recName;
        this.recAddress = recAddress;
        this.recPin = recPin;
        this.recMobile = recMobile;
        this.parWeightGram = parWeightGram;
        this.parContentsDescription = parContentsDescription;
        this.parDeliveryType = parDeliveryType;
        this.parPackingPreference = parPackingPreference;
        this.parPickupTime = parPickupTime;
        this.parDropoffTime = parDropoffTime;
        this.parServiceCost = parServiceCost;
        this.parPaymentTime = LocalDateTime.now();
        this.paymentMethod = paymentMethod;
        this.parStatus = parStatus;
        this.createdAt = LocalDateTime.now();
    }

    // --- Getters and Setters ---

    public String getBookingId() { return bookingId; }
    public void setBookingId(String bookingId) { this.bookingId = bookingId; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getRecName() { return recName; }
    public void setRecName(String recName) { this.recName = recName; }

    public String getRecAddress() { return recAddress; }
    public void setRecAddress(String recAddress) { this.recAddress = recAddress; }

    public String getRecPin() { return recPin; }
    public void setRecPin(String recPin) { this.recPin = recPin; }

    public String getRecMobile() { return recMobile; }
    public void setRecMobile(String recMobile) { this.recMobile = recMobile; }

    public int getParWeightGram() { return parWeightGram; }
    public void setParWeightGram(int parWeightGram) { this.parWeightGram = parWeightGram; }

    public String getParContentsDescription() { return parContentsDescription; }
    public void setParContentsDescription(String parContentsDescription) { this.parContentsDescription = parContentsDescription; }

    public String getParDeliveryType() { return parDeliveryType; }
    public void setParDeliveryType(String parDeliveryType) { this.parDeliveryType = parDeliveryType; }

    public String getParPackingPreference() { return parPackingPreference; }
    public void setParPackingPreference(String parPackingPreference) { this.parPackingPreference = parPackingPreference; }

    public LocalDateTime getParPickupTime() { return parPickupTime; }
    public void setParPickupTime(LocalDateTime parPickupTime) { this.parPickupTime = parPickupTime; }

    public LocalDateTime getParDropoffTime() { return parDropoffTime; }
    public void setParDropoffTime(LocalDateTime parDropoffTime) { this.parDropoffTime = parDropoffTime; }

    public double getParServiceCost() { return parServiceCost; }
    public void setParServiceCost(double parServiceCost) { this.parServiceCost = parServiceCost; }

    public LocalDateTime getParPaymentTime() { return parPaymentTime; }
    public void setParPaymentTime(LocalDateTime parPaymentTime) { this.parPaymentTime = parPaymentTime; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getParStatus() { return parStatus; }
    public void setParStatus(String parStatus) { this.parStatus = parStatus; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    @Override
    public String toString() {
        return String.format("Booking[%s | User: %s | To: %s | Status: %s | Cost: %.0f]",
                bookingId, userId, recName, parStatus, parServiceCost);
    }
}
