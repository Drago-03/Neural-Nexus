/**
 * Neural Nexus Email Service
 * 
 * This module handles sending emails with multiple transport options:
 * 1. SMTP (production default)
 * 2. Local development transport (logs emails to console)
 * 
 * SMTP Configuration:
 * Server: smtp.sendgrid.net (or your preferred SMTP server)
 * Ports: 25, 587 (for unencrypted/TLS), 465 (for SSL)
 * Username: apikey (for SendGrid) or your SMTP username
 * Password: Your SendGrid API Key or SMTP password
 */

import nodemailer from 'nodemailer';
// Removed imports from email-template

// Email interface
export interface EmailMessage {
  to: string;
  from?: string;
  subject: string;
  text?: string;
  html: string;
}

// Email service status
export interface EmailServiceStatus {
  initialized: boolean;
  transportType: 'smtp' | 'local' | 'none';
  error: string | null;
}

/**
 * Simple template generators
 */
function generateWelcomeEmail(name: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Welcome to Neural Nexus</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #6200ea;">Welcome to Neural Nexus!</h1>
      <p>Hey ${name}, welcome to the crew! 🔥</p>
      <p>We're stoked to have you join our AI community. Get ready for some fire content!</p>
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 0.9em; color: #666;">
        <p>Stay lit,<br>The Neural Nexus Squad</p>
      </div>
    </body>
    </html>
  `;
}

function generatePasswordResetEmail(resetLink: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Reset Your Password</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #6200ea;">Reset Your Password</h1>
      <p>Yo! You asked to reset your password. No worries, we got you!</p>
      <p>Click the link below to set a new password:</p>
      <p><a href="${resetLink}" style="display: inline-block; background: linear-gradient(to right, #8B5CF6, #EC4899); color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Reset Password</a></p>
      <p>If you didn't request this, just ignore this email and your password will stay the same.</p>
    </body>
    </html>
  `;
}

function generateVerificationEmail(verificationLink: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Verify Your Email</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #6200ea;">Verify Your Email</h1>
      <p>Almost there! Just click the link below to verify your email:</p>
      <p><a href="${verificationLink}" style="display: inline-block; background: linear-gradient(to right, #8B5CF6, #EC4899); color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Verify Email</a></p>
      <p>If you didn't create an account with us, you can safely ignore this email.</p>
    </body>
    </html>
  `;
}

function generateTestEmail(): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Test Email</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #6200ea;">Neural Nexus Test Email</h1>
      <p>Yo! This is just a test email from Neural Nexus!</p>
      <p>If you're seeing this, our email system is vibin' correctly!</p>
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 0.9em; color: #666;">
        <p>This is an automated message - please don't reply to this email.</p>
      </div>
    </body>
    </html>
  `;
}

/**
 * Email Service
 */
export class EmailService {
  // Default sender email address
  private static readonly DEFAULT_FROM = process.env.EMAIL_FROM || 'noreply@neural-nexus.com';
  private static transporter: nodemailer.Transporter | null = null;
  private static initialized = false;
  private static initializationAttempted = false;
  private static authError: Error | null = null;
  private static transportType: 'smtp' | 'local' | 'none' = 'none';
  
