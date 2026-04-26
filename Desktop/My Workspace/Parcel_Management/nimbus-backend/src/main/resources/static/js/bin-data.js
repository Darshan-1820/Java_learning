/* ========================================
   NIMBUS — BIN (Bank Identification Number) Data
   First 6 digits of card → network + bank info
   Also includes dummy test cards.
   ======================================== */

const BIN_RULES = [
  // Visa
  { prefix: '4', network: 'VISA', color: '#1A1F71', logo: 'VISA' },
  // Mastercard
  { prefix: '51', network: 'MASTERCARD', color: '#EB001B', logo: 'MC' },
  { prefix: '52', network: 'MASTERCARD', color: '#EB001B', logo: 'MC' },
  { prefix: '53', network: 'MASTERCARD', color: '#EB001B', logo: 'MC' },
  { prefix: '54', network: 'MASTERCARD', color: '#EB001B', logo: 'MC' },
  { prefix: '55', network: 'MASTERCARD', color: '#EB001B', logo: 'MC' },
  // RuPay
  { prefix: '60', network: 'RUPAY', color: '#097A44', logo: 'RuPay' },
  { prefix: '65', network: 'RUPAY', color: '#097A44', logo: 'RuPay' },
  { prefix: '81', network: 'RUPAY', color: '#097A44', logo: 'RuPay' },
  { prefix: '82', network: 'RUPAY', color: '#097A44', logo: 'RuPay' },
  // Amex
  { prefix: '34', network: 'AMEX', color: '#006FCF', logo: 'AMEX' },
  { prefix: '37', network: 'AMEX', color: '#006FCF', logo: 'AMEX' },
  // Discover
  { prefix: '6011', network: 'DISCOVER', color: '#FF6000', logo: 'DISC' },
];

function detectCardNetwork(cardNumber) {
  const num = cardNumber.replace(/\s/g, '');
  for (const rule of BIN_RULES) {
    if (num.startsWith(rule.prefix)) {
      return rule;
    }
  }
  return null;
}

// Dummy test cards for demo
const DUMMY_CARDS = [
  { number: '4111111111111111', holder: 'Amit Kumar',   expiry: '12/28', cvv: '123', network: 'VISA' },
  { number: '5200000000001096', holder: 'Priya Sharma',  expiry: '06/27', cvv: '456', network: 'MASTERCARD' },
  { number: '6000000000000001', holder: 'Rahul Verma',   expiry: '09/29', cvv: '789', network: 'RUPAY' },
  { number: '3400000000000009', holder: 'Sneha Menon',   expiry: '03/28', cvv: '012', network: 'AMEX' },
  { number: '4222222222222222', holder: 'Deepak Patel',  expiry: '11/27', cvv: '345', network: 'VISA' },
];

function formatCardNumber(num) {
  return num.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
}

function luhnCheck(num) {
  const digits = num.replace(/\s/g, '').split('').reverse().map(Number);
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    let d = digits[i];
    if (i % 2 === 1) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
  }
  return sum % 10 === 0;
}
