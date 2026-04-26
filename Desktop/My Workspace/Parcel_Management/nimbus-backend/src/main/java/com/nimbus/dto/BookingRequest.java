package com.nimbus.dto;

/**
 * BookingRequest — Data Transfer Object for booking API.
 */
public class BookingRequest {
    private String userId;
    private String recName;
    private String recAddress;
    private String recPin;
    private String recMobile;
    private int parWeightGram;
    private String parContentsDescription;
    private String parDeliveryType;
    private String parPackingPreference;
    private String paymentMethod;

    public BookingRequest() {}

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

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
}
