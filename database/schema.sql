-- TravelGo Database Schema

-- Create hire_requests table
CREATE TABLE IF NOT EXISTS hire_requests (
    id SERIAL PRIMARY KEY,
    pickup_location VARCHAR(255) NOT NULL,
    dropoff_location VARCHAR(255) NOT NULL,
    pickup_date DATE NOT NULL,
    hire_type VARCHAR(50) NOT NULL CHECK (hire_type IN ('wedding', 'trip', 'airport_transport')),
    vehicle_type VARCHAR(50) NOT NULL CHECK (vehicle_type IN ('van', 'bus', 'car')),
    passengers INTEGER NOT NULL CHECK (passengers >= 1 AND passengers <= 50),
    ac_preference VARCHAR(10) NOT NULL CHECK (ac_preference IN ('AC', 'Non-AC')),
    duration_days INTEGER NOT NULL,
    additional_data TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- Create bid_submissions table
CREATE TABLE IF NOT EXISTS bid_submissions (
    id SERIAL PRIMARY KEY,
    hire_request_id INTEGER REFERENCES hire_requests(id) ON DELETE CASCADE,
    owner_name VARCHAR(255) NOT NULL,
    vehicle_type VARCHAR(50) NOT NULL,
    price_per_km_ac DECIMAL(10,2) NOT NULL,
    price_per_km_non_ac DECIMAL(10,2) NOT NULL,
    full_hire_price DECIMAL(10,2) NOT NULL,
    photo1_path VARCHAR(500),
    photo2_path VARCHAR(500),
    phone_number VARCHAR(20) NOT NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data for testing
INSERT INTO hire_requests (
    pickup_location, 
    dropoff_location, 
    pickup_date,
    hire_type, 
    vehicle_type, 
    passengers, 
    ac_preference, 
    duration_days, 
    additional_data
) VALUES (
    'Colombo Airport',
    'Kandy Hotel',
    '2025-08-25',
    'airport_transport',
    'car',
    4,
    'AC',
    1,
    'Need comfortable vehicle for family with luggage'
);
