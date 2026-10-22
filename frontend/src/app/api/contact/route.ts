import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabase: SupabaseClient | null = null;
function getSupabaseClient() {
  if (!supabase) {
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || '';
    if (supabaseUrl && supabaseServiceKey) {
      supabase = createClient(supabaseUrl, supabaseServiceKey);
    }
  }
  return supabase;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, email, message, loanType, loanAmount, city, employmentType } = body;

    // Validate required fields
    if (!name || !phone) {
      return NextResponse.json({
        error: 'Missing required fields',
        details: 'Please provide name and phone'
      }, { status: 400 });
    }

    // Always attempt to save lead into Supabase
    try {
      const client = getSupabaseClient();
      if (client) {
        // Parse numerical amount if provided
        let numAmount = 0;
        if (loanAmount) {
          const match = String(loanAmount).match(/\d+/);
          if (match) numAmount = parseFloat(match[0]) * 100000;
        }

        await client.from('loan_applications').insert([{
          full_name: name,
          phone: phone,
          email: email || 'lead@loankibaat.in',
          loan_type: loanType || 'General Inquiry',
          loan_amount: numAmount || 100000,
          city: city || null,
          employment_type: employmentType || null,
          admin_notes: message ? `Callback Request Message: ${message}` : 'Quote / Callback Request from Website Form',
          status: 'pending',
          created_at: new Date().toISOString()
        }]);
      }
    } catch (dbErr) {
      console.error('Failed to save callback to database:', dbErr);
    }

    // Send email using Gmail SMTP if configured
    const gmailUser = process.env.GMAIL_USER;
    const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;

    if (!gmailUser || !gmailAppPassword) {
      console.log('Lead saved. Gmail credentials not configured, skipping SMTP notification.');
      return NextResponse.json({
        success: true,
        message: 'Request received! We will contact you soon.',
        emailSent: false
      });
    }

    // Create transporter using Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailAppPassword,
      },
    });

    // Email content
    const mailOptions = {
      from: `LoanEase Website <${gmailUser}>`,
      to: 'amanvaswani4@gmail.com',
      subject: `🔔 New Callback Request from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">New Contact Request</h1>
          </div>
          <div style="background: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 10px 10px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; width: 120px;">Name:</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Phone:</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">
                  <a href="tel:${phone}" style="color: #667eea;">${phone}</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">WhatsApp:</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">
                  <a href="https://wa.me/91${phone}" style="color: #25D366;">Click to WhatsApp</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 10px; font-weight: bold; vertical-align: top;">Message:</td>
                <td style="padding: 10px;">${message || 'No message provided'}</td>
              </tr>
            </table>
            <div style="margin-top: 20px; padding: 15px; background: #e8f5e9; border-radius: 5px;">
              <p style="margin: 0; color: #2e7d32;">
                <strong>Quick Actions:</strong><br>
                📞 <a href="tel:${phone}">Call Now</a> |
                💬 <a href="https://wa.me/91${phone}">WhatsApp</a>
              </p>
            </div>
          </div>
          <p style="text-align: center; color: #999; font-size: 12px; margin-top: 20px;">
            This is an automated email from your LoanEase website.
          </p>
        </div>
      `,
      text: `
New Contact Request from LoanEase Website

Name: ${name}
Phone: ${phone}
Message: ${message || 'No message provided'}

---
This is an automated email from your LoanEase website.
      `.trim(),
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({
      success: true,
      message: 'Thank you! We will contact you soon.',
      emailSent: true
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
