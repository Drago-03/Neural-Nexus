#!/usr/bin/env node

/**
 * Setup Google Cloud Storage Authentication
 * 
 * This script helps set up authentication for Google Cloud Storage
 * by creating a service account key file from environment variables.
 * 
 * Usage:
 *   node scripts/setup-gcs-auth.js
 * 
 * Environment variables needed:
 *   - GOOGLE_CLOUD_PROJECT_ID
 *   - GOOGLE_CLOUD_CLIENT_EMAIL
 *   - GOOGLE_CLOUD_PRIVATE_KEY (or will use ACCESS_KEY/SECRET_KEY combo)
 *   - GOOGLE_CLOUD_ACCESS_KEY (optional)
 *   - GOOGLE_CLOUD_SECRET_KEY (optional)
 */

const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

// Check if dotenv is available
try {
  require('dotenv');
} catch (error) {
  console.error('❌ dotenv package is required. Install it with: npm install dotenv');
  process.exit(1);
}

// Function to mask sensitive information
function maskSecret(secret) {
  if (!secret) return 'not set';
  return secret.substring(0, 4) + '...' + secret.substring(secret.length - 4);
}

// Main function
async function setupGCSAuth() {
  console.log('🔧 Setting up Google Cloud Storage authentication...');
  
  // Get environment variables
  const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
  const clientEmail = process.env.GOOGLE_CLOUD_CLIENT_EMAIL || process.env.GOOGLE_CLOUD_SERVICE_ACCOUNT;
  let privateKey = process.env.GOOGLE_CLOUD_PRIVATE_KEY?.replace(/\\n/g, '\n');
  const accessKey = process.env.GOOGLE_CLOUD_ACCESS_KEY;
  const secretKey = process.env.GOOGLE_CLOUD_SECRET_KEY;
  const bucketName = process.env.GOOGLE_CLOUD_STORAGE_BUCKET;
  
  // Check required variables
  if (!projectId) {
    console.error('❌ GOOGLE_CLOUD_PROJECT_ID is required');
    process.exit(1);
  }
  
  if (!bucketName) {
    console.error('❌ GOOGLE_CLOUD_STORAGE_BUCKET is required');
    process.exit(1);
  }
  
  // Print configuration
  console.log('📋 Google Cloud Storage Configuration:');
  console.log(`- Project ID: ${projectId}`);
  console.log(`- Bucket: ${bucketName}`);
  console.log(`- Client Email: ${clientEmail || 'not set'}`);
  console.log(`- Private Key: ${privateKey ? 'set' : 'not set'}`);
  console.log(`- Access Key: ${accessKey ? maskSecret(accessKey) : 'not set'}`);
  console.log(`- Secret Key: ${secretKey ? '********' : 'not set'}`);
  
  // Create service account key file
  const keyFilePath = path.join(process.cwd(), 'gcloud-key.json');
  
  // If we have a client email and private key, create a standard service account key file
  if (clientEmail && privateKey) {
    const keyFileContent = {
      type: 'service_account',
      project_id: projectId,
      private_key: privateKey,
      client_email: clientEmail,
      client_id: '',
      auth_uri: 'https://accounts.google.com/o/oauth2/auth',
      token_uri: 'https://oauth2.googleapis.com/token',
      auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
      client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${encodeURIComponent(clientEmail)}`
    };
    
    fs.writeFileSync(keyFilePath, JSON.stringify(keyFileContent, null, 2));
    console.log(`✅ Created service account key file: ${keyFilePath}`);
  }
  // If we have access key and secret key, create a HMAC key file
  else if (accessKey && secretKey) {
    const hmacKeyContent = {
      type: 'hmac_key',
      project_id: projectId,
      private_key: secretKey,
      client_email: accessKey,
      access_key_id: accessKey,
      secret_access_key: secretKey
    };
    
    fs.writeFileSync(keyFilePath, JSON.stringify(hmacKeyContent, null, 2));
    console.log(`✅ Created HMAC key file: ${keyFilePath}`);
  } 
  // No valid credentials
  else {
    console.error('❌ No valid credentials found. Please provide either:');
    console.error('   - GOOGLE_CLOUD_CLIENT_EMAIL and GOOGLE_CLOUD_PRIVATE_KEY');
    console.error('   - GOOGLE_CLOUD_ACCESS_KEY and GOOGLE_CLOUD_SECRET_KEY');
    process.exit(1);
  }
  
  // Set environment variable for Google Cloud
  console.log('🔑 Setting GOOGLE_APPLICATION_CREDENTIALS environment variable');
  console.log(`   export GOOGLE_APPLICATION_CREDENTIALS="${keyFilePath}"`);
  
  // Write to .env.local if it exists
  try {
    let envContent = '';
    if (fs.existsSync('.env.local')) {
      envContent = fs.readFileSync('.env.local', 'utf8');
    }
    
    // Check if GOOGLE_APPLICATION_CREDENTIALS is already set
    if (!/GOOGLE_APPLICATION_CREDENTIALS=/.test(envContent)) {
      envContent += `\nGOOGLE_APPLICATION_CREDENTIALS="${keyFilePath}"\n`;
      fs.writeFileSync('.env.local', envContent);
      console.log('✅ Added GOOGLE_APPLICATION_CREDENTIALS to .env.local');
    } else {
      console.log('ℹ️ GOOGLE_APPLICATION_CREDENTIALS already exists in .env.local');
    }
  } catch (error) {
    console.error('❌ Failed to update .env.local:', error);
  }
  
  console.log('\n🎉 Google Cloud Storage authentication setup complete!');
  console.log('📝 Next steps:');
  console.log('   1. Restart your application to use the new credentials');
  console.log('   2. Test the connection with: node scripts/test-gcs-config.js');
}

// Run the setup
setupGCSAuth().catch(error => {
  console.error('❌ Setup failed:', error);
  process.exit(1);
}); 