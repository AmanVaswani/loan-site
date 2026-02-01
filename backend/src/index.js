require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit per file
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, JPEG, and PNG are allowed.'));
    }
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Get loan statistics (dummy data)
app.get('/api/stats', (req, res) => {
  res.json({
    totalDisbursed: 15000,
    amountDisbursed: 250, // in crores
    happyCustomers: 12500,
    bankPartners: 25,
    averageInterestRate: 8.5,
    cashbackGiven: 45 // in lakhs
  });
});

// Get loan types
app.get('/api/loan-types', (req, res) => {
  res.json([
    { id: 'personal', name: 'Personal Loan', minAmount: 50000, maxAmount: 4000000, interestRate: '10.5% - 18%' },
    { id: 'home', name: 'Home Loan', minAmount: 500000, maxAmount: 100000000, interestRate: '8.5% - 10%' },
    { id: 'business', name: 'Business Loan', minAmount: 100000, maxAmount: 50000000, interestRate: '12% - 20%' },
    { id: 'car', name: 'Car Loan', minAmount: 100000, maxAmount: 10000000, interestRate: '9% - 14%' },
    { id: 'education', name: 'Education Loan', minAmount: 100000, maxAmount: 7500000, interestRate: '8% - 12%' },
    { id: 'gold', name: 'Gold Loan', minAmount: 10000, maxAmount: 5000000, interestRate: '7% - 12%' }
  ]);
});

// Submit loan application
app.post('/api/applications', upload.fields([
  { name: 'panCard', maxCount: 1 },
  { name: 'aadharCard', maxCount: 1 },
  { name: 'itr', maxCount: 1 },
  { name: 'bankStatement', maxCount: 1 }
]), async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      whatsapp,
      loanType,
      loanAmount,
      employmentType,
      monthlyIncome,
      city,
      state,
      pincode
    } = req.body;

    // Validate required fields
    if (!fullName || !email || !phone || !loanType || !loanAmount) {
      return res.status(400).json({
        error: 'Missing required fields',
        details: 'Please provide fullName, email, phone, loanType, and loanAmount'
      });
    }

    const applicationId = uuidv4();
    const uploadedFiles = {};

    // Upload files to Supabase Storage
    if (req.files) {
      for (const [fieldName, files] of Object.entries(req.files)) {
        const file = files[0];
        const fileName = `${applicationId}/${fieldName}_${Date.now()}${path.extname(file.originalname)}`;

        const { data, error } = await supabase.storage
          .from('documents')
          .upload(fileName, file.buffer, {
            contentType: file.mimetype,
            upsert: false
          });

        if (error) {
          console.error(`Error uploading ${fieldName}:`, error);
          uploadedFiles[fieldName] = null;
        } else {
          // Get public URL
          const { data: urlData } = supabase.storage
            .from('documents')
            .getPublicUrl(fileName);
          uploadedFiles[fieldName] = urlData.publicUrl;
        }
      }
    }

    // Insert application into database
    const { data: application, error: insertError } = await supabase
      .from('loan_applications')
      .insert([{
        id: applicationId,
        full_name: fullName,
        email: email,
        phone: phone,
        whatsapp: whatsapp || phone,
        loan_type: loanType,
        loan_amount: parseFloat(loanAmount),
        employment_type: employmentType,
        monthly_income: monthlyIncome ? parseFloat(monthlyIncome) : null,
        city: city,
        state: state,
        pincode: pincode,
        pan_card_url: uploadedFiles.panCard || null,
        aadhar_card_url: uploadedFiles.aadharCard || null,
        itr_url: uploadedFiles.itr || null,
        bank_statement_url: uploadedFiles.bankStatement || null,
        status: 'pending',
        created_at: new Date().toISOString()
      }])
      .select();

    if (insertError) {
      console.error('Database insert error:', insertError);
      return res.status(500).json({
        error: 'Failed to submit application',
        details: insertError.message
      });
    }

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully! Our team will contact you within 24 hours.',
      applicationId: applicationId,
      data: application[0]
    });

  } catch (error) {
    console.error('Application submission error:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
});

// Get application status by ID
app.get('/api/applications/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('loan_applications')
      .select('id, full_name, loan_type, loan_amount, status, created_at')
      .eq('id', id)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.json(data);
  } catch (error) {
    console.error('Error fetching application:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all applications (admin endpoint - add authentication in production)
app.get('/api/admin/applications', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('loan_applications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json(data);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update application status (admin endpoint)
app.patch('/api/admin/applications/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const { data, error } = await supabase
      .from('loan_applications')
      .update({
        status: status,
        admin_notes: notes,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json(data[0]);
  } catch (error) {
    console.error('Error updating application:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File size too large. Maximum 10MB allowed.' });
    }
    return res.status(400).json({ error: err.message });
  }
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