  /**
   * Initialize the email service
   */
  private static initTransporter() {
    if (this.initialized || this.initializationAttempted) return;
    
    try {
      this.initializationAttempted = true;
      
      // Check if we're in development mode and not forcing email sending
      if (process.env.NODE_ENV === 'development' && !process.env.FORCE_EMAIL_SEND) {
        console.log('📧 Development mode: Using local email transport');
        this.setupLocalTransport();
        return;
      }
      
      // Check if we have SMTP credentials
      const host = process.env.EMAIL_SERVER_HOST;
      const user = process.env.EMAIL_SERVER_USER;
      const pass = process.env.EMAIL_SERVER_PASSWORD || process.env.SENDGRID_API_KEY;
      
      if (!host || !user || !pass) {
        console.warn('⚠️ Missing SMTP configuration. Falling back to local transport.');
        // In production, log a more serious warning
        if (process.env.NODE_ENV === 'production') {
          console.error('❌ CRITICAL: Missing SMTP configuration in production!');
        }
        this.setupLocalTransport();
        return;
      }
      
      // Create a transporter using SMTP
      this.transporter = nodemailer.createTransport({
        host: host,
        port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
        secure: (process.env.EMAIL_SERVER_PORT || '587') === '465', // true for 465, false for other ports
        auth: {
          user: user,
          pass: pass
        },
        // Add connection timeout settings
        connectionTimeout: 10000, // 10 seconds
        greetingTimeout: 10000,  // 10 seconds
        socketTimeout: 15000     // 15 seconds
      });
      
      this.initialized = true;
      this.transportType = 'smtp';
      console.log('📧 Email service initialized with SMTP transport');
      
      // Verify connection immediately in production
      if (process.env.NODE_ENV === 'production') {
        this.verifyConnection().then(isConnected => {
          if (!isConnected) {
            console.error('❌ CRITICAL: SMTP verification failed in production!');
          } else {
            console.log('✅ SMTP connection verified successfully');
          }
        });
      }
    } catch (error: any) {
      console.error('❌ Failed to initialize SMTP transport:', error);
      this.authError = error;
      
      // In production, log a more serious warning
      if (process.env.NODE_ENV === 'production') {
        console.error('❌ CRITICAL: Email service initialization failed in production!');
        console.error('Error details:', error.message);
      }
      
      this.setupLocalTransport();
    }
  }
  
  /**
   * Set up a local development transport
   */
  private static setupLocalTransport() {
    try {
      // Create a simple development transport that logs emails
      const devTransport = {
        name: 'dev',
        version: '1.0.0',
        // Define a simple sendMail function that logs the email
        sendMail: (mailOptions: any, callback: any) => {
          console.log('📧 LOCAL EMAIL TRANSPORT:');
          console.log('------------------------');
          console.log('To:', mailOptions.to);
          console.log('From:', mailOptions.from);
          console.log('Subject:', mailOptions.subject);
          console.log('Text:', mailOptions.text);
          console.log('HTML:', mailOptions.html?.substring(0, 100) + '...');
          console.log('------------------------');
          
          // Create a minimal response object
          const info = {
            messageId: 'LOCAL-' + Date.now(),
            envelope: {
              from: mailOptions.from,
              to: [mailOptions.to]
            },
            accepted: [mailOptions.to],
            rejected: [],
            pending: [],
            response: 'OK'
          };
          
          // Simulate async behavior
          setTimeout(() => {
            callback(null, info);
          }, 100);
          
          return { 
            messageId: info.messageId 
          };
        }
      };
      
      // @ts-ignore - Ignore type checking for our custom transport
      this.transporter = devTransport;
      
      this.initialized = true;
      this.transportType = 'local';
      console.log('📧 Email service initialized with local transport');
    } catch (error) {
      console.error('❌ Failed to initialize local transport:', error);
      this.transporter = null;
      this.transportType = 'none';
    }
  }
  
  /**
   * Verify SMTP connection
   */
  static async verifyConnection(): Promise<boolean> {
    try {
      // Initialize transporter if needed
      if (!this.initialized && !this.initializationAttempted) {
        this.initTransporter();
      }
      
      if (!this.transporter) {
        return false;
      }
      
      // For local transport, always return true
      if (this.transportType === 'local') {
        return true;
      }
      
      // For SMTP, verify the connection
      await this.transporter.verify();
      return true;
    } catch (error) {
      console.error('❌ SMTP verification failed:', error);
      this.authError = error as Error;
      
      // If SMTP verification fails, fall back to local transport
      if (this.transportType === 'smtp') {
        console.log('⚠️ Falling back to local transport due to SMTP verification failure');
        this.setupLocalTransport();
      }
      
      return false;
    }
  }
  
