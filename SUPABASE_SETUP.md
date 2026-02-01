# Supabase Setup Guide for LoanEase

This guide will help you set up Supabase as the database for your loan application website.

## Step 1: Create a Supabase Account

1. Go to [https://supabase.com](https://supabase.com)
2. Click **"Start your project"** or **"Sign Up"**
3. Sign up using GitHub, GitLab, or email
4. Verify your email if required

## Step 2: Create a New Project

1. Once logged in, click **"New Project"**
2. Fill in the project details:
   - **Name**: `loan-ease` (or any name you prefer)
   - **Database Password**: Create a strong password (SAVE THIS - you'll need it!)
   - **Region**: Select the region closest to your users (e.g., Mumbai for India)
3. Click **"Create new project"**
4. Wait for the project to be provisioned (this may take a few minutes)

## Step 3: Get Your API Keys

1. In your Supabase project dashboard, click on **"Settings"** (gear icon) in the sidebar
2. Click on **"API"** under Configuration
3. You'll find:
   - **Project URL**: Copy this (looks like `https://xxxxx.supabase.co`)
   - **anon/public key**: Copy this (for frontend)
   - **service_role key**: Copy this (for backend - KEEP THIS SECRET!)

## Step 4: Create the Database Tables

1. In your Supabase dashboard, click on **"SQL Editor"** in the sidebar
2. Click **"New query"**
3. Copy and paste the following SQL code:

```sql
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

-- Create index for faster queries
CREATE INDEX idx_loan_applications_status ON loan_applications(status);
CREATE INDEX idx_loan_applications_created_at ON loan_applications(created_at DESC);
CREATE INDEX idx_loan_applications_loan_type ON loan_applications(loan_type);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_loan_applications_updated_at
    BEFORE UPDATE ON loan_applications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE loan_applications ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserts from anyone (for form submissions)
CREATE POLICY "Allow anonymous inserts" ON loan_applications
    FOR INSERT
    WITH CHECK (true);

-- Create policy to allow service role to read all
CREATE POLICY "Allow service role full access" ON loan_applications
    FOR ALL
    USING (auth.role() = 'service_role');
```

4. Click **"Run"** to execute the SQL

## Step 5: Set Up Storage for Documents

1. In your Supabase dashboard, click on **"Storage"** in the sidebar
2. Click **"New bucket"**
3. Create a bucket with:
   - **Name**: `documents`
   - **Public bucket**: Toggle ON (so uploaded files can be accessed via URLs)
4. Click **"Create bucket"**

### Set Storage Policies

1. Click on the **"documents"** bucket
2. Click on **"Policies"** tab
3. Click **"New Policy"**
4. Select **"For full customization"**
5. Add the following policies:

**Policy 1: Allow uploads**
- Policy name: `Allow uploads`
- Allowed operation: `INSERT`
- Target roles: Leave empty for all
- USING expression: `true`
- WITH CHECK expression: `true`

**Policy 2: Allow public reads**
- Policy name: `Allow public reads`
- Allowed operation: `SELECT`
- Target roles: Leave empty for all
- USING expression: `true`

## Step 6: Configure Environment Variables

### Backend (.env file)

Create a `.env` file in the `backend` folder:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-role-key

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local file)

Create a `.env.local` file in the `frontend` folder:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:5000

# Supabase Configuration (for client-side if needed)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Step 7: Verify Setup

1. Start your backend server:
   ```bash
   cd backend
   npm run dev
   ```

2. Start your frontend:
   ```bash
   cd frontend
   npm run dev
   ```

3. Visit `http://localhost:3000` and try submitting a loan application
4. Check the Supabase dashboard -> Table Editor -> loan_applications to see if the data was inserted

## Troubleshooting

### Common Issues:

1. **CORS errors**: Make sure `FRONTEND_URL` in backend `.env` matches your frontend URL

2. **Storage upload fails**: Check that the `documents` bucket exists and policies are set correctly

3. **Database insert fails**: Verify that RLS policies are correctly set up

4. **Environment variables not loading**: Make sure you restart the server after changing `.env` files

### Checking Logs:

- Backend logs appear in your terminal
- Supabase logs: Dashboard -> Logs -> API or Database

## Security Notes

1. **Never commit `.env` files** to version control - they contain sensitive keys
2. **Service role key** should ONLY be used on the backend server, never exposed to the frontend
3. **Enable email verification** for Supabase Auth if you add user authentication later
4. Consider setting up **RLS policies** for additional security in production

## Optional: Enable Real-time Updates

If you want to see applications in real-time:

1. Go to Database -> Replication
2. Enable replication for `loan_applications` table
3. Use Supabase client's real-time subscription in your admin dashboard

## Database Schema Summary

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| full_name | VARCHAR(255) | Applicant's full name |
| email | VARCHAR(255) | Email address |
| phone | VARCHAR(15) | Mobile number |
| whatsapp | VARCHAR(15) | WhatsApp number (optional) |
| loan_type | VARCHAR(50) | Type of loan |
| loan_amount | DECIMAL | Requested loan amount |
| employment_type | VARCHAR(50) | Employment status |
| monthly_income | DECIMAL | Monthly income |
| city | VARCHAR(100) | City |
| state | VARCHAR(100) | State |
| pincode | VARCHAR(10) | PIN code |
| pan_card_url | TEXT | URL to uploaded PAN card |
| aadhar_card_url | TEXT | URL to uploaded Aadhaar |
| itr_url | TEXT | URL to uploaded ITR |
| bank_statement_url | TEXT | URL to uploaded bank statement |
| status | VARCHAR(20) | Application status (pending/approved/rejected) |
| admin_notes | TEXT | Internal notes |
| created_at | TIMESTAMP | Application submission time |
| updated_at | TIMESTAMP | Last update time |
