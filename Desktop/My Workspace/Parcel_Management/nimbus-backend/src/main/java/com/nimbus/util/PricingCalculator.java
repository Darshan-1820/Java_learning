package com.nimbus.util;

import java.util.HashMap;
import java.util.Map;

/**
 * Calculates parcel service cost.
 * Exact replica of the frontend pricing.js logic.
 *
 * Formula:
 *   total = max((weight × BASE_RATE × delivery_multiplier) + packaging_fee + (declaredValue × insurance_rate), MIN_CHARGE)
 */
public class PricingCalculator {

    // Base rate per gram (in Rupees)
    public static final double BASE_RATE_PER_GRAM = 0.15;

    // Minimum charge
    public static final double MIN_CHARGE = 50.0;

    // Delivery type multipliers
    private static final Map<String, Double> DELIVERY_MULTIPLIERS = new HashMap<>();
    static {
        DELIVERY_MULTIPLIERS.put("Standard", 1.0);
        DELIVERY_MULTIPLIERS.put("Express", 1.8);
        DELIVERY_MULTIPLIERS.put("Overnight", 3.0);
    }

    // Packaging flat fees
    private static final Map<String, Double> PACKAGING_FEES = new HashMap<>();
    static {
        PACKAGING_FEES.put("Standard Packaging", 0.0);
        PACKAGING_FEES.put("Custom Packaging", 50.0);
        PACKAGING_FEES.put("Eco-friendly Packaging", 30.0);
        PACKAGING_FEES.put("Fragile Item Handling", 80.0);
    }

    // Insurance rates
    private static final Map<String, Double> INSURANCE_RATES = new HashMap<>();
    static {
        INSURANCE_RATES.put("None", 0.0);
        INSURANCE_RATES.put("Basic", 0.02);
        INSURANCE_RATES.put("Premium", 0.05);
    }

    /**
     * Calculate the total service cost for a parcel.
     *
     * @param weightGram       Parcel weight in grams
     * @param deliveryType     "Standard", "Express", or "Overnight"
     * @param packagingType    "Standard Packaging", "Custom Packaging", etc.
     * @param insuranceType    "None", "Basic", or "Premium"
     * @param declaredValue    Declared value of contents (for insurance calculation)
     * @return PricingResult with breakdown
     */
    public static PricingResult calculate(int weightGram, String deliveryType,
                                           String packagingType, String insuranceType,
                                           double declaredValue) {

        double multiplier = DELIVERY_MULTIPLIERS.getOrDefault(deliveryType, 1.0);
        double packagingFee = PACKAGING_FEES.getOrDefault(packagingType, 0.0);
        double insuranceRate = INSURANCE_RATES.getOrDefault(insuranceType, 0.0);

        double baseCost = weightGram * BASE_RATE_PER_GRAM * multiplier;
        double insuranceCost = declaredValue * insuranceRate;
        double total = Math.max(baseCost + packagingFee + insuranceCost, MIN_CHARGE);

        return new PricingResult(
                Math.round(baseCost),
                packagingFee,
                Math.round(insuranceCost),
                Math.round(total),
                getDeliveryDays(deliveryType)
        );
    }

    /** Simplified overload — no insurance */
    public static double calculateSimple(int weightGram, String deliveryType, String packagingType) {
        return calculate(weightGram, deliveryType, packagingType, "None", 0).total;
    }

    private static String getDeliveryDays(String deliveryType) {
        switch (deliveryType) {
            case "Express": return "2-3";
            case "Overnight": return "1";
            default: return "5-7";
        }
    }

    // --- Result object ---
    public static class PricingResult {
        public final double baseCost;
        public final double packagingFee;
        public final double insuranceCost;
        public final double total;
        public final String deliveryDays;

        public PricingResult(double baseCost, double packagingFee, double insuranceCost,
                             double total, String deliveryDays) {
            this.baseCost = baseCost;
            this.packagingFee = packagingFee;
            this.insuranceCost = insuranceCost;
            this.total = total;
            this.deliveryDays = deliveryDays;
        }

        @Override
        public String toString() {
            return String.format("Base: %.0f + Packaging: %.0f + Insurance: %.0f = Total: %.0f (Delivery: %s days)",
                    baseCost, packagingFee, insuranceCost, total, deliveryDays);
        }
    }
}
