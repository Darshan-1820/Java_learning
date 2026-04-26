package com.nimbus.service;

import com.nimbus.util.PricingCalculator;
import org.springframework.stereotype.Service;

/**
 * PricingService — Spring-managed wrapper around PricingCalculator.
 * Makes the pricing logic injectable into Controllers and Servlets.
 */
@Service
public class PricingService {

    /** Calculate full pricing with breakdown. */
    public PricingCalculator.PricingResult calculate(int weightGram, String deliveryType,
                                                      String packagingType, String insuranceType,
                                                      double declaredValue) {
        return PricingCalculator.calculate(weightGram, deliveryType, packagingType, insuranceType, declaredValue);
    }

    /** Calculate simple total (no insurance). */
    public double calculateSimple(int weightGram, String deliveryType, String packagingType) {
        return PricingCalculator.calculateSimple(weightGram, deliveryType, packagingType);
    }
}
