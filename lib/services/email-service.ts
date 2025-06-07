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

/**
 * Generate a stylish password reset email template
 */
function generatePasswordResetEmail(resetLink: string): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your Password - Neural Nexus</title>
      <!--[if mso]>
      <style type="text/css">
        body, table, td {font-family: 'Segoe UI', Arial, sans-serif !important;}
      </style>
      <![endif]-->
    </head>
    <body style="margin: 0; padding: 0; background: linear-gradient(135deg, #e0f2fe 0%, #b3e5fc 30%, #e8eaf6 70%, #f3e5f5 100%); font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Arial, sans-serif;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background: linear-gradient(135deg, #e0f2fe 0%, #b3e5fc 30%, #e8eaf6 70%, #f3e5f5 100%); min-height: 100vh;">
        <tr>
          <td align="center" style="padding: 30px 20px;">
            <!-- Email Container -->
            <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 60px rgba(59, 130, 246, 0.15), 0 10px 30px rgba(124, 58, 237, 0.1); max-width: 600px; margin: 0 auto; border: 1px solid rgba(255,255,255,0.2);">
              
              <!-- Animated Header with Logo -->
              <tr>
                <td align="center" style="padding: 50px 40px 40px 40px; background: linear-gradient(135deg, #1e293b 0%, #0891b2 15%, #06b6d4 25%, #4338ca 40%, #7c3aed 55%, #3b82f6 70%, #06b6d4 85%, #0891b2 100%); position: relative; overflow: hidden;">
                  <div style="position: relative; z-index: 1;">
                    <img src="https://d375w6nzl58bw0.cloudfront.net/uploads/14106ffa6e1deecf68d9f8eaa9b3953bf4e7d886eb23a5d7b729e2b8490a5f51.jpeg" alt="Neural Nexus Logo" width="120" style="display: block; margin: 0 auto 20px; border-radius: 50%; border: 3px solid rgba(6, 182, 212, 0.4); box-shadow: 0 10px 30px rgba(59, 130, 246, 0.4), 0 5px 15px rgba(124, 58, 237, 0.2);" onerror="this.src='https://via.placeholder.com/120x120/06b6d4/ffffff?text=NN';">
                    <h1 style="color: white; margin: 0; font-size: 32px; font-weight: 700; letter-spacing: 1px; text-shadow: 0 4px 12px rgba(6, 182, 212, 0.5), 0 2px 6px rgba(124, 58, 237, 0.3); margin-bottom: 8px;">Neural Nexus</h1>
                    <p style="color: rgba(255,255,255,0.95); margin: 0; font-size: 18px; font-weight: 300; letter-spacing: 0.5px;">Password Reset Request</p>
                  </div>
                </td>
              </tr>
              
              <!-- Message Section -->
              <tr>
                <td style="padding: 50px 40px 30px 40px; text-align: center;">
                  <h2 style="margin: 0 0 20px 0; color: #1e293b; font-size: 28px; font-weight: 700;">Reset Your Password 🔐</h2>
                  <p style="margin: 0 0 25px 0; color: #475569; font-size: 18px; line-height: 1.7; font-weight: 400;">
                    Yo! Forgot your password? No worries, it happens to the best of us! We got you covered. Just click the button below to set a new password for your Neural Nexus account.
                  </p>
                  <p style="margin: 0 0 30px 0; color: #64748b; font-size: 16px; line-height: 1.6; padding: 20px; background: linear-gradient(135deg, #f0fdff, #e0f7fa, #f8fafc, #faf5ff); border-radius: 12px; border-left: 4px solid #3b82f6; box-shadow: 0 2px 10px rgba(59, 130, 246, 0.1);">
                    🕒 <strong>Note:</strong> This link will expire in 24 hours for security reasons.
                  </p>
                </td>
              </tr>
              
              <!-- Reset Button -->
              <tr>
                <td align="center" style="padding: 0 40px 40px 40px;">
                  <table role="presentation" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                      <td style="background: linear-gradient(135deg, #3b82f6 0%, #6366f1 50%, #8b5cf6 100%); border-radius: 12px; text-align: center; box-shadow: 0 8px 30px rgba(59, 130, 246, 0.3), 0 4px 15px rgba(99, 102, 241, 0.2); position: relative; overflow: hidden;">
                        <div style="position: absolute; inset: 0; background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%);"></div>
                        <a href="${resetLink}" target="_blank" style="position: relative; z-index: 1; display: inline-block; padding: 18px 36px; color: white; text-decoration: none; font-weight: 600; font-size: 16px; letter-spacing: 0.5px; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">
                          Reset My Password
                        </a>
                      </td>
                    </tr>
                  </table>
                  <p style="margin: 20px 0 0 0; color: #64748b; font-size: 14px; text-align: center;">
                    If you did not request this, please ignore this email or <a href="https://neuralnexus.biz/contact" style="color: #0891b2; text-decoration: underline; font-weight: 500;">contact support</a> immediately.
                  </p>
                </td>
              </tr>
              
              <!-- Security Tips -->
              <tr>
                <td style="padding: 0 40px 40px 40px;">
                  <div style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border-radius: 16px; padding: 25px; border: 1px solid #e2e8f0;">
                    <h3 style="margin: 0 0 15px 0; color: #1e293b; font-size: 18px; font-weight: 600;">🛡️ Security Tips</h3>
                    <ul style="margin: 0; padding: 0 0 0 20px; color: #64748b; font-size: 15px; line-height: 1.6;">
                      <li style="margin-bottom: 8px;">Create a strong password with a mix of letters, numbers, and symbols</li>
                      <li style="margin-bottom: 8px;">Don't reuse passwords across different sites</li>
                      <li style="margin-bottom: 8px;">Consider using a password manager for extra security</li>
                      <li>Set up two-factor authentication for additional protection</li>
                    </ul>
                  </div>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="padding: 30px 40px 40px 40px; text-align: center; background: linear-gradient(135deg, #f0fdff 0%, #e0f7fa 30%, #f8fafc 70%, #faf5ff 100%);">
                  <p style="margin: 0 0 20px 0; color: #1e293b; font-size: 18px; line-height: 1.7; font-weight: 600;">
                    Stay secure!<br>
                    <span style="color: #64748b; font-weight: 400;">The Neural Nexus Squad</span>
                  </p>
                  
                  <!-- Social Links -->
                  <div style="margin-bottom: 25px;">
                    <a href="https://github.com/Drago-03/Neural-Nexus" target="_blank" style="display: inline-block; margin: 0 12px;">
                      <img src="https://cdn-icons-png.flaticon.com/512/25/25231.png" alt="GitHub" width="32" height="32" style="border-radius: 8px; box-shadow: 0 4px 15px rgba(67, 56, 202, 0.3);">
                    </a>
                    <a href="https://discord.gg/9bPsjgnJ5v" target="_blank" style="display: inline-block; margin: 0 12px;">
                      <img src="https://cdn-icons-png.flaticon.com/512/5968/5968756.png" alt="Discord" width="32" height="32" style="border-radius: 8px; box-shadow: 0 4px 15px rgba(88, 101, 242, 0.3);">
                    </a>
                  </div>
                  
                  <!-- Footer Links -->
                  <p style="margin: 0; font-size: 14px; color: #94a3b8; line-height: 1.8;">
                    <a href="https://neuralnexus.biz/contact" target="_blank" style="color: #64748b; text-decoration: none; font-weight: 500; margin: 0 12px; padding: 8px 12px; border-radius: 6px; background: rgba(100, 116, 139, 0.1);">📧 Support</a>
                    <a href="https://neuralnexus.biz/privacy" target="_blank" style="color: #64748b; text-decoration: none; font-weight: 500; margin: 0 12px; padding: 8px 12px; border-radius: 6px; background: rgba(100, 116, 139, 0.1);">🔒 Privacy</a>
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

/**
 * Generate a stylish email verification template
 */
