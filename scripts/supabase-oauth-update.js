/**
 * Supabase OAuth display name updater
 * 
 * This script uses the Supabase REST API to update the project settings
 * and fix the OAuth display name issue.
 */

require('dotenv').config({ path: '.env.local' });
const axios = require('axios');
const crypto = require('crypto');

// Configuration from environment and provided credentials
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://gtqeeihydjqvidqleawe.supabase.co';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'Neural Nexus';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://neuralnexus.biz';
const PROJECT_ID = 'gtqeeihydjqvidqleawe';

// S3 credentials from your input
const S3_ACCESS_KEY = 'ed21c59f3a4233565311ec25daf2cc4b';
const S3_SECRET_KEY = 'cabbacf308efa81152eceeda52490cfc338ae3d232e3865a0bd86962e121c71a';

// JWT secret from your input
const JWT_SECRET = 'gQJk84GeARSSBX6fhZ2w5wYBi1iKbxAL0M404/cGbRQVsr1V6Zc9S0PayUeQSapcBC24PYP/XHvCPRu21JFwYg==';

// Function to generate HMAC signature for authentication
function generateSignature(payload, secret) {
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(JSON.stringify(payload));
  return hmac.digest('hex');
}

async function updateOAuthDisplayName() {
  console.log('🔄 Updating Supabase project settings...');
  console.log(`Site URL: ${SITE_URL}`);
  console.log(`Site Name: ${SITE_NAME}`);
  
  try {
    // Create a timestamp for the request
    const timestamp = Math.floor(Date.now() / 1000);
    
    // Create payload for authentication
    const payload = {
      project_id: PROJECT_ID,
      timestamp,
      action: 'update_project_settings'
    };
    
    // Generate signature
    const signature = generateSignature(payload, S3_SECRET_KEY);
    
    // First attempt: Update project settings via Management API
    console.log('📝 Attempting to update project settings...');
    
    try {
      const response = await axios({
        method: 'PATCH',
        url: `${SUPABASE_URL}/rest/v1/projects/${PROJECT_ID}/settings`,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'X-Supabase-Signed': signature,
          'X-Supabase-Timestamp': timestamp.toString()
        },
        data: {
          app_name: SITE_NAME,
          site_url: SITE_URL
        }
      });
      
      console.log('✅ Project settings updated successfully!');
      console.log(response.data);
      
    } catch (error) {
      console.log('⚠️ Could not update via Management API:', error.message);
      console.log('Trying alternative approach...');
      
      // Second attempt: Update directly via SQL command
      try {
        console.log('📝 Attempting direct SQL update...');
        
        // Prepare SQL command
        const sqlCommand = `
          UPDATE auth.config 
          SET site_url = '${SITE_URL}', app_name = '${SITE_NAME}' 
          WHERE id = 1;
          
          UPDATE auth.providers
          SET redirect_url = '${SITE_URL}/auth/callback'
          WHERE provider_id IN ('google', 'github');
        `;
        
        // Execute SQL via REST API
        await axios({
          method: 'POST',
          url: `${SUPABASE_URL}/rest/v1/sql`,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'X-Supabase-Signed': signature,
            'X-Supabase-Timestamp': timestamp.toString()
          },
          data: {
            query: sqlCommand
          }
        });
        
        console.log('✅ Auth settings updated via SQL!');
        
      } catch (sqlError) {
        console.log('⚠️ SQL update failed:', sqlError.message);
        throw new Error('Both update methods failed');
      }
    }
    
    console.log('');
    console.log('✨ Your OAuth login should now display as:', SITE_NAME);
    console.log('✨ It may take a few minutes for changes to take effect');
    console.log('');
    console.log('If you still see issues, please run the SQL manually in the Supabase dashboard:');
    console.log(`
      UPDATE auth.config 
      SET site_url = '${SITE_URL}', app_name = '${SITE_NAME}' 
      WHERE id = 1;
      
      UPDATE auth.providers
      SET redirect_url = '${SITE_URL}/auth/callback'
      WHERE provider_id IN ('google', 'github');
    `);
    
  } catch (error) {
    console.error('❌ Error updating OAuth display name:', error.message);
    
    console.log('');
    console.log('Please run this SQL manually in the Supabase dashboard:');
    console.log(`
      UPDATE auth.config 
      SET site_url = '${SITE_URL}', app_name = '${SITE_NAME}' 
      WHERE id = 1;
      
      UPDATE auth.providers
      SET redirect_url = '${SITE_URL}/auth/callback'
      WHERE provider_id IN ('google', 'github');
    `);
  }
}

updateOAuthDisplayName(); 