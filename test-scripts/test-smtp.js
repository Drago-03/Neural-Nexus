#!/usr/bin/env node

/**
 * Neural Nexus SMTP Test Script
 * 
 * This script tests the SMTP connection and sends a test email.
 * Usage: node scripts/test-smtp.js [recipient-email]
 */

// Load environment variables from .env files
require('dotenv').config();

// Create a simple version of the EmailService for testing
const EmailService = {
  async verifyConnection() {
    console.log('📧 Testing SMTP connection...');
    
    // Check if we have SMTP credentials
    const host = process.env.EMAIL_SERVER_HOST;
    const user = process.env.EMAIL_SERVER_USER;
    const pass = process.env.EMAIL_SERVER_PASSWORD || process.env.SENDGRID_API_KEY;
    
    if (!host || !user || !pass) {
      console.warn('⚠️ Missing SMTP configuration. Using local transport.');
      return false;
    }
    
    try {
      // Create a transporter using SMTP
      const nodemailer = require('nodemailer');
      const transporter = nodemailer.createTransport({
        host: host,
        port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
        secure: (process.env.EMAIL_SERVER_PORT || '587') === '465', // true for 465, false for other ports
        auth: {
          user: user,
          pass: pass
        }
      });
      
      // Verify connection
      await transporter.verify();
      return true;
    } catch (error) {
      console.error('❌ SMTP verification failed:', error);
      return false;
    }
  },
  
  async sendEmail(options) {
    try {
      const nodemailer = require('nodemailer');
      const host = process.env.EMAIL_SERVER_HOST;
      const user = process.env.EMAIL_SERVER_USER;
      const pass = process.env.EMAIL_SERVER_PASSWORD || process.env.SENDGRID_API_KEY;
      
      if (!host || !user || !pass) {
        console.log('📧 Email would be sent with the following details (LOCAL MODE):');
        console.log(`To: ${options.to}`);
        console.log(`From: ${options.from || process.env.EMAIL_FROM || 'noreply@neural-nexus.com'}`);
        console.log(`Subject: ${options.subject}`);
        console.log(`HTML: ${options.html?.substring(0, 100)}...`);
        return true;
      }
      
      const transporter = nodemailer.createTransport({
        host: host,
        port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
        secure: (process.env.EMAIL_SERVER_PORT || '587') === '465', // true for 465, false for other ports
        auth: {
          user: user,
          pass: pass
        }
      });
      
      const msg = {
        to: options.to,
        from: options.from || process.env.EMAIL_FROM || 'noreply@neural-nexus.com',
        subject: options.subject,
        text: options.text || '',
        html: options.html || '',
      };
      
      const info = await transporter.sendMail(msg);
      console.log(`Email sent to ${options.to} successfully! 🚀 Message ID: ${info.messageId}`);
      return true;
    } catch (error) {
      console.error('Failed to send email:', error);
      
      // Log the email in case of error
      console.log('📧 Email would have been sent with the following details:');
      console.log(`To: ${options.to}`);
      console.log(`From: ${options.from || process.env.EMAIL_FROM || 'noreply@neural-nexus.com'}`);
      console.log(`Subject: ${options.subject}`);
      
      return false;
    }
  },
  
  getStatus() {
    const host = process.env.EMAIL_SERVER_HOST;
    const user = process.env.EMAIL_SERVER_USER;
    const pass = process.env.EMAIL_SERVER_PASSWORD || process.env.SENDGRID_API_KEY;
    
    return {
      initialized: !!(host && user && pass),
      transportType: (host && user && pass) ? 'smtp' : 'local',
      error: null
    };
  }
};

async function main() {
  try {
    const recipient = process.argv[2] || 'test@example.com';
    
    console.log('🧪 Testing Neural Nexus Email Service');
    console.log('------------------------------------');
    console.log('SMTP Configuration:');
    console.log(`Host: ${process.env.EMAIL_SERVER_HOST || 'not configured'}`);
    console.log(`Port: ${process.env.EMAIL_SERVER_PORT || 'not configured'}`);
    console.log(`User: ${process.env.EMAIL_SERVER_USER || 'not configured'}`);
    console.log(`From: ${process.env.EMAIL_FROM || 'not configured'}`);
    console.log('------------------------------------');
    
    // Step 1: Verify SMTP connection
    console.log('Step 1: Verifying SMTP connection...');
    const isConnected = await EmailService.verifyConnection();
    
    if (isConnected) {
      console.log('✅ SMTP connection verified successfully!');
    } else {
      const status = EmailService.getStatus();
      console.error('❌ SMTP connection failed!');
      if (status.error) {
        console.error(`Error: ${status.error}`);
      }
      console.log(`Using transport type: ${status.transportType}`);
    }
    
    // Step 2: Send a test email
    console.log(`\nStep 2: Sending a test email to ${recipient}...`);
    
    const result = await EmailService.sendEmail({
      to: recipient,
      subject: '🧪 Neural Nexus Email Test',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #8B5CF6;">Email Test Successful! 🎉</h1>
          <p style="font-size: 16px; line-height: 1.5;">
            If you're seeing this, the Neural Nexus email service is working properly!
          </p>
          <p style="font-size: 16px; line-height: 1.5;">
            Transport type: ${EmailService.getStatus().transportType}
          </p>
          <div style="background: linear-gradient(to right, #8B5CF6, #EC4899); height: 4px; margin: 20px 0;"></div>
          <p style="font-size: 14px; color: #666;">
            Stay vibin',<br>
            The Neural Nexus Squad
          </p>
        </div>
      `
    });
    
    if (result) {
      console.log('✅ Test email sent successfully!');
    } else {
      console.error('❌ Failed to send test email!');
    }
    
    // Final status
    const finalStatus = EmailService.getStatus();
    console.log('\nFinal Email Service Status:');
    console.log(`Initialized: ${finalStatus.initialized}`);
    console.log(`Transport Type: ${finalStatus.transportType}`);
    console.log(`Error: ${finalStatus.error || 'None'}`);
    
    if (finalStatus.transportType === 'local') {
      console.log('\n⚠️ Using local transport - emails are being logged to console only!');
      console.log('To use SMTP, check your environment variables and credentials.');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed with error:', error);
    process.exit(1);
  }
}

main(); 