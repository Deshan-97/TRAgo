-- TravelGo Database Schema for Render Deployment
-- Run this SQL in your Render PostgreSQL database

-- Create hire_requests table
CREATE TABLE IF NOT EXISTS hire_requests (
    id SERIAL PRIMARY KEY,
    user_name VARCHAR(255) NOT NULL,
    user_phone VARCHAR(15) NOT NULL,
    pickup_location VARCHAR(500) NOT NULL,
    dropoff_location VARCHAR(500) NOT NULL,
    pickup_date DATE NOT NULL,
    hire_type VARCHAR(100) NOT NULL,
    vehicle_type VARCHAR(100), -- Add this line
    additional_details TEXT,
    image_paths TEXT[], -- Array of image file paths
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'pending'
);

-- Create bid_submissions table  
CREATE TABLE IF NOT EXISTS bid_submissions (
    id SERIAL PRIMARY KEY,
    hire_request_id INTEGER REFERENCES hire_requests(id) ON DELETE CASCADE,
    company_name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(15) NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    bid_amount DECIMAL(10,2) NOT NULL,
    additional_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'submitted'
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_hire_requests_created_at ON hire_requests(created_at);
CREATE INDEX IF NOT EXISTS idx_hire_requests_status ON hire_requests(status);
CREATE INDEX IF NOT EXISTS idx_bid_submissions_hire_request_id ON bid_submissions(hire_request_id);
CREATE INDEX IF NOT EXISTS idx_bid_submissions_created_at ON bid_submissions(created_at);

-- Insert sample data (optional for testing)
INSERT INTO hire_requests (user_name, user_phone, pickup_location, dropoff_location, pickup_date, hire_type, additional_details) VALUES
('ටෙස්ට් පරිශීලක', '0771234567', 'කොළඹ - රාජගිරිය', 'ගාල්ල - සමුද්‍ර තීරය', '2024-02-15', 'wedding', 'විශේෂ අවස්ථාවක් සඳහා වාහනයක් අවශ්‍යයි'),
('සාමාන්‍ය සේවාව', '0779876543', 'නුවර - දළදා මාළිගාව', 'කුරුණැගල', '2024-02-20', 'outstation', 'සාමාන්‍ය ගමනක් සඳහා');

-- Display completion message
SELECT 'TravelGo database schema created successfully!' as message;
