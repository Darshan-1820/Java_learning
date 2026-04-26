-- ========================================
-- NIMBUS — Database Schema
-- H2 with MySQL compatibility mode
-- ========================================

-- Drop tables if they exist (for clean re-init)
DROP TABLE IF EXISTS issues;
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS users;

-- ========================================
-- USERS TABLE
-- ========================================
CREATE TABLE users (
    user_id         VARCHAR(20)     PRIMARY KEY,
    first_name      VARCHAR(25)     NOT NULL,
    middle_name     VARCHAR(25),
    last_name       VARCHAR(25)     NOT NULL,
    full_name       VARCHAR(50)     NOT NULL,
    email           VARCHAR(100)    NOT NULL UNIQUE,
    country_code    VARCHAR(5)      DEFAULT '+91',
    mobile          VARCHAR(10)     NOT NULL,
    street          VARCHAR(200),
    zip_code        VARCHAR(10),
    city            VARCHAR(50),
    state           VARCHAR(50),
    country         VARCHAR(50)     DEFAULT 'India',
    password        VARCHAR(30)     NOT NULL,
    role            VARCHAR(10)     NOT NULL CHECK (role IN ('customer', 'officer', 'support')),
    preferences     VARCHAR(50),
    created_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- BOOKINGS TABLE
-- ========================================
CREATE TABLE bookings (
    booking_id              VARCHAR(20)     PRIMARY KEY,
    user_id                 VARCHAR(20)     NOT NULL,
    rec_name                VARCHAR(50)     NOT NULL,
    rec_address             VARCHAR(200)    NOT NULL,
    rec_pin                 VARCHAR(10)     NOT NULL,
    rec_mobile              VARCHAR(20)     NOT NULL,
    par_weight_gram         INT             NOT NULL,
    par_contents_description VARCHAR(200),
    par_delivery_type       VARCHAR(20)     NOT NULL CHECK (par_delivery_type IN ('Standard', 'Express', 'Overnight')),
    par_packing_preference  VARCHAR(30),
    par_pickup_time         TIMESTAMP,
    par_dropoff_time        TIMESTAMP,
    par_service_cost        DOUBLE          DEFAULT 0,
    par_payment_time        TIMESTAMP,
    payment_method          VARCHAR(10)     CHECK (payment_method IN ('card', 'upi')),
    par_status              VARCHAR(20)     NOT NULL CHECK (par_status IN ('Booked', 'Picked Up', 'In Transit', 'Delivered', 'Returned')),
    created_at              TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- ========================================
-- ISSUES TABLE
-- ========================================
CREATE TABLE issues (
    issue_id        VARCHAR(10)     PRIMARY KEY,
    user_id         VARCHAR(20)     NOT NULL,
    booking_id      VARCHAR(20),
    subject         VARCHAR(100)    NOT NULL,
    description     VARCHAR(500),
    severity        VARCHAR(10)     NOT NULL CHECK (severity IN ('Low', 'Medium', 'High', 'Critical')),
    status          VARCHAR(15)     NOT NULL CHECK (status IN ('Open', 'In Progress', 'Resolved')),
    assigned_to     VARCHAR(20),
    notes           VARCHAR(500),
    created_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id)
);

-- ========================================
-- INDEXES (for faster lookups)
-- ========================================
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_status ON bookings(par_status);
CREATE INDEX idx_bookings_created ON bookings(created_at);
CREATE INDEX idx_issues_user_id ON issues(user_id);
CREATE INDEX idx_issues_assigned ON issues(assigned_to);
CREATE INDEX idx_issues_status ON issues(status);