function generateVerificationEmail(verificationLink: string): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email - Neural Nexus</title>
      <!--[if mso]>
      <style type="text/css">
        body, table, td {font-family: 'Segoe UI', Arial, sans-serif !important;}
      </style>
      <![endif]-->
    </head>
    <body style="margin: 0; padding: 0; background: linear-gradient(135deg, #e0f2fe 0%, #b3e5fc 30%, #e8eaf6 70%, #f3e5f5 100%); font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Arial, sans-serif;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background: linear-gradient(135deg, #e0f2fe 0%, #b3e5fc 30%, #e8eaf6 70%, #f3e5f5 100%); min-height: 100vh;">
        <tr>
          <td align="center" style="padding: 30px 20px;">
            <!-- Email Container -->
            <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 60px rgba(59, 130, 246, 0.15), 0 10px 30px rgba(124, 58, 237, 0.1); max-width: 600px; margin: 0 auto; border: 1px solid rgba(255,255,255,0.2);">
              
              <!-- Animated Header with Logo -->
              <tr>
                <td align="center" style="padding: 50px 40px 40px 40px; background: linear-gradient(135deg, #1e293b 0%, #0891b2 15%, #06b6d4 25%, #4338ca 40%, #7c3aed 55%, #3b82f6 70%, #06b6d4 85%, #0891b2 100%); position: relative; overflow: hidden;">
                  <div style="position: relative; z-index: 1;">
                    <img src="https://d375w6nzl58bw0.cloudfront.net/uploads/14106ffa6e1deecf68d9f8eaa9b3953bf4e7d886eb23a5d7b729e2b8490a5f51.jpeg" alt="Neural Nexus Logo" width="120" style="display: block; margin: 0 auto 20px; border-radius: 50%; border: 3px solid rgba(6, 182, 212, 0.4); box-shadow: 0 10px 30px rgba(59, 130, 246, 0.4), 0 5px 15px rgba(124, 58, 237, 0.2);" onerror="this.src='https://via.placeholder.com/120x120/06b6d4/ffffff?text=NN';">
                    <h1 style="color: white; margin: 0; font-size: 32px; font-weight: 700; letter-spacing: 1px; text-shadow: 0 4px 12px rgba(6, 182, 212, 0.5), 0 2px 6px rgba(124, 58, 237, 0.3); margin-bottom: 8px;">Neural Nexus</h1>
                    <p style="color: rgba(255,255,255,0.95); margin: 0; font-size: 18px; font-weight: 300; letter-spacing: 0.5px;">Verify Your Email</p>
                  </div>
                </td>
              </tr>
              
              <!-- Message Section -->
              <tr>
                <td style="padding: 50px 40px 30px 40px; text-align: center;">
                  <h2 style="margin: 0 0 20px 0; color: #1e293b; font-size: 28px; font-weight: 700;">You're Almost There! ✨</h2>
                  <p style="margin: 0 0 25px 0; color: #475569; font-size: 18px; line-height: 1.7; font-weight: 400;">
                    Sup! Thanks for joining the Neural Nexus fam! Just one more step to unlock all the sick AI features and join our lit community. Verify your email by clicking the button below:
                  </p>
                  <p style="margin: 0 0 30px 0; color: #64748b; font-size: 16px; line-height: 1.6; padding: 20px; background: linear-gradient(135deg, #f0fdff, #e0f7fa, #f8fafc, #faf5ff); border-radius: 12px; border-left: 4px solid #10b981; box-shadow: 0 2px 10px rgba(16, 185, 129, 0.1);">
                    🚀 <strong>Unlock:</strong> All Neural Nexus features once your email is verified!
                  </p>
                </td>
              </tr>
              
              <!-- Verification Button -->
              <tr>
                <td align="center" style="padding: 0 40px 40px 40px;">
                  <table role="presentation" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                      <td style="background: linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%); border-radius: 12px; text-align: center; box-shadow: 0 8px 30px rgba(16, 185, 129, 0.3), 0 4px 15px rgba(5, 150, 105, 0.2); position: relative; overflow: hidden;">
                        <div style="position: absolute; inset: 0; background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%);"></div>
                        <a href="${verificationLink}" target="_blank" style="position: relative; z-index: 1; display: inline-block; padding: 18px 36px; color: white; text-decoration: none; font-weight: 600; font-size: 16px; letter-spacing: 0.5px; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">
                          Verify My Email
                        </a>
                      </td>
                    </tr>
                  </table>
                  <p style="margin: 20px 0 0 0; color: #64748b; font-size: 14px; text-align: center;">
                    If you did not create an account with us, you can safely ignore this email.
                  </p>
                </td>
              </tr>
              
              <!-- What's Next Section -->
              <tr>
                <td style="padding: 0 40px 40px 40px;">
                  <div style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border-radius: 16px; padding: 25px; border: 1px solid #e2e8f0;">
                    <h3 style="margin: 0 0 15px 0; color: #1e293b; font-size: 18px; font-weight: 600;">What's Next? 🔮</h3>
                    <ul style="margin: 0; padding: 0 0 0 20px; color: #64748b; font-size: 15px; line-height: 1.6;">
                      <li style="margin-bottom: 8px;">Access to premium AI models and tools</li>
                      <li style="margin-bottom: 8px;">Join our exclusive community of AI innovators</li>
                      <li style="margin-bottom: 8px;">Create and share your own AI experiences</li>
                      <li>Stay updated with the latest in AI technology</li>
                    </ul>
                  </div>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="padding: 30px 40px 40px 40px; text-align: center; background: linear-gradient(135deg, #f0fdff 0%, #e0f7fa 30%, #f8fafc 70%, #faf5ff 100%);">
                  <p style="margin: 0 0 20px 0; color: #1e293b; font-size: 18px; line-height: 1.7; font-weight: 600;">
                    We can't wait to see you inside!<br>
                    <span style="color: #64748b; font-weight: 400;">The Neural Nexus Squad</span>
                  </p>
                  
                  <!-- Social Links -->
                  <div style="margin-bottom: 25px;">
                    <a href="https://github.com/Drago-03/Neural-Nexus" target="_blank" style="display: inline-block; margin: 0 12px;">
                      <img src="https://cdn-icons-png.flaticon.com/512/25/25231.png" alt="GitHub" width="32" height="32" style="border-radius: 8px; box-shadow: 0 4px 15px rgba(67, 56, 202, 0.3);">
                    </a>
                    <a href="https://discord.gg/9bPsjgnJ5v" target="_blank" style="display: inline-block; margin: 0 12px;">
                      <img src="https://cdn-icons-png.flaticon.com/512/5968/5968756.png" alt="Discord" width="32" height="32" style="border-radius: 8px; box-shadow: 0 4px 15px rgba(88, 101, 242, 0.3);">
                    </a>
                  </div>
                  
                  <!-- Footer Links -->
                  <p style="margin: 0; font-size: 14px; color: #94a3b8; line-height: 1.8;">
                    <a href="https://neuralnexus.biz/contact" target="_blank" style="color: #64748b; text-decoration: none; font-weight: 500; margin: 0 12px; padding: 8px 12px; border-radius: 6px; background: rgba(100, 116, 139, 0.1);">📧 Support</a>
                    <a href="https://neuralnexus.biz/privacy" target="_blank" style="color: #64748b; text-decoration: none; font-weight: 500; margin: 0 12px; padding: 8px 12px; border-radius: 6px; background: rgba(100, 116, 139, 0.1);">🔒 Privacy</a>
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
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
 * Generate a stylish newsletter welcome email template based on the sign-up confirmation style
 */
