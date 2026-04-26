-- ========================================
-- NIMBUS — Seed Data
-- Matches exactly with storage.js seed data
-- ========================================

-- ========================================
-- USERS: 5 customers + 2 officers + 1 support
-- ========================================

INSERT INTO users (user_id, first_name, middle_name, last_name, full_name, email, country_code, mobile, street, zip_code, city, state, country, password, role, preferences, created_at) VALUES
('260401-AK01', 'Amit',   '', 'Kumar',  'Amit Kumar',   'amit.kumar@email.com',   '+91', '9876543210', '45 MG Road',              '560001', 'Bangalore',  'Karnataka',     'India', 'Amit@123',    'customer', 'Email notifications',    '2026-04-01 10:00:00'),
('260401-PS02', 'Priya',  '', 'Sharma', 'Priya Sharma',  'priya.sharma@email.com', '+91', '9876543211', '12 Nehru Place',          '110019', 'New Delhi',  'Delhi',         'India', 'Priya@123',   'customer', 'SMS notifications',      '2026-04-01 10:15:00'),
('260401-RV03', 'Rahul',  '', 'Verma',  'Rahul Verma',   'rahul.verma@email.com',  '+91', '9876543212', '78 Park Street',          '700016', 'Kolkata',    'West Bengal',   'India', 'Rahul@123',   'customer', 'Email notifications',    '2026-04-01 10:30:00'),
('260401-SM04', 'Sneha',  '', 'Menon',  'Sneha Menon',   'sneha.menon@email.com',  '+91', '9876543213', '23 Anna Salai',           '600002', 'Chennai',    'Tamil Nadu',    'India', 'Sneha@123',   'customer', 'Both Email and SMS',     '2026-04-01 11:00:00'),
('260401-DP05', 'Deepak', '', 'Patel',  'Deepak Patel',  'deepak.patel@email.com', '+91', '9876543214', '56 SG Highway',           '380015', 'Ahmedabad',  'Gujarat',       'India', 'Deepak@123',  'customer', 'Email notifications',    '2026-04-01 11:15:00'),
('OFF-001',     'Rajesh', '', 'Nair',   'Rajesh Nair',   'rajesh.nair@nimbus.com', '+91', '9000000001', 'TCS MIHAN SEZ',           '441108', 'Nagpur',     'Maharashtra',   'India', 'Officer@123', 'officer',  '',                       '2026-03-15 09:00:00'),
('OFF-002',     'Meera',  '', 'Joshi',  'Meera Joshi',   'meera.joshi@nimbus.com', '+91', '9000000002', 'Nimbus Branch, Koramangala','560034', 'Bangalore', 'Karnataka',     'India', 'Officer@123', 'officer',  '',                       '2026-03-15 09:00:00'),
('SUP-001',     'Karan',  '', 'Singh',  'Karan Singh',   'karan.singh@nimbus.com', '+91', '9000000003', 'Nimbus Support Center',   '201301', 'Noida',      'Uttar Pradesh', 'India', 'Support@123', 'support',  '',                       '2026-03-15 09:00:00');

-- ========================================
-- BOOKINGS: 3 sample bookings
-- ========================================

INSERT INTO bookings (booking_id, user_id, rec_name, rec_address, rec_pin, rec_mobile, par_weight_gram, par_contents_description, par_delivery_type, par_packing_preference, par_pickup_time, par_dropoff_time, par_service_cost, par_payment_time, payment_method, par_status, created_at) VALUES
('NMB-260401-0001', '260401-AK01', 'Vikram Reddy', '90 Jubilee Hills, Hyderabad', '500033', '+91-8765432100', 500,  'Books and documents',          'Standard',  'Standard Packaging',     '2026-04-02 10:00:00', '2026-04-05 18:00:00', 150.0, '2026-04-01 12:00:00', 'card', 'In Transit', '2026-04-01 12:00:00'),
('NMB-260401-0002', '260401-PS02', 'Anita Desai',  '34 FC Road, Pune',           '411005', '+91-8765432101', 1200, 'Electronics - Laptop charger',  'Express',   'Fragile Item Handling',  '2026-04-02 09:00:00', '2026-04-03 18:00:00', 350.0, '2026-04-01 14:30:00', 'card', 'Booked',     '2026-04-01 14:30:00'),
('NMB-260401-0003', '260401-RV03', 'Suman Das',    '15 Salt Lake, Kolkata',      '700091', '+91-8765432102', 2500, 'Clothing and accessories',      'Standard',  'Eco-friendly Packaging', '2026-04-03 11:00:00', '2026-04-07 18:00:00', 200.0, '2026-04-01 16:00:00', 'card', 'Delivered',  '2026-04-01 16:00:00');