  /**
   * Sends an email
   */
  static async yeetEmail(options: EmailMessage): Promise<boolean> {
    try {
      // Initialize transporter if needed
      if (!this.initialized && !this.initializationAttempted) {
        this.initTransporter();
      }
      
      const msg = {
        to: options.to,
        from: options.from || this.DEFAULT_FROM,
        subject: options.subject,
        text: options.text || '',
        html: options.html || '',
      };
      
      // If no transporter, log the email and return
      if (!this.transporter) {
        console.log('📧 Email would be sent with the following details:');
        console.log(`To: ${options.to}`);
        console.log(`From: ${options.from || this.DEFAULT_FROM}`);
        console.log(`Subject: ${options.subject}`);
        console.log(`Body: ${options.text || options.html}`);
        console.warn('⚠️ No email transport configured');
        
        // In production, this is a critical error
        if (process.env.NODE_ENV === 'production') {
          console.error('❌ CRITICAL: Attempted to send email in production with no transport configured!');
        }
        
        return false;
      }
      
      // Add timeout for sending email
      const sendPromise = this.transporter.sendMail(msg);
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Email sending timed out after 30 seconds')), 30000);
      });
      
      // Send email with timeout
      const info = await Promise.race([sendPromise, timeoutPromise]) as any;
      
      // Log differently based on transport type
      if (this.transportType === 'smtp') {
        console.log(`Email yeeted to ${options.to} successfully! 🚀 Message ID: ${info.messageId}`);
      } else {
        console.log(`Email logged locally for ${options.to} 📝 (Message ID: ${info.messageId})`);
      }
      