function generateNewsletterWelcomeEmail(name: string = 'Awesome User'): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Neural Nexus Newsletter Confirmation</title>
      <!--[if mso]>
      <style type="text/css">
        body, table, td {font-family: 'Segoe UI', Arial, sans-serif !important;}
      </style>
      <![endif]-->
    </head>
    <body style="margin: 0; padding: 0; background: linear-gradient(135deg, #e0f2fe 0%, #b3e5fc 30%, #e8eaf6 70%, #f3e5f5 100%); font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Arial, sans-serif;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background: linear-gradient(135deg, #e0f2fe 0%, #b3e5fc 30%, #e8eaf6 70%, #f3e5f5 100%); min-height: 100vh;">
        <tr>
          <td align="center" style="padding: 30px 20px;">
            <!-- Email Container -->
            <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 60px rgba(59, 130, 246, 0.15), 0 10px 30px rgba(124, 58, 237, 0.1); max-width: 600px; margin: 0 auto; border: 1px solid rgba(255,255,255,0.2);">
              
              <!-- Animated Header with Logo -->
              <tr>
                <td align="center" style="padding: 50px 40px 40px 40px; background: linear-gradient(135deg, #1e293b 0%, #0891b2 15%, #06b6d4 25%, #4338ca 40%, #7c3aed 55%, #3b82f6 70%, #06b6d4 85%, #0891b2 100%); position: relative; overflow: hidden;">
                  <div style="position: relative; z-index: 1;">
                    <img src="https://d375w6nzl58bw0.cloudfront.net/uploads/14106ffa6e1deecf68d9f8eaa9b3953bf4e7d886eb23a5d7b729e2b8490a5f51.jpeg" alt="Neural Nexus Logo" width="120" style="display: block; margin: 0 auto 20px; border-radius: 50%; border: 3px solid rgba(6, 182, 212, 0.4); box-shadow: 0 10px 30px rgba(59, 130, 246, 0.4), 0 5px 15px rgba(124, 58, 237, 0.2);" onerror="this.src='https://via.placeholder.com/120x120/06b6d4/ffffff?text=NN';">
                    <h1 style="color: white; margin: 0; font-size: 32px; font-weight: 700; letter-spacing: 1px; text-shadow: 0 4px 12px rgba(6, 182, 212, 0.5), 0 2px 6px rgba(124, 58, 237, 0.3); margin-bottom: 8px;">Neural Nexus</h1>
                    <p style="color: rgba(255,255,255,0.95); margin: 0; font-size: 18px; font-weight: 300; letter-spacing: 0.5px;">Where AI Innovation Meets Limitless Possibilities</p>
                    <div style="width: 60px; height: 3px; background: linear-gradient(to right, #06b6d4, #3b82f6, #a855f7, #0891b2); margin: 20px auto 0; border-radius: 2px; box-shadow: 0 2px 8px rgba(6, 182, 212, 0.4);"></div>
                  </div>
                </td>
              </tr>
              
              <!-- Welcome Message -->
              <tr>
                <td style="padding: 50px 40px 30px 40px; text-align: center;">
                  <h2 style="margin: 0 0 20px 0; color: #1e293b; font-size: 28px; font-weight: 700; background: linear-gradient(135deg, #06b6d4, #3b82f6, #7c3aed, #0891b2); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">Newsletter Subscription Confirmed! 🚀</h2>
                  <p style="margin: 0 0 25px 0; color: #475569; font-size: 18px; line-height: 1.7; font-weight: 400;">
                    <strong>Yo ${name}! You're in!</strong> Thanks for subscribing to our lit newsletter! You've just joined an exclusive community of AI pioneers, innovators, and visionaries who get the hottest updates straight to their inbox.
                  </p>
                  <p style="margin: 0 0 30px 0; color: #64748b; font-size: 16px; line-height: 1.6; padding: 20px; background: linear-gradient(135deg, #f0fdff, #e0f7fa, #f8fafc, #faf5ff); border-radius: 12px; border-left: 4px solid #06b6d4; box-shadow: 0 2px 10px rgba(6, 182, 212, 0.1);">
                    💡 <em>You'll be the first to know about sick new AI features, drop-dead gorgeous model releases, and exclusive events that'll blow your mind!</em>
                  </p>
                </td>
              </tr>
              
              <!-- What You'll Get Section -->
              <tr>
                <td style="padding: 0 40px 40px 40px;">
                  <h3 style="margin: 0 0 30px 0; color: #1e293b; font-size: 24px; font-weight: 700; text-align: center; position: relative;">
                    🔥 What You'll Get In Your Inbox
                    <div style="width: 80px; height: 3px; background: linear-gradient(to right, #06b6d4, #3b82f6, #7c3aed, #0891b2); margin: 15px auto 0; border-radius: 2px; box-shadow: 0 2px 8px rgba(6, 182, 212, 0.3);"></div>
                  </h3>
                  
                  <!-- Feature Grid -->
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                    <!-- Feature 1 -->
                    <tr>
                      <td style="padding: 0 0 20px 0;">
                        <div style="background: linear-gradient(135deg, #f0fdff 0%, #e0f7fa 30%, #f8fafc 70%, #faf5ff 100%); border-radius: 16px; padding: 25px; border: 1px solid #b3e5fc; transition: all 0.3s ease; position: relative; overflow: hidden; box-shadow: 0 4px 15px rgba(6, 182, 212, 0.08);">
                          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                            <tr>
                              <td width="70" style="vertical-align: top;">
                                <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #06b6d4, #3b82f6, #7c3aed); border-radius: 16px; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 25px rgba(6, 182, 212, 0.4), 0 4px 12px rgba(124, 58, 237, 0.2); position: relative; z-index: 1; text-align: center;">
                                  <span style="font-size: 28px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));">🔔</span>
                                </div>
                              </td>
                              <td style="padding-left: 20px; vertical-align: top;">
                                <h4 style="margin: 0 0 10px 0; color: #1e293b; font-size: 20px; font-weight: 600;">Exclusive AI Drops</h4>
                                <p style="margin: 0; color: #64748b; font-size: 15px; line-height: 1.6;">
                                  Be the first to hear about our newest AI models, features, and tools before anyone else even knows they exist.
                                </p>
                              </td>
                            </tr>
                          </table>
                        </div>
                      </td>
                    </tr>
                    
                    <!-- Feature 2 -->
                    <tr>
                      <td style="padding: 0 0 20px 0;">
                        <div style="background: linear-gradient(135deg, #f0fdff 0%, #e0f7fa 30%, #f8fafc 70%, #faf5ff 100%); border-radius: 16px; padding: 25px; border: 1px solid #b3e5fc; position: relative; overflow: hidden; box-shadow: 0 4px 15px rgba(139, 92, 246, 0.08);">
                          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                            <tr>
                              <td width="70" style="vertical-align: top;">
                                <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #a855f7, #06b6d4, #3b82f6); border-radius: 16px; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 25px rgba(168, 85, 247, 0.3), 0 4px 12px rgba(6, 182, 212, 0.3); position: relative; z-index: 1; text-align: center;">
                                  <span style="font-size: 28px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));">💎</span>
                                </div>
                              </td>
                              <td style="padding-left: 20px; vertical-align: top;">
                                <h4 style="margin: 0 0 10px 0; color: #1e293b; font-size: 20px; font-weight: 600;">Sick Tutorials & Tips</h4>
                                <p style="margin: 0; color: #64748b; font-size: 15px; line-height: 1.6;">
                                  Level up your AI game with our fire tutorials, pro tips, and insider knowledge that'll make your projects stand out.
                                </p>
                              </td>
                            </tr>
                          </table>
                        </div>
                      </td>
                    </tr>
                    
                    <!-- Feature 3 -->
                    <tr>
                      <td style="padding: 0 0 20px 0;">
                        <div style="background: linear-gradient(135deg, #f0fdff 0%, #e0f7fa 30%, #f8fafc 70%, #faf5ff 100%); border-radius: 16px; padding: 25px; border: 1px solid #b3e5fc; position: relative; overflow: hidden; box-shadow: 0 4px 15px rgba(8, 145, 178, 0.1);">
                          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                            <tr>
                              <td width="70" style="vertical-align: top;">
                                <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #0891b2, #8b5cf6, #06b6d4); border-radius: 16px; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 25px rgba(8, 145, 178, 0.4), 0 4px 12px rgba(139, 92, 246, 0.2); position: relative; z-index: 1; text-align: center;">
                                  <span style="font-size: 28px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));">🎁</span>
                                </div>
                              </td>
                              <td style="padding-left: 20px; vertical-align: top;">
                                <h4 style="margin: 0 0 10px 0; color: #1e293b; font-size: 20px; font-weight: 600;">Exclusive Discounts</h4>
                                <p style="margin: 0; color: #64748b; font-size: 15px; line-height: 1.6;">
                                  Subscriber-only deals and discounts on our premium AI models and services that'll save you major cash.
                                </p>
                              </td>
                            </tr>
                          </table>
                        </div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <!-- Enhanced CTA Button -->
              <tr>
                <td align="center" style="padding: 0 40px 40px 40px;">
                  <table role="presentation" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                      <td style="background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 25%, #7c3aed 50%, #8b5cf6 75%, #0891b2 100%); border-radius: 12px; text-align: center; box-shadow: 0 8px 30px rgba(6, 182, 212, 0.4), 0 4px 15px rgba(124, 58, 237, 0.3); position: relative; overflow: hidden;">
                        <div style="position: absolute; inset: 0; background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%);"></div>
                        <a href="https://neuralnexus.biz/dashboard" target="_blank" style="position: relative; z-index: 1; display: inline-block; padding: 18px 36px; color: white; text-decoration: none; font-weight: 600; font-size: 16px; letter-spacing: 0.5px; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">
                          🚀 Explore Neural Nexus
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <!-- Premium Divider -->
              <tr>
                <td style="padding: 0 40px 30px 40px;">
                  <div style="height: 2px; background: linear-gradient(to right, #06b6d4 0%, #3b82f6 15%, #7c3aed 30%, #8b5cf6 45%, #0891b2 60%, #06b6d4 75%, #4338ca 90%, #7c3aed 100%); border-radius: 1px; position: relative;">
                    <div style="position: absolute; top: -1px; left: 0; right: 0; height: 4px; background: linear-gradient(to right, #06b6d4 0%, #3b82f6 20%, #7c3aed 40%, #8b5cf6 60%, #0891b2 80%, #06b6d4 100%); border-radius: 2px; opacity: 0.3; filter: blur(2px);"></div>
                  </div>
                </td>
              </tr>
              
              <!-- Enhanced Footer -->
              <tr>
                <td style="padding: 30px 40px 40px 40px; text-align: center; background: linear-gradient(135deg, #f0fdff 0%, #e0f7fa 30%, #f8fafc 70%, #faf5ff 100%);">
                  <p style="margin: 0 0 20px 0; color: #1e293b; font-size: 18px; line-height: 1.7; font-weight: 600;">
                    Stay vibin' with us!<br>
                    <span style="color: #64748b; font-weight: 400;">The Neural Nexus Squad</span>
                  </p>
                  
                  <!-- Social Links -->
                  <div style="margin-bottom: 25px;">
                    <a href="https://github.com/Drago-03/Neural-Nexus" target="_blank" style="display: inline-block; margin: 0 12px;">
                      <img src="https://cdn-icons-png.flaticon.com/512/25/25231.png" alt="GitHub" width="32" height="32" style="border-radius: 8px; box-shadow: 0 4px 15px rgba(67, 56, 202, 0.3);">
                    </a>
                    <a href="https://discord.gg/9bPsjgnJ5v" target="_blank" style="display: inline-block; margin: 0 12px;">
                      <img src="https://cdn-icons-png.flaticon.com/512/5968/5968756.png" alt="Discord" width="32" height="32" style="border-radius: 8px; box-shadow: 0 4px 15px rgba(88, 101, 242, 0.3);">
                    </a>
                  </div>
                  
                  <!-- Footer Links -->
                  <p style="margin: 0; font-size: 14px; color: #94a3b8; line-height: 1.8;">
                    <a href="https://neuralnexus.biz/contact" target="_blank" style="color: #64748b; text-decoration: none; font-weight: 500; margin: 0 12px; padding: 8px 12px; border-radius: 6px; background: rgba(100, 116, 139, 0.1);">📧 Support</a>
                    <a href="https://neuralnexus.biz/privacy" target="_blank" style="color: #64748b; text-decoration: none; font-weight: 500; margin: 0 12px; padding: 8px 12px; border-radius: 6px; background: rgba(100, 116, 139, 0.1);">🔒 Privacy</a>
                    <a href="https://neuralnexus.biz/unsubscribe" target="_blank" style="color: #64748b; text-decoration: none; font-weight: 500; margin: 0 12px; padding: 8px 12px; border-radius: 6px; background: rgba(100, 116, 139, 0.1);">✉️ Unsubscribe</a>
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

