import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const fullName = formData.get('fullName') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const whatsapp = formData.get('whatsapp') as string || phone;
    const loanType = formData.get('loanType') as string;
    const loanAmount = formData.get('loanAmount') as string;
    const employmentType = formData.get('employmentType') as string;
    const monthlyIncome = formData.get('monthlyIncome') as string;
    const city = formData.get('city') as string;
    const state = formData.get('state') as string;
    const pincode = formData.get('pincode') as string;

    // Validate required fields
    if (!fullName || !email || !phone || !loanType || !loanAmount) {
      return NextResponse.json({
        error: 'Missing required fields',
        details: 'Please provide fullName, email, phone, loanType, and loanAmount'
      }, { status: 400 });
    }

    const applicationId = crypto.randomUUID();
    const uploadedFiles: Record<string, string | null> = {};

    // Handle file uploads
    const fileFields = ['panCard', 'aadharCard', 'itr', 'bankStatement'];

    for (const fieldName of fileFields) {
      const file = formData.get(fieldName) as File | null;
      if (file && file.size > 0) {
        const buffer = await file.arrayBuffer();
        const fileName = `${applicationId}/${fieldName}_${Date.now()}.${file.name.split('.').pop()}`;

        const { error } = await supabase.storage
          .from('documents')
          .upload(fileName, buffer, {
            contentType: file.type,
            upsert: false
          });

        if (error) {
          console.error(`Error uploading ${fieldName}:`, error);
          uploadedFiles[fieldName] = null;
        } else {
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
        whatsapp: whatsapp,
        loan_type: loanType,
        loan_amount: parseFloat(loanAmount),
        employment_type: employmentType || null,
        monthly_income: monthlyIncome ? parseFloat(monthlyIncome) : null,
        city: city || null,
        state: state || null,
        pincode: pincode || null,
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
      return NextResponse.json({
        error: 'Failed to submit application',
        details: insertError.message
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Application submitted successfully! Our team will contact you within 24 hours.',
      applicationId: applicationId,
      data: application?.[0]
    }, { status: 201 });

  } catch (error) {
    console.error('Application submission error:', error);
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (id) {
    const { data, error } = await supabase
      .from('loan_applications')
      .select('id, full_name, loan_type, loan_amount, status, created_at')
      .eq('id', id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    return NextResponse.json(data);
  }

  // Return all applications (admin)
  const { data, error } = await supabase
    .from('loan_applications')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
