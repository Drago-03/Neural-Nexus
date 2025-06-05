/**
 * Neural Nexus SendGrid Sender Verification Helper
 * 
 * This script helps with verifying a sender identity in SendGrid.
 * Run with: node scripts/verify-sendgrid-sender.js your.email@example.com "Your Name"
 */

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const sgMail = require('@sendgrid/mail');
const client = require('@sendgrid/client');

// Check if API key is available
if (!process.env.SENDGRID_API_KEY) {
  console.error('❌ SendGrid API key not found in environment variables!');
  console.error('Make sure SENDGRID_API_KEY is set in your .env.local file');
  process.exit(1);
}

// Set API key for both mail and client
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
client.setApiKey(process.env.SENDGRID_API_KEY);

// Get email and name from command line args
const email = process.argv[2];
const name = process.argv[3] || 'Neural Nexus';

if (!email) {
  console.error('❌ No email address provided!');
  console.error('Usage: node scripts/verify-sendgrid-sender.js your.email@example.com "Your Name"');
  process.exit(1);
}

console.log(`🚀 Verifying sender identity for ${email} with name "${name}"`);

// Create sender identity
async function createSender() {
  const data = {
    nickname: `${name} (Neural Nexus)`,
    from_email: email,
    from_name: name,
    reply_to: email,
    reply_to_name: name,
    address: '123 Neural Street',
    address_2: 'Suite AI',
    city: 'San Francisco',
    state: 'CA',
    zip: '94107',
    country: 'United States'
  };

  const request = {
    url: '/v3/verified_senders',
    method: 'POST',
    body: data
  };

  try {
    const [response, body] = await client.request(request);
    console.log('✅ Sender identity creation initiated!');
    console.log('📧 Status code:', response.statusCode);
    console.log('📝 Response body:', body);
    
    if (response.statusCode === 201) {
      console.log('\n🎉 Success! A verification email has been sent to', email);
      console.log('👉 Please check your inbox and click the verification link to complete the process.');
    } else {
      console.log('\n⚠️ The request was processed but returned a non-201 status code.');
      console.log('Please check the response for details.');
    }
  } catch (error) {
    console.error('❌ Error creating sender identity:');
    
    if (error.response) {
      const { statusCode, body } = error.response;
      console.error(`Status code: ${statusCode}`);
      console.error('Error details:', body);
      
      if (statusCode === 400 && body.errors && body.errors.some(e => e.message.includes('already exists'))) {
        console.log('\n⚠️ This email address may already be registered as a sender.');
        console.log('You can check your verified senders in the SendGrid dashboard:');
        console.log('https://app.sendgrid.com/settings/sender_auth/senders');
      }
    } else {
      console.error(error);
    }
  }
}

// Run the function
createSender(); 