/**
 * Generate a stylish account deletion confirmation email template
 */
function generateAccountDeletionEmail(confirmationLink: string): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Confirm Account Deletion - Neural Nexus</title>
      <!--[if mso]>
      <style type="text/css">
        body, table, td {font-family: 'Segoe UI', Arial, sans-serif !important;}
      </style>
      <![endif]-->
    </head>
    <body style="margin: 0; padding: 0; background: linear-gradient(135deg, #e0f2fe 0%, #b3e5fc 30%, #e8eaf6 70%, #f3e5f5 100%); font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Arial, sans-serif;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background: linear-gradient(135deg, #e0f2fe 0%, #b3e5fc 30%, #e8eaf6 70%, #f3e5f5 100%); min-height: 100vh;">
        <tr>
          <td align="center" style="padding: 30px 20px;">
            <!-- Email Container -->
            <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 60px rgba(59, 130, 246, 0.15), 0 10px 30px rgba(124, 58, 237, 0.1); max-width: 600px; margin: 0 auto; border: 1px solid rgba(255,255,255,0.2);">
              
              <!-- Animated Header with Logo -->
              <tr>
                <td align="center" style="padding: 50px 40px 40px 40px; background: linear-gradient(135deg, #1e293b 0%, #0891b2 15%, #06b6d4 25%, #4338ca 40%, #7c3aed 55%, #3b82f6 70%, #06b6d4 85%, #0891b2 100%); position: relative; overflow: hidden;">
                  <div style="position: relative; z-index: 1;">
                    <img src="https://d375w6nzl58bw0.cloudfront.net/uploads/14106ffa6e1deecf68d9f8eaa9b3953bf4e7d886eb23a5d7b729e2b8490a5f51.jpeg" alt="Neural Nexus Logo" width="120" style="display: block; margin: 0 auto 20px; border-radius: 50%; border: 3px solid rgba(6, 182, 212, 0.4); box-shadow: 0 10px 30px rgba(59, 130, 246, 0.4), 0 5px 15px rgba(124, 58, 237, 0.2);" onerror="this.src='https://via.placeholder.com/120x120/06b6d4/ffffff?text=NN';">
                    <h1 style="color: white; margin: 0; font-size: 32px; font-weight: 700; letter-spacing: 1px; text-shadow: 0 4px 12px rgba(6, 182, 212, 0.5), 0 2px 6px rgba(124, 58, 237, 0.3); margin-bottom: 8px;">Neural Nexus</h1>
                    <p style="color: rgba(255,255,255,0.95); margin: 0; font-size: 18px; font-weight: 300; letter-spacing: 0.5px;">Account Deletion Confirmation</p>
                  </div>
                </td>
              </tr>
              
              <!-- Message Section -->
              <tr>
                <td style="padding: 50px 40px 30px 40px; text-align: center;">
                  <h2 style="margin: 0 0 20px 0; color: #1e293b; font-size: 28px; font-weight: 700;">We're Sad To See You Go 😢</h2>
                  <p style="margin: 0 0 25px 0; color: #475569; font-size: 18px; line-height: 1.7; font-weight: 400;">
                    We've received a request to delete your Neural Nexus account. If you requested this action, please confirm by clicking the button below.
                  </p>
                  <p style="margin: 0 0 30px 0; color: #64748b; font-size: 16px; line-height: 1.6; padding: 20px; background: linear-gradient(135deg, #fff0f0, #ffe4e4, #fff8f8, #ffecec); border-radius: 12px; border-left: 4px solid #f43f5e; box-shadow: 0 2px 10px rgba(244, 63, 94, 0.1);">
                    ⚠️ <strong>Warning:</strong> This action cannot be undone! All your data, models, and settings will be permanently deleted.
                  </p>
                </td>
              </tr>
              
              <!-- Confirmation Button -->
              <tr>
                <td align="center" style="padding: 0 40px 40px 40px;">
                  <table role="presentation" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                      <td style="background: linear-gradient(135deg, #f43f5e 0%, #e11d48 50%, #be123c 100%); border-radius: 12px; text-align: center; box-shadow: 0 8px 30px rgba(244, 63, 94, 0.3), 0 4px 15px rgba(190, 18, 60, 0.2); position: relative; overflow: hidden;">
                        <div style="position: absolute; inset: 0; background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%);"></div>
                        <a href="${confirmationLink}" target="_blank" style="position: relative; z-index: 1; display: inline-block; padding: 18px 36px; color: white; text-decoration: none; font-weight: 600; font-size: 16px; letter-spacing: 0.5px; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">
                          Confirm Account Deletion
                        </a>
                      </td>
                    </tr>
                  </table>
                  <p style="margin: 20px 0 0 0; color: #64748b; font-size: 14px; text-align: center;">
                    If you did not request this, please ignore this email or <a href="https://neuralnexus.biz/contact" style="color: #0891b2; text-decoration: underline; font-weight: 500;">contact support</a> immediately.
                  </p>
                </td>
              </tr>
              
              <!-- Additional Info -->
              <tr>
                <td style="padding: 0 40px 40px 40px;">
                  <div style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border-radius: 16px; padding: 25px; border: 1px solid #e2e8f0;">
                    <h3 style="margin: 0 0 15px 0; color: #1e293b; font-size: 18px; font-weight: 600;">What happens next?</h3>
                    <ul style="margin: 0; padding: 0 0 0 20px; color: #64748b; font-size: 15px; line-height: 1.6;">
                      <li style="margin-bottom: 8px;">Your account will be scheduled for deletion</li>
                      <li style="margin-bottom: 8px;">All your data will be permanently removed after 48 hours</li>
                      <li style="margin-bottom: 8px;">You can cancel the deletion by logging in during this period</li>
                      <li>You're always welcome back if you change your mind in the future</li>
                    </ul>
                  </div>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="padding: 30px 40px 40px 40px; text-align: center; background: linear-gradient(135deg, #f0fdff 0%, #e0f7fa 30%, #f8fafc 70%, #faf5ff 100%);">
                  <p style="margin: 0 0 20px 0; color: #1e293b; font-size: 18px; line-height: 1.7; font-weight: 600;">
                    We hope to see you again!<br>
                    <span style="color: #64748b; font-weight: 400;">The Neural Nexus Squad</span>
                  </p>
                  
                  <!-- Social Links -->
                  <div style="margin-bottom: 25px;">
                    <a href="https://github.com/Drago-03/Neural-Nexus" target="_blank" style="display: inline-block; margin: 0 12px;">
                      <img src="https://cdn-icons-png.flaticon.com/512/25/25231.png" alt="GitHub" width="32" height="32" style="border-radius: 8px; box-shadow: 0 4px 15px rgba(67, 56, 202, 0.3);">
                    </a>
                    <a href="https://discord.gg/9bPsjgnJ5v" target="_blank" style="display: inline-block; margin: 0 12px;">
                      <img src="https://cdn-icons-png.flaticon.com/512/5968/5968756.png" alt="Discord" width="32" height="32" style="border-radius: 8px; box-shadow: 0 4px 15px rgba(88, 101, 242, 0.3);">
                    </a>
                  </div>
                  
                  <!-- Footer Links -->
                  <p style="margin: 0; font-size: 14px; color: #94a3b8; line-height: 1.8;">
                    <a href="https://neuralnexus.biz/contact" target="_blank" style="color: #64748b; text-decoration: none; font-weight: 500; margin: 0 12px; padding: 8px 12px; border-radius: 6px; background: rgba(100, 116, 139, 0.1);">📧 Support</a>
                    <a href="https://neuralnexus.biz/privacy" target="_blank" style="color: #64748b; text-decoration: none; font-weight: 500; margin: 0 12px; padding: 8px 12px; border-radius: 6px; background: rgba(100, 116, 139, 0.1);">🔒 Privacy</a>
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

