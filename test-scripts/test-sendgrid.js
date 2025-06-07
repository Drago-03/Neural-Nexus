/**
 * Neural Nexus SendGrid Test Script
 * 
 * This script tests the SendGrid email integration.
 * Run with: node test-sendgrid.js your.email@example.com
 */

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

// Force development mode
process.env.NODE_ENV = 'development';

const sgMail = require('@sendgrid/mail');

// Check if API key is available
if (!process.env.SENDGRID_API_KEY) {
  console.error('❌ SendGrid API key not found in environment variables!');
  console.error('Make sure SENDGRID_API_KEY is set in your .env.local file');
  process.exit(1);
}

// Set API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Get email from command line args
const testEmail = process.argv[2];

if (!testEmail) {
  console.error('❌ No test email provided!');
  console.error('Usage: node test-sendgrid.js your.email@example.com');
  process.exit(1);
}

console.log(`🚀 Testing SendGrid email service with ${testEmail}`);
console.log('🔧 Running in DEVELOPMENT mode - emails will be logged but not sent');

// Create test email
const msg = {
  to: testEmail,
  from: process.env.EMAIL_FROM || 'noreply@neuralnexus.biz',
  subject: '🧪 Neural Nexus SendGrid Test',
  text: 'If you can read this, SendGrid is working properly!',
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #8B5CF6;">SendGrid Test Successful! 🎉</h1>
      <p style="font-size: 16px; line-height: 1.5;">
        If you're seeing this email, then your SendGrid integration is working perfectly!
      </p>
      <div style="background: linear-gradient(to right, #8B5CF6, #EC4899); height: 4px; margin: 20px 0;"></div>
      <p style="font-size: 14px; color: #666;">
        Stay awesome,<br>
        The Neural Nexus Squad
      </p>
    </div>
  `
};

// In development mode, just log the email
console.log('📧 DEVELOPMENT MODE: Email would be sent with the following details:');
console.log(`To: ${msg.to}`);
console.log(`From: ${msg.from}`);
console.log(`Subject: ${msg.subject}`);
console.log(`Body: ${msg.html}`);
console.log('\n✅ Test completed successfully!');

// In production mode, this would send the email
if (process.env.NODE_ENV !== 'development') {
  // Send the email
  sgMail
    .send(msg)
    .then(() => {
      console.log('✅ Test email sent successfully!');
      console.log(`📧 Check ${testEmail} for the test message`);
    })
    .catch((error) => {
      console.error('❌ Error sending test email:');
      console.error(error);
      
      if (error.response) {
        console.error('SendGrid API response:');
        console.error(error.response.body);
      }
    });
} 