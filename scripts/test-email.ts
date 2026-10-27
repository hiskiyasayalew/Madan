// scripts/test-email.ts
import { sendApprovalEmail } from '../src/app/lib/emailService';

async function testEmail() {
  try {
    console.log('🧪 Testing email service...');
    console.log('📧 RESEND_API_KEY exists?', !!process.env.RESEND_API_KEY);
    console.log('📧 RESEND_FROM_EMAIL:', process.env.RESEND_FROM_EMAIL);
    
    const testUser = {
      full_name: 'Test User',
      email: 'your-email@gmail.com', // Replace with your email
      username: 'testuser',
      password: 'testpassword123'
    };

    console.log('📧 Sending test email to:', testUser.email);
    await sendApprovalEmail(testUser);
    console.log('✅ Test email sent successfully!');
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testEmail();