/**
 * Generate a stylish account activation confirmation email template
 */
function generateAccountActivationEmail(firstName: string): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Account Activated - Neural Nexus</title>
      <!--[if mso]>
      <style type="text/css">
        body, table, td {font-family: 'Segoe UI', Arial, sans-serif !important;}
      </style>
      <![endif]-->
    </head>
    <body style="margin: 0; padding: 0; background: linear-gradient(135deg, #f0fdff 0%, #e0f7fa 30%, #f8fafc 70%, #faf5ff 100%); font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Arial, sans-serif;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background: linear-gradient(135deg, #f0fdff 0%, #e0f7fa 30%, #f8fafc 70%, #faf5ff 100%); min-height: 100vh;">
        <tr>
          <td align="center" style="padding: 30px 20px;">
            <!-- Email Container -->
            <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 60px rgba(16, 185, 129, 0.15), 0 10px 30px rgba(16, 185, 129, 0.1); max-width: 600px; margin: 0 auto; border: 1px solid rgba(255,255,255,0.2);">
              
              <!-- Header with Logo -->
              <tr>
                <td align="center" style="padding: 50px 40px 40px 40px; background: linear-gradient(135deg, #047857 0%, #10b981 50%, #34d399 100%); position: relative; overflow: hidden;">
                  <div style="position: relative; z-index: 1;">
                    <img src="https://d375w6nzl58bw0.cloudfront.net/uploads/14106ffa6e1deecf68d9f8eaa9b3953bf4e7d886eb23a5d7b729e2b8490a5f51.jpeg" alt="Neural Nexus Logo" width="120" style="display: block; margin: 0 auto 20px; border-radius: 50%; border: 3px solid rgba(16, 185, 129, 0.4); box-shadow: 0 10px 30px rgba(16, 185, 129, 0.4), 0 5px 15px rgba(16, 185, 129, 0.2);" onerror="this.src='https://via.placeholder.com/120x120/10b981/ffffff?text=NN';">
                    <h1 style="color: white; margin: 0; font-size: 32px; font-weight: 700; letter-spacing: 1px; text-shadow: 0 4px 12px rgba(5, 150, 105, 0.5), 0 2px 6px rgba(5, 150, 105, 0.3); margin-bottom: 8px;">Neural Nexus</h1>
                    <p style="color: rgba(255,255,255,0.95); margin: 0; font-size: 18px; font-weight: 300; letter-spacing: 0.5px;">Account Activated</p>
                  </div>
                </td>
              </tr>
              
              <!-- Message Section -->
              <tr>
                <td style="padding: 50px 40px 30px 40px; text-align: center;">
                  <h2 style="margin: 0 0 20px 0; color: #1e293b; font-size: 28px; font-weight: 700;">
                    <span style="display: inline-block; margin-right: 10px; transform: translateY(5px);">🎉</span>
                    You're In, ${firstName}!
                  </h2>
                  <p style="margin: 0 0 25px 0; color: #475569; font-size: 18px; line-height: 1.7; font-weight: 400;">
                    Congratulations! Your Neural Nexus account has been activated successfully. You're now part of our AI community.
                  </p>
                  <p style="margin: 0 0 30px 0; color: #64748b; font-size: 16px; line-height: 1.6; padding: 20px; background: linear-gradient(135deg, #f0fdff, #e0f7fa, #f8fafc, #faf5ff); border-radius: 12px; border-left: 4px solid #10b981; box-shadow: 0 2px 10px rgba(16, 185, 129, 0.1);">
                    🎉 <strong>Welcome!</strong> You're all set to start exploring the world of AI with Neural Nexus.
                  </p>
                </td>
              </tr>
              
              <!-- What's Next Section -->
              <tr>
                <td style="padding: 0 40px 40px 40px;">
                  <div style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border-radius: 16px; padding: 25px; border: 1px solid #e2e8f0;">
                    <h3 style="margin: 0 0 15px 0; color: #1e293b; font-size: 18px; font-weight: 600;">What's Next? 🔮</h3>
                    <ul style="margin: 0; padding: 0 0 0 20px; color: #64748b; font-size: 15px; line-height: 1.6;">
                      <li style="margin-bottom: 8px;">Access to premium AI models and tools</li>
                      <li style="margin-bottom: 8px;">Join our exclusive community of AI innovators</li>
                      <li style="margin-bottom: 8px;">Create and share your own AI experiences</li>
                      <li>Stay updated with the latest in AI technology</li>
                    </ul>
                  </div>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="padding: 30px 40px 40px 40px; text-align: center; background: linear-gradient(135deg, #f0fdff 0%, #e0f7fa 30%, #f8fafc 70%, #faf5ff 100%);">
                  <p style="margin: 0 0 20px 0; color: #1e293b; font-size: 18px; line-height: 1.7; font-weight: 600;">
                    We're excited to have you on board!<br>
                    <span style="color: #64748b; font-weight: 400;">The Neural Nexus Squad</span>
                  </p>
                  
                  <!-- Social Links -->
                  <div style="margin-bottom: 25px;">
                    <a href="https://github.com/Drago-03/Neural-Nexus" target="_blank" style="display: inline-block; margin: 0 12px;">
                      <img src="https://cdn-icons-png.flaticon.com/512/25/25231.png" alt="GitHub" width="32" height="32" style="border-radius: 8px; box-shadow: 0 4px 15px rgba(67, 56, 202, 0.3);">
                    </a>
                    <a href="https://discord.gg/9bPsjgnJ5v" target="_blank" style="display: inline-block; margin: 0 12px;">
                      <img src="https://cdn-icons-png.flaticon.com/512/5968/5968756.png" alt="Discord" width="32" height="32" style="border-radius: 8px; box-shadow: 0 4px 15px rgba(88, 101, 242, 0.3);">
                    </a>
                  </div>
                  
                  <!-- Footer Links -->
                  <p style="margin: 0; font-size: 14px; color: #94a3b8; line-height: 1.8;">
                    <a href="https://neuralnexus.biz/contact" target="_blank" style="color: #64748b; text-decoration: none; font-weight: 500; margin: 0 12px; padding: 8px 12px; border-radius: 6px; background: rgba(100, 116, 139, 0.1);">📧 Support</a>
                    <a href="https://neuralnexus.biz/privacy" target="_blank" style="color: #64748b; text-decoration: none; font-weight: 500; margin: 0 12px; padding: 8px 12px; border-radius: 6px; background: rgba(100, 116, 139, 0.1);">🔒 Privacy</a>
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

