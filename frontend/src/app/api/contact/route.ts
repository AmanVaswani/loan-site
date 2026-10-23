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

    // Send email using SendPulse or standard SMTP / Gmail
    const smtpHost = process.env.SMTP_HOST || 'smtp-pulse.com';
    const smtpPort = parseInt(process.env.SMTP_PORT || '465', 10);
    const smtpUser = process.env.SMTP_USER || process.env.GMAIL_USER;
    const smtpPass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD;
    const notifyEmail = process.env.NOTIFICATION_EMAIL || 'loankibaat.jbp@gmail.com';
    const fromEmail = process.env.SMTP_FROM || smtpUser;

    if (!smtpUser || !smtpPass) {
      console.log('Lead saved. SMTP credentials not configured, skipping email notification.');
      return NextResponse.json({
        success: true,
        message: 'Request received! We will contact you soon.',
        emailSent: false
      });
    }

    // Create transporter (supports SendPulse, Gmail, or any custom SMTP)
    const transporter = process.env.GMAIL_USER && !process.env.SMTP_USER
      ? nodemailer.createTransport({
          service: 'gmail',
          auth: { user: smtpUser, pass: smtpPass }
        })
      : nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort,
          secure: smtpPort === 465, // true for 465, false for 587
          auth: { user: smtpUser, pass: smtpPass }
        });

    // Email content with Ledger House branding
    const mailOptions = {
      from: `"Loan ki Baat" <${fromEmail}>`,
      to: notifyEmail,
      replyTo: email || undefined,
      subject: `🔔 New Loan Callback Request: ${name} (${phone})`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #FCF9F1; border: 1px solid rgba(14,74,44,0.18); border-radius: 12px; overflow: hidden;">
          <div style="background: #062015; padding: 24px 28px; border-bottom: 3px solid #C8942E;">
            <div style="color: #C8942E; font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; margin-bottom: 6px; font-weight: 600;">Loan ki Baat · New Inquiry</div>
            <h1 style="color: #FFFDF5; margin: 0; font-size: 22px; font-weight: 600;">Callback Request Received</h1>
          </div>
          <div style="padding: 28px;">
            <table style="width: 100%; border-collapse: collapse; font-size: 14.5px;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid rgba(14,74,44,0.1); color: #5E7266; width: 140px; font-weight: 600;">Applicant Name:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid rgba(14,74,44,0.1); color: #062015; font-weight: 600;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid rgba(14,74,44,0.1); color: #5E7266; font-weight: 600;">Phone Number:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid rgba(14,74,44,0.1); color: #0E4A2C; font-weight: 700;">
                  <a href="tel:${phone}" style="color: #0E4A2C; text-decoration: none;">${phone}</a>
                </td>
              </tr>
              ${email ? `
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid rgba(14,74,44,0.1); color: #5E7266; font-weight: 600;">Email:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid rgba(14,74,44,0.1); color: #062015;">
                  <a href="mailto:${email}" style="color: #062015;">${email}</a>
                </td>
              </tr>` : ''}
              ${loanType ? `
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid rgba(14,74,44,0.1); color: #5E7266; font-weight: 600;">Loan Type:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid rgba(14,74,44,0.1); color: #062015;">${loanType}</td>
              </tr>` : ''}
              ${loanAmount ? `
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid rgba(14,74,44,0.1); color: #5E7266; font-weight: 600;">Requested Amount:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid rgba(14,74,44,0.1); color: #8A6118; font-weight: 600;">${loanAmount}</td>
              </tr>` : ''}
              ${city ? `
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid rgba(14,74,44,0.1); color: #5E7266; font-weight: 600;">City:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid rgba(14,74,44,0.1); color: #062015;">${city}</td>
              </tr>` : ''}
              <tr>
                <td style="padding: 10px 0; color: #5E7266; font-weight: 600; vertical-align: top;">Notes / Message:</td>
                <td style="padding: 10px 0; color: #062015; line-height: 1.6;">${message || 'Standard quote enquiry / callback request.'}</td>
              </tr>
            </table>

            <div style="margin-top: 24px; padding: 16px; background: #E6F0E7; border-radius: 8px; border-left: 4px solid #0E4A2C;">
              <p style="margin: 0; font-size: 13.5px; color: #0E4A2C; font-weight: 500;">
                ⚡ <strong>Instant Contact:</strong>
                <a href="tel:${phone}" style="color: #0E4A2C; margin-left: 10px; text-decoration: underline;">📞 Call ${phone}</a> | 
                <a href="https://wa.me/91${phone.replace(/[^0-9]/g, '').slice(-10)}" style="color: #0E4A2C; margin-left: 6px; text-decoration: underline;">💬 WhatsApp</a>
              </p>
            </div>
          </div>
          <div style="background: #F5F0E4; padding: 12px 28px; text-align: center; color: #8A9A91; font-size: 11.5px; border-top: 1px solid rgba(14,74,44,0.1);">
            Loan ki Baat · Jabalpur · Automated Lead Dispatch
          </div>
        </div>
      `,
      text: `
New Lead - Loan ki Baat
Name: ${name}
Phone: ${phone}
Email: ${email || 'N/A'}
Loan Type: ${loanType || 'N/A'}
Amount: ${loanAmount || 'N/A'}
City: ${city || 'N/A'}
Message: ${message || 'N/A'}
      `.trim()
    };
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