      return true;
    } catch (error: any) {
      console.error('Failed to yeet email:', error);
      
      // Store auth error for future reference
      if (error.code === 'EAUTH') {
        this.authError = error;
        console.error('Authentication error. Check your SMTP credentials.');
        
        // In production, this is a critical error
        if (process.env.NODE_ENV === 'production') {
          console.error('❌ CRITICAL: SMTP authentication failed in production!');
        }
        
        // Fall back to local transport
        if (this.transportType === 'smtp') {
          console.log('⚠️ Falling back to local transport due to authentication failure');
          this.setupLocalTransport();
          
          // Try again with local transport
          return this.yeetEmail(options);
        }
      } else if (error.code === 'ETIMEDOUT' || error.code === 'ESOCKET') {
        console.error(`Network error (${error.code}): Check your network connection and SMTP server availability.`);
        
        // In production, this is a critical error
        if (process.env.NODE_ENV === 'production') {
          console.error('❌ CRITICAL: SMTP connection error in production!');
        }
        
        // Fall back to local transport for network errors too
        if (this.transportType === 'smtp') {
          console.log('⚠️ Falling back to local transport due to network error');
          this.setupLocalTransport();
          
          // Try again with local transport
          return this.yeetEmail(options);
        }
      }
      
      // Log the email in case of error
      console.log('📧 Email would have been sent with the following details:');
      console.log(`To: ${options.to}`);
      console.log(`From: ${options.from || this.DEFAULT_FROM}`);
      console.log(`Subject: ${options.subject}`);
      
      return false;
    }
  }
  
  /**
   * Sends a welcome email to new users
   */
  static async sendWelcomeVibes(email: string, name: string): Promise<boolean> {
    const subject = '🔥 Welcome to the Neural Nexus Squad!';
    const html = generateWelcomeEmail(name);
    
    return this.yeetEmail({
      to: email,
      subject,
      html
    });
  }
  
  /**
   * Sends a password reset email
   */
  static async sendPasswordResetLink(email: string, resetLink: string): Promise<boolean> {
    const subject = '🔐 Reset Your Neural Nexus Password';
    const html = generatePasswordResetEmail(resetLink);
    
    return this.yeetEmail({
      to: email,
      subject,
      html
    });
  }
  
  /**
   * Sends an account deletion confirmation email
   */
  static async sendAccountDeletionConfirmation(email: string, confirmationLink: string): Promise<boolean> {
    const subject = '😢 Confirm Your Neural Nexus Account Deletion';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #8B5CF6;">We're Sad to See You Go</h1>
        <p style="font-size: 16px; line-height: 1.5;">
          We've received a request to delete your Neural Nexus account. If this was you, please confirm by clicking the link below:
        </p>
        <p style="text-align: center; margin: 30px 0;">
          <a href="${confirmationLink}" style="background: linear-gradient(to right, #8B5CF6, #EC4899); color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
            Confirm Account Deletion
          </a>
        </p>
        <p style="font-size: 14px; color: #666;">
          After confirmation, your account will be scheduled for deletion and permanently removed after 48 hours. 
          You can cancel the deletion by logging in during this period.
        </p>
        <div style="background: linear-gradient(to right, #8B5CF6, #EC4899); height: 4px; margin: 20px 0;"></div>
        <p style="font-size: 14px; color: #666;">
          Hope to see you again soon,<br>
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
   * Sends a verification email to confirm user's email address
   */
  static async sendVerificationVibes(email: string, verificationLink: string): Promise<boolean> {
    const subject = '✅ Verify Your Neural Nexus Email';
    const html = generateVerificationEmail(verificationLink);
    
    return this.yeetEmail({
      to: email,
      subject,
      html
    });
  }
  
  /**
   * Sends a profile update notification email
   */
  static async sendProfileUpdateNotification(email: string, name: string): Promise<boolean> {
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
  static async sendEmail(message: EmailMessage): Promise<boolean> {
    // Initialize transporter if needed
    if (!this.initialized && !this.initializationAttempted) {
      this.initTransporter();
    }
    
    try {
      const emailMessage = {
        to: message.to,
        from: message.from || this.DEFAULT_FROM,
        subject: message.subject,
        text: message.text || this.stripHtml(message.html),
        html: message.html
      };
      
      // If no transporter, log the email and return
      if (!this.transporter) {
        console.log('📧 Email would be sent with the following details:');
        console.log(`To: ${emailMessage.to}`);
        console.log(`From: ${emailMessage.from}`);
        console.log(`Subject: ${emailMessage.subject}`);
        console.log(`Body: ${emailMessage.text}`);
        console.warn('⚠️ No email transport configured');
        return false;
      }
      
      // Send email
      const info = await this.transporter.sendMail(emailMessage);
      
      // Log differently based on transport type
      if (this.transportType === 'smtp') {
        console.log(`Email sent to ${message.to} (Message ID: ${info.messageId})`);
      } else {
        console.log(`Email logged locally for ${message.to} 📝 (Message ID: ${info.messageId})`);
      }
      
      return true;
    } catch (error: any) {
      console.error('Error sending email:', error);
      
      // Store auth error for future reference
      if (error.code === 'EAUTH') {
        this.authError = error;
        console.error('Authentication error. Check your SMTP credentials.');
        
        // Fall back to local transport
        if (this.transportType === 'smtp') {
          console.log('⚠️ Falling back to local transport due to authentication failure');
          this.setupLocalTransport();
          
          // Try again with local transport
          return this.sendEmail(message);
        }
      }
      
      return false;
    }
  }
  
  /**
   * Strip HTML tags from a string
   */
  private static stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }
  
  /**
   * Get the current status of the email service
   */
  static getStatus(): EmailServiceStatus {
    return {
      initialized: this.initialized,
      transportType: this.transportType,
      error: this.authError ? this.authError.message : null
    };
  }
}

// Initialize the email service when this module is imported
// This ensures the service is ready when needed
if (typeof process !== 'undefined') {
  // Only run in Node.js environment (not during client-side rendering)
  EmailService.verifyConnection().catch(error => {
    console.warn('Email service initialization failed:', error);
  });
} 