/**
 * Generate a stylish subscription cancellation confirmation email template
 */
function generateSubscriptionCancellationEmail(name: string = 'there', subscriptionDetails: string = 'Pro Plan'): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Subscription Cancelled - Neural Nexus</title>
      <!--[if mso]>
      <style type="text/css">
        body, table, td {font-family: 'Segoe UI', Arial, sans-serif !important;}
      </style>
      <![endif]-->
    </head>
    <body style="margin: 0; padding: 0; background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 30%, #f8fafc 70%, #f1f5f9 100%); font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Arial, sans-serif;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 30%, #f8fafc 70%, #f1f5f9 100%); min-height: 100vh;">
        <tr>
          <td align="center" style="padding: 30px 20px;">
            <!-- Email Container -->
            <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 60px rgba(100, 116, 139, 0.15), 0 10px 30px rgba(100, 116, 139, 0.1); max-width: 600px; margin: 0 auto; border: 1px solid rgba(255,255,255,0.2);">
              
              <!-- Header with Logo -->
              <tr>
                <td align="center" style="padding: 50px 40px 40px 40px; background: linear-gradient(135deg, #334155 0%, #475569 50%, #64748b 100%); position: relative; overflow: hidden;">
                  <div style="position: relative; z-index: 1;">
                    <img src="https://d375w6nzl58bw0.cloudfront.net/uploads/14106ffa6e1deecf68d9f8eaa9b3953bf4e7d886eb23a5d7b729e2b8490a5f51.jpeg" alt="Neural Nexus Logo" width="120" style="display: block; margin: 0 auto 20px; border-radius: 50%; border: 3px solid rgba(100, 116, 139, 0.4); box-shadow: 0 10px 30px rgba(100, 116, 139, 0.4), 0 5px 15px rgba(100, 116, 139, 0.2);" onerror="this.src='https://via.placeholder.com/120x120/64748b/ffffff?text=NN';">
                    <h1 style="color: white; margin: 0; font-size: 32px; font-weight: 700; letter-spacing: 1px; text-shadow: 0 4px 12px rgba(15, 23, 42, 0.5), 0 2px 6px rgba(15, 23, 42, 0.3); margin-bottom: 8px;">Neural Nexus</h1>
                    <p style="color: rgba(255,255,255,0.95); margin: 0; font-size: 18px; font-weight: 300; letter-spacing: 0.5px;">Subscription Cancelled</p>
                  </div>
                </td>
              </tr>
              
              <!-- Message Section -->
              <tr>
                <td style="padding: 50px 40px 30px 40px; text-align: center;">
                  <h2 style="margin: 0 0 20px 0; color: #1e293b; font-size: 28px; font-weight: 700;">
                    Your Subscription Has Been Cancelled
                  </h2>
                  <p style="margin: 0 0 25px 0; color: #475569; font-size: 18px; line-height: 1.7; font-weight: 400;">
                    Hey ${name}, we're sad to see you go! Your subscription to the ${subscriptionDetails} has been successfully cancelled. We hope you enjoyed your time with us and would love to have you back anytime.
                  </p>
                  <div style="margin: 0 0 30px 0; padding: 25px; background: linear-gradient(135deg, #f8fafc, #f1f5f9); border-radius: 12px; border-left: 4px solid #64748b; box-shadow: 0 2px 10px rgba(100, 116, 139, 0.1);">
                    <p style="margin: 0; color: #334155; font-size: 16px; line-height: 1.6; font-weight: 500;">
                      <strong style="font-size: 18px; display: block; margin-bottom: 10px;">✅ Cancellation Confirmed</strong>
                      You'll still have access to your premium features until the end of your current billing period.
                    </p>
                  </div>
                </td>
              </tr>
              
              <!-- Feedback Section -->
              <tr>
                <td style="padding: 0 40px 40px 40px; text-align: center;">
                  <div style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border-radius: 16px; padding: 30px; border: 1px solid #e2e8f0;">
                    <h3 style="margin: 0 0 20px 0; color: #1e293b; font-size: 20px; font-weight: 600;">We Value Your Feedback 💭</h3>
                    <p style="margin: 0 0 20px 0; color: #475569; font-size: 16px; line-height: 1.7;">
                      Mind telling us why you decided to cancel? Your feedback helps us improve our service.
                    </p>
                    <table role="presentation" border="0" cellspacing="0" cellpadding="0" style="margin: 0 auto;">
                      <tr>
                        <td style="background: linear-gradient(135deg, #64748b 0%, #475569 50%, #334155 100%); border-radius: 12px; text-align: center; box-shadow: 0 8px 30px rgba(100, 116, 139, 0.3), 0 4px 15px rgba(100, 116, 139, 0.2); position: relative; overflow: hidden;">
                          <div style="position: absolute; inset: 0; background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%);"></div>
                          <a href="https://neuralnexus.biz/feedback" target="_blank" style="position: relative; z-index: 1; display: inline-block; padding: 16px 32px; color: white; text-decoration: none; font-weight: 600; font-size: 16px; letter-spacing: 0.5px; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">
                            Share Feedback
                          </a>
                        </td>
                      </tr>
                    </table>
                  </div>
                </td>
              </tr>
              
              <!-- Rejoin Section -->
              <tr>
                <td style="padding: 0 40px 40px 40px; text-align: center;">
                  <h3 style="margin: 0 0 15px 0; color: #1e293b; font-size: 20px; font-weight: 600;">Miss us already? 🔙</h3>
                  <p style="margin: 0 0 20px 0; color: #475569; font-size: 16px; line-height: 1.7;">
                    You can reactivate your subscription anytime! We're always improving our platform with new features.
                  </p>
                  <table role="presentation" border="0" cellspacing="0" cellpadding="0" style="margin: 0 auto;">
                    <tr>
                      <td style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%); border-radius: 12px; text-align: center; box-shadow: 0 8px 30px rgba(15, 23, 42, 0.3), 0 4px 15px rgba(15, 23, 42, 0.2); position: relative; overflow: hidden;">
                        <div style="position: absolute; inset: 0; background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%);"></div>
                        <a href="https://neuralnexus.biz/subscription" target="_blank" style="position: relative; z-index: 1; display: inline-block; padding: 16px 32px; color: white; text-decoration: none; font-weight: 600; font-size: 16px; letter-spacing: 0.5px; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">
                          Resubscribe
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="padding: 30px 40px 40px 40px; text-align: center; background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 30%, #f8fafc 70%, #f1f5f9 100%);">
                  <p style="margin: 0 0 20px 0; color: #1e293b; font-size: 18px; line-height: 1.7; font-weight: 600;">
                    Thanks for being part of our journey!<br>
                    <span style="color: #64748b; font-weight: 400;">The Neural Nexus Squad</span>
                  </p>
                  
                  <!-- Social Links -->
                  <div style="margin-bottom: 25px;">
                    <a href="https://github.com/Drago-03/Neural-Nexus" target="_blank" style="display: inline-block; margin: 0 12px;">
                      <img src="https://cdn-icons-png.flaticon.com/512/25/25231.png" alt="GitHub" width="32" height="32" style="border-radius: 8px; box-shadow: 0 4px 15px rgba(67, 56, 202, 0.3);">
                    </a>
                    <a href="https://discord.gg/9bPsjgnJ5v" target="_blank" style="display: inline-block; margin: 0 12px;">
                      <img src="https://cdn-icons-png.flaticon.com/512/5968/5968756.png" alt="Discord" width="32" height="32" style="border-radius: 8px; box-shadow: 0 4px 15px rgba(88, 101, 242, 0.3);">
                    </a>
                  </div>
                  
                  <!-- Footer Links -->
                  <p style="margin: 0; font-size: 14px; color: #94a3b8; line-height: 1.8;">
                    <a href="https://neuralnexus.biz/contact" target="_blank" style="color: #64748b; text-decoration: none; font-weight: 500; margin: 0 12px; padding: 8px 12px; border-radius: 6px; background: rgba(100, 116, 139, 0.1);">📧 Support</a>
                    <a href="https://neuralnexus.biz/privacy" target="_blank" style="color: #64748b; text-decoration: none; font-weight: 500; margin: 0 12px; padding: 8px 12px; border-radius: 6px; background: rgba(100, 116, 139, 0.1);">🔒 Privacy</a>
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

