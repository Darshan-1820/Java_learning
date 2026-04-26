/* ========================================
   NIMBUS — Indian Pincode Lookup
   Maps ZIP codes to city + state.
   ~20 major cities. Falls back to manual entry.
   ======================================== */

const PINCODE_DB = {
  '110001': { city: 'New Delhi', state: 'Delhi' },
  '400001': { city: 'Mumbai', state: 'Maharashtra' },
  '560001': { city: 'Bangalore', state: 'Karnataka' },
  '600001': { city: 'Chennai', state: 'Tamil Nadu' },
  '700001': { city: 'Kolkata', state: 'West Bengal' },
  '500001': { city: 'Hyderabad', state: 'Telangana' },
  '380001': { city: 'Ahmedabad', state: 'Gujarat' },
  '411001': { city: 'Pune', state: 'Maharashtra' },
  '302001': { city: 'Jaipur', state: 'Rajasthan' },
  '226001': { city: 'Lucknow', state: 'Uttar Pradesh' },
  '160001': { city: 'Chandigarh', state: 'Chandigarh' },
  '462001': { city: 'Bhopal', state: 'Madhya Pradesh' },
  '800001': { city: 'Patna', state: 'Bihar' },
  '682001': { city: 'Kochi', state: 'Kerala' },
  '122001': { city: 'Gurugram', state: 'Haryana' },
  '201301': { city: 'Noida', state: 'Uttar Pradesh' },
  '395001': { city: 'Surat', state: 'Gujarat' },
  '440001': { city: 'Nagpur', state: 'Maharashtra' },
  '441108': { city: 'Nagpur', state: 'Maharashtra' },
  '751001': { city: 'Bhubaneswar', state: 'Odisha' },
  '781001': { city: 'Guwahati', state: 'Assam' },
};

function lookupPincode(pin) {
  return PINCODE_DB[pin] || null;
}

// Country list with phone codes
const COUNTRIES = [
  { name: 'India', code: '+91', short: 'IN' },
  { name: 'United States', code: '+1', short: 'US' },
  { name: 'United Kingdom', code: '+44', short: 'UK' },
  { name: 'Australia', code: '+61', short: 'AU' },
  { name: 'Canada', code: '+1', short: 'CA' },
  { name: 'Germany', code: '+49', short: 'DE' },
  { name: 'Japan', code: '+81', short: 'JP' },
  { name: 'Singapore', code: '+65', short: 'SG' },
  { name: 'UAE', code: '+971', short: 'AE' },
  { name: 'Nepal', code: '+977', short: 'NP' },
];
