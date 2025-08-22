-- Migration script to add pickup_date column to existing hire_requests table
-- Run this if you already have the database set up without the pickup_date column

-- Add the pickup_date column
ALTER TABLE hire_requests 
ADD COLUMN IF NOT EXISTS pickup_date DATE;

-- Set a default pickup_date for existing records (set to tomorrow)
UPDATE hire_requests 
SET pickup_date = CURRENT_DATE + INTERVAL '1 day' 
WHERE pickup_date IS NULL;

-- Make the column NOT NULL after setting default values
ALTER TABLE hire_requests 
ALTER COLUMN pickup_date SET NOT NULL;