/**
 * Generate a stylish payment confirmation email template
 */
function generatePaymentConfirmationEmail(
  name: string = 'there', 
  planName: string = 'Pro Plan', 
  amount: string = '$19.99', 
  date: string = new Date().toLocaleDateString(), 
  invoiceUrl: string = 'https://neuralnexus.biz/invoices/latest'
): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Payment Confirmation - Neural Nexus</title>
      <!--[if mso]>
      <style type="text/css">
        body, table, td {font-family: 'Segoe UI', Arial, sans-serif !important;}
      </style>
      <![endif]-->
    </head>
    <body style="margin: 0; padding: 0; background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 30%, #f8fafc 70%, #ecfdf5 100%); font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Arial, sans-serif;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 30%, #f8fafc 70%, #ecfdf5 100%); min-height: 100vh;">
        <tr>
          <td align="center" style="padding: 30px 20px;">
            <!-- Email Container -->
            <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 60px rgba(16, 185, 129, 0.15), 0 10px 30px rgba(16, 185, 129, 0.1); max-width: 600px; margin: 0 auto; border: 1px solid rgba(255,255,255,0.2);">
              
              <!-- Header with Logo -->
              <tr>
                <td align="center" style="padding: 50px 40px 40px 40px; background: linear-gradient(135deg, #047857 0%, #10b981 50%, #34d399 100%); position: relative; overflow: hidden;">
                  <div style="position: relative; z-index: 1;">
                    <img src="https://d375w6nzl58bw0.cloudfront.net/uploads/14106ffa6e1deecf68d9f8eaa9b3953bf4e7d886eb23a5d7b729e2b8490a5f51.jpeg" alt="Neural Nexus Logo" width="120" style="display: block; margin: 0 auto 20px; border-radius: 50%; border: 3px solid rgba(16, 185, 129, 0.4); box-shadow: 0 10px 30px rgba(16, 185, 129, 0.4), 0 5px 15px rgba(16, 185, 129, 0.2);" onerror="this.src='https://via.placeholder.com/120x120/10b981/ffffff?text=NN';">
                    <h1 style="color: white; margin: 0; font-size: 32px; font-weight: 700; letter-spacing: 1px; text-shadow: 0 4px 12px rgba(5, 150, 105, 0.5), 0 2px 6px rgba(5, 150, 105, 0.3); margin-bottom: 8px;">Neural Nexus</h1>
                    <p style="color: rgba(255,255,255,0.95); margin: 0; font-size: 18px; font-weight: 300; letter-spacing: 0.5px;">Payment Confirmation</p>
                  </div>
                </td>
              </tr>
              
              <!-- Message Section -->
              <tr>
                <td style="padding: 50px 40px 30px 40px; text-align: center;">
                  <h2 style="margin: 0 0 20px 0; color: #1e293b; font-size: 28px; font-weight: 700;">
                    <span style="display: inline-block; margin-right: 10px; transform: translateY(5px);">✅</span>
                    Payment Successful!
                  </h2>
                  <p style="margin: 0 0 25px 0; color: #475569; font-size: 18px; line-height: 1.7; font-weight: 400;">
                    Hey ${name}, thanks for your payment! We've received ${amount} for your ${planName} subscription. You're all set to continue enjoying our premium features.
                  </p>
                  <div style="margin: 0 0 30px 0; padding: 25px; background: linear-gradient(135deg, #ecfdf5, #d1fae5); border-radius: 12px; border-left: 4px solid #10b981; box-shadow: 0 2px 10px rgba(16, 185, 129, 0.1);">
                    <p style="margin: 0; color: #064e3b; font-size: 16px; line-height: 1.6; font-weight: 500;">
                      <strong style="font-size: 18px; display: block; margin-bottom: 10px;">Receipt Details</strong>
                      <span style="display: block; margin-bottom: 5px;"><strong>Plan:</strong> ${planName}</span>
                      <span style="display: block; margin-bottom: 5px;"><strong>Amount:</strong> ${amount}</span>
                      <span style="display: block;"><strong>Date:</strong> ${date}</span>
                    </p>
                  </div>
                </td>
              </tr>
              
              <!-- Invoice Link -->
              <tr>
                <td style="padding: 0 40px 40px 40px; text-align: center;">
                  <table role="presentation" border="0" cellspacing="0" cellpadding="0" style="margin: 0 auto;">
                    <tr>
                      <td style="background: linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%); border-radius: 12px; text-align: center; box-shadow: 0 8px 30px rgba(16, 185, 129, 0.3), 0 4px 15px rgba(5, 150, 105, 0.2); position: relative; overflow: hidden;">
                        <div style="position: absolute; inset: 0; background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%);"></div>
                        <a href="${invoiceUrl}" target="_blank" style="position: relative; z-index: 1; display: inline-block; padding: 16px 32px; color: white; text-decoration: none; font-weight: 600; font-size: 16px; letter-spacing: 0.5px; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">
                          View Invoice
                        </a>
                      </td>
                    </tr>
                  </table>
                  <p style="margin: 20px 0 0 0; color: #64748b; font-size: 14px; text-align: center;">
                    Need help with billing? <a href="https://neuralnexus.biz/contact" style="color: #10b981; text-decoration: underline; font-weight: 500;">Contact our support team</a>.
                  </p>
                </td>
              </tr>
              
              <!-- What's Included Section -->
              <tr>
                <td style="padding: 0 40px 40px 40px;">
                  <div style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border-radius: 16px; padding: 30px; border: 1px solid #e2e8f0;">
                    <h3 style="margin: 0 0 20px 0; color: #1e293b; font-size: 20px; font-weight: 600; text-align: center;">What's Included in Your Plan 🎁</h3>
                    
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td style="padding: 15px 0;">
                          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                            <tr>
                              <td width="60" valign="top">
                                <div style="width: 50px; height: 50px; background: linear-gradient(135deg, #10b981, #059669); border-radius: 12px; display: flex; align-items: center; justify-content: center; margin: 0 auto; box-shadow: 0 8px 20px rgba(16, 185, 129, 0.2);">
                                  <span style="color: white; font-size: 24px;">✨</span>
                                </div>
                              </td>
                              <td style="padding-left: 15px;">
                                <h4 style="margin: 0 0 5px 0; color: #1e293b; font-size: 18px; font-weight: 600;">Premium AI Models</h4>
                                <p style="margin: 0; color: #64748b; font-size: 15px; line-height: 1.5;">
                                  Access to all our top-tier AI models with higher usage limits.
                                </p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      
                      <tr>
                        <td style="padding: 15px 0;">
                          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                            <tr>
                              <td width="60" valign="top">
                                <div style="width: 50px; height: 50px; background: linear-gradient(135deg, #10b981, #059669); border-radius: 12px; display: flex; align-items: center; justify-content: center; margin: 0 auto; box-shadow: 0 8px 20px rgba(16, 185, 129, 0.2);">
                                  <span style="color: white; font-size: 24px;">👑</span>
                                </div>
                              </td>
                              <td style="padding-left: 15px;">
                                <h4 style="margin: 0 0 5px 0; color: #1e293b; font-size: 18px; font-weight: 600;">Priority Support</h4>
                                <p style="margin: 0; color: #64748b; font-size: 15px; line-height: 1.5;">
                                  Front-of-the-line customer service and technical assistance.
                                </p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      
                      <tr>
                        <td style="padding: 15px 0;">
                          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                            <tr>
                              <td width="60" valign="top">
                                <div style="width: 50px; height: 50px; background: linear-gradient(135deg, #10b981, #059669); border-radius: 12px; display: flex; align-items: center; justify-content: center; margin: 0 auto; box-shadow: 0 8px 20px rgba(16, 185, 129, 0.2);">
                                  <span style="color: white; font-size: 24px;">🚀</span>
                                </div>
                              </td>
                              <td style="padding-left: 15px;">
                                <h4 style="margin: 0 0 5px 0; color: #1e293b; font-size: 18px; font-weight: 600;">Early Access</h4>
                                <p style="margin: 0; color: #64748b; font-size: 15px; line-height: 1.5;">
                                  Be the first to try new features before they're released to the public.
                                </p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </div>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="padding: 30px 40px 40px 40px; text-align: center; background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 30%, #f8fafc 70%, #ecfdf5 100%);">
                  <p style="margin: 0 0 20px 0; color: #1e293b; font-size: 18px; line-height: 1.7; font-weight: 600;">
                    Thank you for your support!<br>
                    <span style="color: #64748b; font-weight: 400;">The Neural Nexus Squad</span>
                  </p>
                  
                  <!-- Social Links -->
                  <div style="margin-bottom: 25px;">
                    <a href="https://github.com/Drago-03/Neural-Nexus" target="_blank" style="display: inline-block; margin: 0 12px;">
                      <img src="https://cdn-icons-png.flaticon.com/512/25/25231.png" alt="GitHub" width="32" height="32" style="border-radius: 8px; box-shadow: 0 4px 15px rgba(67, 56, 202, 0.3);">
                    </a>
                    <a href="https://discord.gg/9bPsjgnJ5v" target="_blank" style="display: inline-block; margin: 0 12px;">
                      <img src="https://cdn-icons-png.flaticon.com/512/5968/5968756.png" alt="Discord" width="32" height="32" style="border-radius: 8px; box-shadow: 0 4px 15px rgba(88, 101, 242, 0.3);">
                    </a>
                  </div>
                  
                  <!-- Footer Links -->
                  <p style="margin: 0; font-size: 14px; color: #94a3b8; line-height: 1.8;">
                    <a href="https://neuralnexus.biz/contact" target="_blank" style="color: #64748b; text-decoration: none; font-weight: 500; margin: 0 12px; padding: 8px 12px; border-radius: 6px; background: rgba(100, 116, 139, 0.1);">📧 Support</a>
                    <a href="https://neuralnexus.biz/privacy" target="_blank" style="color: #64748b; text-decoration: none; font-weight: 500; margin: 0 12px; padding: 8px 12px; border-radius: 6px; background: rgba(100, 116, 139, 0.1);">🔒 Privacy</a>
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

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
      const host = process.env.EMAIL_SERVER_HOST || process.env.SENDGRID_HOST || 'smtp.sendgrid.net';
      const user = process.env.EMAIL_SERVER_USER || process.env.SENDGRID_USER || 'apikey';
      const pass = process.env.EMAIL_SERVER_PASSWORD || process.env.SENDGRID_API_KEY;
      const port = parseInt(process.env.EMAIL_SERVER_PORT || process.env.SENDGRID_PORT || '587');
      const from = process.env.EMAIL_FROM || this.DEFAULT_FROM;
      
      console.log('📧 Email configuration:');
      console.log(`- Host: ${host}`);
      console.log(`- User: ${user ? '****' : 'NOT SET'}`);
      console.log(`- Password: ${pass ? '****' : 'NOT SET'}`);
      console.log(`- Port: ${port}`);
      console.log(`- From: ${from}`);
      
      if (!pass) {
        console.warn('⚠️ Missing SMTP password/API key. Falling back to local transport.');
        // In production, log a more serious warning
        if (process.env.NODE_ENV === 'production') {
          console.error('❌ CRITICAL: Missing SMTP API key in production!');
        }
        this.setupLocalTransport();
        return;
      }
      
      // Create a transporter using SMTP
      console.log(`Creating SMTP transport for ${host}:${port}`);
      this.transporter = nodemailer.createTransport({
        host: host,
        port: port,
        secure: port === 465, // true for 465, false for other ports
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
      
      // Verify connection immediately
      this.verifyConnection().then(isConnected => {
        if (!isConnected) {
          console.error('❌ SMTP verification failed!');
          if (process.env.NODE_ENV === 'production') {
            console.error('❌ CRITICAL: SMTP verification failed in production!');
          }
        } else {
          console.log('✅ SMTP connection verified successfully');
        }
      });
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
    const html = generateAccountDeletionEmail(confirmationLink);
    
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
  static getStatus(): EmailServiceStatus & { 
    diagnostics: {
      env: string;
      smtpHost?: string;
      smtpPort?: string;
      fromEmail?: string;
      hasApiKey: boolean;
      lastError?: string;
      lastSendAttempt?: string;
    } 
  } {
    const host = process.env.EMAIL_SERVER_HOST || process.env.SENDGRID_HOST;
    const port = process.env.EMAIL_SERVER_PORT || process.env.SENDGRID_PORT;
    const fromEmail = process.env.EMAIL_FROM;
    const hasApiKey = Boolean(process.env.EMAIL_SERVER_PASSWORD || process.env.SENDGRID_API_KEY);
    
    return {
      initialized: this.initialized,
      transportType: this.transportType,
      error: this.authError ? this.authError.message : null,
      diagnostics: {
        env: process.env.NODE_ENV || 'unknown',
        smtpHost: host,
        smtpPort: port,
        fromEmail,
        hasApiKey,
        lastError: this.authError ? `${this.authError.name}: ${this.authError.message}` : undefined,
      }
    };
  }
  
  /**
   * Sends a newsletter welcome email
   */
  static async sendNewsletterWelcome(email: string, name: string = 'Awesome User'): Promise<boolean> {
    const subject = '🔥 Welcome to the Neural Nexus Newsletter!';
    const html = generateNewsletterWelcomeEmail(name);
    
    return this.yeetEmail({
      to: email,
      subject,
      html
    });
  }
  
  /**
   * Send an email verification message
   */
  async sendVerificationEmail(to: string, verificationLink: string): Promise<boolean> {
    try {
      console.log(`Sending verification email to ${to}...`);
      
      const html = generateVerificationEmail(verificationLink);
      const subject = "Verify Your Email - Neural Nexus";
      
      const result = await EmailService.sendEmail({
        to,
        subject,
        html,
        from: process.env.EMAIL_FROM || 'noreply@neuralnexus.biz'
      });
      
      console.log(`Verification email sent successfully to ${to}`);
      return result;
    } catch (error) {
      console.error('Failed to send verification email:', error);
      return false;
    }
  }
  
  /**
   * Send an account activation confirmation email
   */
  async sendAccountActivationEmail(to: string, firstName: string): Promise<boolean> {
    try {
      console.log(`Sending account activation confirmation email to ${to}...`);
      
      const html = generateAccountActivationEmail(firstName);
      const subject = "Your Account is Active! - Neural Nexus";
      
      const result = await EmailService.sendEmail({
        to,
        subject,
        html,
        from: process.env.EMAIL_FROM || 'noreply@neuralnexus.biz'
      });
      
      console.log(`Account activation email sent successfully to ${to}`);
      return result;
    } catch (error) {
      console.error('Failed to send account activation email:', error);
      return false;
    }
  }
  
  /**
   * Send a subscription cancellation confirmation email
   */
  async sendSubscriptionCancellationEmail(to: string, name: string = 'there', subscriptionDetails: string = 'Pro Plan'): Promise<boolean> {
    try {
      console.log(`Sending subscription cancellation email to ${to}...`);
      
      const html = generateSubscriptionCancellationEmail(name, subscriptionDetails);
      const subject = "Your Subscription Has Been Cancelled - Neural Nexus";
      
      const result = await EmailService.sendEmail({
        to,
        subject,
        html,
        from: process.env.EMAIL_FROM || 'noreply@neuralnexus.biz'
      });
      
      console.log(`Subscription cancellation email sent successfully to ${to}`);
      return result;
    } catch (error) {
      console.error('Failed to send subscription cancellation email:', error);
      return false;
    }
  }
  
  /**
   * Send a payment confirmation email
   */
  async sendPaymentConfirmationEmail(
    to: string, 
    name: string = 'there', 
    planName: string = 'Pro Plan', 
    amount: string = '$19.99', 
    date: string = new Date().toLocaleDateString(), 
    invoiceUrl: string = 'https://neuralnexus.biz/invoices/latest'
  ): Promise<boolean> {
    try {
      console.log(`Sending payment confirmation email to ${to}...`);
      
      const html = generatePaymentConfirmationEmail(name, planName, amount, date, invoiceUrl);
      const subject = "Payment Confirmation - Neural Nexus";
      
      const result = await EmailService.sendEmail({
        to,
        subject,
        html,
        from: process.env.EMAIL_FROM || 'noreply@neuralnexus.biz'
      });
      
      console.log(`Payment confirmation email sent successfully to ${to}`);
      return result;
    } catch (error) {
      console.error('Failed to send payment confirmation email:', error);
      return false;
    }
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