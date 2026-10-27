// lib/emailService.ts
import { Resend } from 'resend';

// Check if API key exists
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Madan Church <onboarding@resend.dev>';

console.log('📧 Email Service Loaded');
console.log('📧 API Key exists:', !!RESEND_API_KEY);
console.log('📧 From Email:', RESEND_FROM_EMAIL);

// Only create Resend instance if API key is present
const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

interface EmailData {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async (emailData: EmailData) => {
  console.log('📧 sendEmail called with:', emailData.to);
  
  // If no Resend client, log and return success (for development)
  if (!resend) {
    console.log('📧 [DEV MODE] Email would be sent:');
    console.log('   To:', emailData.to);
    console.log('   Subject:', emailData.subject);
    console.log('   HTML Preview:', emailData.html.substring(0, 200) + '...');
    return { success: true, mock: true, note: 'DEV MODE - Email not actually sent' };
  }

  try {
    console.log('📧 Attempting to send real email to:', emailData.to);
    const { data, error } = await resend.emails.send({
      from: RESEND_FROM_EMAIL,
      to: [emailData.to],
      subject: emailData.subject,
      html: emailData.html,
    });

    if (error) {
      console.error('❌ Resend error:', error);
      throw error;
    }
    console.log('✅ Email sent successfully:', data);
    return data;
  } catch (error) {
    console.error('❌ Error sending email:', error);
    throw error;
  }
};

export const sendApprovalEmail = async (user: any) => {
  console.log('📧 Preparing approval email for:', user.email);
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #f97316, #ea580c); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
        .credentials { background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #f97316; margin: 20px 0; }
        .credentials p { margin: 8px 0; }
        .button { display: inline-block; background: #f97316; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; margin-top: 20px; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🎉 Welcome to Madan Church!</h1>
        <p>Your membership has been approved</p>
      </div>
      <div class="content">
        <h2>Dear ${user.full_name},</h2>
        <p>We are delighted to inform you that your membership application to Madan Church has been <strong>approved</strong>!</p>
        
        <p>You can now access the Members Panel using the credentials you provided during registration:</p>
        
        <div class="credentials">
          <p><strong>👤 Username:</strong> ${user.username}</p>
          <p><strong>🔑 Password:</strong> ${user.password || 'The password you created during registration'}</p>
        </div>
        
        <p><strong>📝 Important:</strong> If you've forgotten your password,You have to notify us,And you have to Sign up again to get another approval</p>
        
        <div style="text-align: center;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/login" class="button">Access Members Panel</a>
        </div>
        
        <p style="margin-top: 20px;">We look forward to seeing you at our services and events.<br> God bless you</p>
        
        <p><strong>Madan Church Administration</strong></p>
      </div>
      <div class="footer">
        <p>© ${new Date().getFullYear()} Madan Church. All rights reserved.</p>
        <p>This is an automated message, please do not reply.</p>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: user.email,
    subject: 'Welcome to Madan Church - Membership Approved!',
    html,
  });
};

export const sendRejectionEmail = async (user: any) => {
  console.log('📧 Preparing rejection email for:', user.email);
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #dc2626, #b91c1c); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
        .reasons { background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #dc2626; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        .button { display: inline-block; background: #dc2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Membership Application Update</h1>
      </div>
      <div class="content">
        <h2>Dear ${user.full_name},</h2>
        <p>Thank you for your interest in becoming a member of Madan Church.</p>
        
        <p>After careful review of your application, we regret to inform you that your membership request has been <strong style="color: #dc2626;">declined</strong> at this time.</p>
        
        <div class="reasons">
          <p><strong>📋 Common reasons for declining:</strong></p>
          <ul>
            <li>Incomplete or missing information</li>
            <li>Unable to verify provided details</li>
            <li>Does not meet membership requirements</li>
          </ul>
          <p style="margin-top: 10px;">If you believe this is an error or would like to reapply, please contact us directly.</p>
        </div>
        
        <div style="text-align: center;">
          <a href="mailto:${process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@madanchurch.com'}" class="button">Contact Administration</a>
        </div>
        
        <p style="margin-top: 20px;">We wish you all the best and hope you continue to be part of our community in other ways.</p>
        
        <p><strong>Madan Church Administration</strong></p>
      </div>
      <div class="footer">
        <p>© ${new Date().getFullYear()} Madan Church. All rights reserved.</p>
        <p>This is an automated message, please do not reply.</p>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: user.email,
    subject: 'Update on Your Madan Church Membership Application',
    html,
  });
};