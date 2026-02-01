-- LoanEase Database Schema for Supabase
-- Run this SQL in the Supabase SQL Editor

-- Drop table if exists (for fresh setup)
DROP TABLE IF EXISTS loan_applications;

-- Create the loan_applications table
CREATE TABLE loan_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    whatsapp VARCHAR(15),
    loan_type VARCHAR(50) NOT NULL,
    loan_amount DECIMAL(15, 2) NOT NULL,
    employment_type VARCHAR(50),
    monthly_income DECIMAL(15, 2),
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10),
    pan_card_url TEXT,
    aadhar_card_url TEXT,
    itr_url TEXT,
    bank_statement_url TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX idx_loan_applications_status ON loan_applications(status);
CREATE INDEX idx_loan_applications_created_at ON loan_applications(created_at DESC);
CREATE INDEX idx_loan_applications_loan_type ON loan_applications(loan_type);
CREATE INDEX idx_loan_applications_email ON loan_applications(email);
CREATE INDEX idx_loan_applications_phone ON loan_applications(phone);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_loan_applications_updated_at ON loan_applications;
CREATE TRIGGER update_loan_applications_updated_at
    BEFORE UPDATE ON loan_applications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE loan_applications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow anonymous inserts" ON loan_applications;
DROP POLICY IF EXISTS "Allow service role full access" ON loan_applications;

-- Create policy to allow inserts from anyone (for form submissions)
CREATE POLICY "Allow anonymous inserts" ON loan_applications
    FOR INSERT
    WITH CHECK (true);

-- Create policy to allow service role to read all (for backend/admin)
CREATE POLICY "Allow service role full access" ON loan_applications
    FOR ALL
    USING (auth.role() = 'service_role');

-- Insert some sample data for testing (optional - you can skip this)
-- Uncomment the lines below if you want sample data

/*
INSERT INTO loan_applications (full_name, email, phone, whatsapp, loan_type, loan_amount, employment_type, monthly_income, city, state, pincode, status) VALUES
('Rahul Sharma', 'rahul.sharma@email.com', '9876543210', '9876543210', 'personal', 500000, 'salaried', 75000, 'Mumbai', 'Maharashtra', '400001', 'approved'),
('Priya Patel', 'priya.patel@email.com', '9876543211', '9876543211', 'home', 4500000, 'salaried', 150000, 'Bangalore', 'Karnataka', '560001', 'pending'),
('Amit Kumar', 'amit.kumar@email.com', '9876543212', '9876543212', 'business', 2500000, 'self-employed', 200000, 'Delhi', 'Delhi', '110001', 'pending'),
('Sneha Reddy', 'sneha.reddy@email.com', '9876543213', '9876543213', 'car', 1200000, 'salaried', 90000, 'Hyderabad', 'Telangana', '500001', 'approved'),
('Vikram Singh', 'vikram.singh@email.com', '9876543214', '9876543214', 'education', 2000000, 'student', 0, 'Chennai', 'Tamil Nadu', '600001', 'pending');
*/

-- Verify table creation
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'loan_applications'
ORDER BY ordinal_position;
