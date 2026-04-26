/* ========================================
   NIMBUS — Pricing Calculator
   Calculates service cost based on:
   - Parcel weight
   - Delivery type (Standard / Express / Overnight)
   - Packaging preference
   - Insurance
   ======================================== */

const NimbusPricing = {

  // Base rate per gram
  BASE_RATE_PER_GRAM: 0.15,

  // Delivery speed multipliers
  DELIVERY_TYPES: {
    'Standard':  { multiplier: 1.0, label: 'Standard (5-7 days)',  days: '5-7' },
    'Express':   { multiplier: 1.8, label: 'Express (2-3 days)',   days: '2-3' },
    'Overnight': { multiplier: 3.0, label: 'Overnight (next day)', days: '1' }
  },

  // Packaging add-ons (flat fee)
  PACKAGING: {
    'Standard Packaging':      { fee: 0,   label: 'Standard Packaging' },
    'Custom Packaging':        { fee: 50,  label: 'Custom Packaging (+₹50)' },
    'Eco-friendly Packaging':  { fee: 30,  label: 'Eco-friendly Packaging (+₹30)' },
    'Fragile Item Handling':   { fee: 80,  label: 'Fragile Item Handling (+₹80)' }
  },

  // Insurance
  INSURANCE: {
    'None':     { rate: 0,    label: 'No Insurance' },
    'Basic':    { rate: 0.02, label: 'Basic (2% of declared value)' },
    'Premium':  { rate: 0.05, label: 'Premium (5% of declared value)' }
  },

  // Minimum charge
  MIN_CHARGE: 50,

  calculate(weightGram, deliveryType, packagingType, insuranceType, declaredValue) {
    const weight = parseFloat(weightGram) || 0;
    const delivery = this.DELIVERY_TYPES[deliveryType] || this.DELIVERY_TYPES['Standard'];
    const packaging = this.PACKAGING[packagingType] || this.PACKAGING['Standard Packaging'];
    const insurance = this.INSURANCE[insuranceType] || this.INSURANCE['None'];

    // Base cost = weight × rate × delivery multiplier
    let baseCost = weight * this.BASE_RATE_PER_GRAM * delivery.multiplier;

    // Add packaging fee
    baseCost += packaging.fee;

    // Add insurance (percentage of declared value)
    const insuranceCost = (parseFloat(declaredValue) || 0) * insurance.rate;
    baseCost += insuranceCost;

    // Minimum charge
    const total = Math.max(baseCost, this.MIN_CHARGE);

    return {
      baseCost: Math.round(weight * this.BASE_RATE_PER_GRAM * delivery.multiplier),
      packagingFee: packaging.fee,
      insuranceCost: Math.round(insuranceCost),
      total: Math.round(total),
      deliveryDays: delivery.days
    };
  }
};
