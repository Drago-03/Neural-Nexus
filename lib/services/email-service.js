/**
 * Neural Nexus Email Service using SendGrid (CommonJS version for testing)
 * 
 * This module handles sending emails with SendGrid's API with a Gen-Z vibe.
 */

let sgMail;
try {
  sgMail = require('@sendgrid/mail');
} catch (error) {
  console.warn('SendGrid package not found. Email functionality will be limited.');
  sgMail = {
    setApiKey: () => {},
    send: () => Promise.resolve()
  };
}

// Initialize SendGrid with API key
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

/**
 * Email Service
 */
class EmailService {
  // Default sender email address - MUST be verified in SendGrid
  static DEFAULT_FROM = process.env.EMAIL_FROM || 'noreply@neural-nexus.com';
  static initialized = !!process.env.SENDGRID_API_KEY;
  
  /**
   * Sends an email using SendGrid
   */
  static async yeetEmail(options) {
    try {
      if (!this.initialized) {
        console.error("SendGrid API key not found! Can't send emails rn 😭");
        return false;
      }
      
      // In development, log the email instead of sending it
      if (process.env.NODE_ENV === 'development') {
        console.log('📧 DEVELOPMENT MODE: Email would be sent with the following details:');
        console.log(`To: ${options.to}`);
        console.log(`From: ${options.from || this.DEFAULT_FROM}`);
        console.log(`Subject: ${options.subject}`);
        console.log(`Body: ${options.text || options.html}`);
        return true;
      }
      
      const msg = {
        to: options.to,
        from: options.from || this.DEFAULT_FROM,
        subject: options.subject,
        text: options.text || '',
        html: options.html || '',
      };
      
      await sgMail.send(msg);
      console.log(`Email yeeted to ${options.to} successfully! 🚀`);
      return true;
    } catch (error) {
      console.error('Failed to yeet email:', error);
      
      // Log SendGrid-specific errors
      if (error.response && error.response.body && error.response.body.errors) {
        console.error('SendGrid errors:', error.response.body.errors);
      }
      
      return false;
    }
  }
  
  /**
   * Sends a profile update notification email
   */
  static async sendProfileUpdateNotification(email, name) {
    const subject = '👤 Your Neural Nexus Profile Was Updated';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #8B5CF6;">Profile Updated Successfully!</h1>
        <p style="font-size: 16px; line-height: 1.5;">
          Hey ${name}! Just letting you know that your Neural Nexus profile was updated successfully.
        </p>
        <p style="font-size: 16px; line-height: 1.5;">
          If you didn't make these changes, please contact our support team immediately.
        </p>
        <div style="background: linear-gradient(to right, #8B5CF6, #EC4899); height: 4px; margin: 20px 0;"></div>
        <p style="font-size: 14px; color: #666;">
          Stay amazing,<br>
          The Neural Nexus Squad
        </p>
      </div>
    `;
    
    return this.yeetEmail({
      to: email,
      subject,
      html
    });
  }
  
  /**
   * Send an email
   */
  static async sendEmail(message) {
    if (!this.initialized) {
      console.warn('Email service not initialized: missing SendGrid API key');
      return false;
    }
    
    try {
      const emailMessage = {
        to: message.to,
        from: message.from || this.DEFAULT_FROM,
        subject: message.subject,
        text: message.text || this.stripHtml(message.html),
        html: message.html
      };
      
      // In development, log the email instead of sending it
      if (process.env.NODE_ENV === 'development') {
        console.log('📧 DEVELOPMENT MODE: Email would be sent with the following details:');
        console.log(`To: ${emailMessage.to}`);
        console.log(`From: ${emailMessage.from}`);
        console.log(`Subject: ${emailMessage.subject}`);
        console.log(`Body: ${emailMessage.text}`);
        return true;
      }
      
      await sgMail.send(emailMessage);
      console.log(`Email sent to ${message.to}`);
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }
  
  /**
   * Strip HTML tags from a string
   */
  static stripHtml(html) {
    return html.replace(/<[^>]*>/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }
}

module.exports = { EmailService }; 