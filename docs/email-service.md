# Neural Nexus Email Service Documentation

This document explains how to use the SMTP email service in the Neural Nexus application.

## Setup

1. **Install Dependencies**:
   ```bash
   npm install nodemailer
   ```

2. **Environment Variables**:
   Add these variables to your `.env.local` file:
   ```
   # SMTP Configuration
   EMAIL_SERVER_HOST=smtp.sendgrid.net
   EMAIL_SERVER_PORT=465
   EMAIL_SERVER_USER=apikey
   EMAIL_SERVER_PASSWORD=your_sendgrid_api_key_or_smtp_password
   EMAIL_FROM=your_verified_sender_email@example.com
   
   # Optional: SendGrid API Key (for backward compatibility)
   SENDGRID_API_KEY=your_sendgrid_api_key
   ```

3. **Sender Verification**:
   If using SendGrid as your SMTP provider, you need to verify your sender identity.
   Visit [SendGrid Sender Identity](https://sendgrid.com/docs/for-developers/sending-email/sender-identity/) to learn more.

## Features

- **SMTP Email Delivery**: Send emails via SMTP server (production default)
- **Local Development Mode**: Logs emails to console instead of sending them (development default)
- **Automatic Fallback**: Falls back to local transport if SMTP fails
- **Email Templates**: Pre-built templates for common emails
- **Status Monitoring**: API endpoint to check email service status

## Usage

The email service provides several methods for sending different types of emails:

### Basic Email

```typescript
import { EmailService } from '@/lib/services/email-service';

// Send a basic email
await EmailService.sendEmail({
  to: 'recipient@example.com',
  subject: 'Hello from Neural Nexus',
  html: '<h1>This is a test email</h1><p>Hello world!</p>'
});
```

### Welcome Email

```typescript
import { EmailService } from '@/lib/services/email-service';

// Send a welcome email
await EmailService.sendWelcomeVibes(
  'user@example.com',
  'John Doe'
);
```

### Password Reset Email

```typescript
import { EmailService } from '@/lib/services/email-service';

// Send a password reset email
await EmailService.sendPasswordResetLink(
  'user@example.com',
  'https://neuralnexus.biz/reset-password?token=abc123'
);
```

### Account Deletion Confirmation

```typescript
import { EmailService } from '@/lib/services/email-service';

// Send account deletion confirmation
await EmailService.sendAccountDeletionConfirmation(
  'user@example.com',
  'https://neuralnexus.biz/confirm-deletion?token=abc123'
);
```

### Email Verification

```typescript
import { EmailService } from '@/lib/services/email-service';

// Send email verification
await EmailService.sendVerificationVibes(
  'user@example.com',
  'https://neuralnexus.biz/verify-email?token=abc123'
);
```

## Development Mode

In development mode (`NODE_ENV=development`), emails are not actually sent but logged to the console. This helps with testing without sending real emails.

To force sending emails in development mode, set the environment variable:
```
FORCE_EMAIL_SEND=true
```

## Local Transport Fallback

The email service automatically falls back to a local transport (logging emails to console) in the following cases:
1. In development mode
2. When SMTP credentials are missing
3. When SMTP authentication fails
4. When SMTP connection verification fails

This ensures that your application continues to function even if the email service is not properly configured.

## Testing

You can test the email service using the provided test scripts:

```bash
# Test SMTP configuration
node scripts/test-smtp.js your.email@example.com

# Check email service status via API
curl http://localhost:3000/api/email/status

# Verify SMTP connection via API
curl -X POST http://localhost:3000/api/email/status
```

## Using Different SMTP Providers

The email service is configured to work with any SMTP provider. Here are some common configurations:

### SendGrid

```
EMAIL_SERVER_HOST=smtp.sendgrid.net
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=apikey
EMAIL_SERVER_PASSWORD=your_sendgrid_api_key
```

### Gmail

```
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=465
EMAIL_SERVER_USER=your.email@gmail.com
EMAIL_SERVER_PASSWORD=your_app_password
```
Note: For Gmail, you need to use an App Password, not your regular password. See [Google Account Help](https://support.google.com/accounts/answer/185833) for instructions.

### Office 365 / Outlook

```
EMAIL_SERVER_HOST=smtp.office365.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your.email@outlook.com
EMAIL_SERVER_PASSWORD=your_password
```

## API Endpoints

The following API endpoints are available for email functionality:

1. **Email Status**: `GET /api/email/status`
   - Returns the current status of the email service
   - Response includes:
     - SMTP configuration details
     - Connection status
     - Transport type (smtp or local)
     - Error message (if any)

2. **Verify Email Connection**: `POST /api/email/status`
   - Tests the SMTP connection and returns the status
   - Response includes:
     - Connection success/failure
     - Transport type
     - Error message (if any)

3. **Test Email**: `POST /api/email/test`
   - Request body: `{ "email": "recipient@example.com" }`
   - Tests the email service by sending a test email

4. **Newsletter Subscription**: `POST /api/newsletter/subscribe`
   - Request body: `{ "email": "recipient@example.com" }`
   - Subscribes a user to the newsletter and sends a welcome email

5. **Password Reset**: `POST /api/auth/reset-password`
   - Request body: `{ "email": "user@example.com" }`
   - Sends a password reset link to the user's email

6. **Account Deletion**: `POST /api/user/delete-account`
   - Requires authentication
   - Sends an account deletion confirmation email to the user

## Troubleshooting

### Authentication Issues

If you're experiencing authentication issues with SendGrid:

1. Verify that your API key is correct and has the necessary permissions
2. Check if the API key has been revoked or expired
3. Ensure that your sender email is verified in SendGrid

### Connection Issues

If you're having trouble connecting to the SMTP server:

1. Check that the host and port are correct
2. Ensure that your network allows outgoing connections on the specified port
3. Try using a different port (587 instead of 465, or vice versa)

### Fallback to Local Transport

If the email service is falling back to local transport:

1. Check the error message in the email service status
2. Verify your SMTP credentials
3. Make sure your sender email is verified
4. Check if your SMTP provider has any restrictions or rate limits 