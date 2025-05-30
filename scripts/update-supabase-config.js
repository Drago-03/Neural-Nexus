/**
 * update-supabase-config.js
 * 
 * This script directly updates the Supabase Auth settings in the database
 * to fix the OAuth display name issue.
 */

require('dotenv').config({ path: '.env.local' });
const axios = require('axios');

// Get configuration from environment variables
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://gtqeeihydjqvidqleawe.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_ACCESS_TOKEN || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'Neural Nexus';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://neuralnexus.biz';

if (!SUPABASE_KEY) {
  console.error('⚠️ SUPABASE_ACCESS_TOKEN is not set.');
  process.exit(1);
}

async function updateSupabaseConfig() {
  console.log('🔄 Updating Supabase Auth settings directly...');
  console.log(`Site Name: ${SITE_NAME}`);
  console.log(`Site URL: ${SITE_URL}`);
  
  try {
    // Connect to the Supabase Auth settings table directly
    console.log('📝 Updating auth settings in the database...');
    
    // Create a Supabase client
    const supabaseUrl = SUPABASE_URL;
    const supabaseKey = SUPABASE_KEY;
    
    // Update the auth settings using the SQL API
    const response = await axios({
      method: 'POST',
      url: `${supabaseUrl}/rest/v1/rpc/update_auth_settings`,
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      },
      data: {
        p_site_url: SITE_URL,
        p_app_name: SITE_NAME
      }
    });
    
    if (response.status === 200) {
      console.log('✅ Auth settings updated successfully!');
      console.log('✨ Your OAuth login will now display as: ' + SITE_NAME);
      console.log('✨ It may take a few minutes for the changes to take effect');
    } else {
      console.log('⚠️ Unexpected response:', response.status, response.data);
    }
  } catch (error) {
    console.error('❌ Error updating Supabase configuration:');
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error('Response:', error.response.data);
    } else {
      console.error(error.message);
    }
  }
}

// Create a stored procedure to update auth settings
async function createStoredProcedure() {
  try {
    console.log('📝 Creating stored procedure for updating auth settings...');
    
    const response = await axios({
      method: 'POST',
      url: `${SUPABASE_URL}/rest/v1/rpc/create_auth_settings_function`,
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      },
      data: {
        function_sql: `
          CREATE OR REPLACE FUNCTION update_auth_settings(p_site_url text, p_app_name text)
          RETURNS void AS $$
          BEGIN
            UPDATE auth.config
            SET site_url = p_site_url, app_name = p_app_name
            WHERE id = 1;
          END;
          $$ LANGUAGE plpgsql SECURITY DEFINER;
        `
      }
    });
    
    console.log('✅ Stored procedure created!');
    
  } catch (error) {
    console.log('⚠️ Could not create stored procedure. Proceeding with direct update...');
  }
  
  // Continue with the update
  await updateSupabaseConfig();
}

// Execute the script
createStoredProcedure(); 