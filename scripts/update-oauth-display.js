/**
 * Simple script to update Supabase OAuth display name
 * 
 * This script uses the Supabase JavaScript client with the service role key
 * to execute SQL that updates the auth settings directly.
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Configuration from environment variables
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'Neural Nexus';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://neuralnexus.biz';

// Check required environment variables
if (!SUPABASE_URL) {
  console.error('⚠️ NEXT_PUBLIC_SUPABASE_URL is not set in .env.local');
  process.exit(1);
}

if (!SUPABASE_SERVICE_KEY) {
  console.error('⚠️ SUPABASE_SERVICE_ROLE_KEY is not set in .env.local');
  console.error('Please get this from your Supabase dashboard > Project Settings > API');
  process.exit(1);
}

async function updateOAuthDisplay() {
  console.log('🔄 Updating Supabase Auth display settings...');
  console.log(`Site URL: ${SITE_URL}`);
  console.log(`Site Name: ${SITE_NAME}`);
  
  try {
    // Create Supabase client with service role key for admin access
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
      auth: { persistSession: false }
    });
    
    // Run SQL to update auth.config directly
    const { data, error } = await supabase.rpc('exec_sql', {
      query: `
        UPDATE auth.config
        SET 
          site_url = '${SITE_URL}',
          app_name = '${SITE_NAME}'
        WHERE id = 1;
        
        UPDATE auth.providers
        SET 
          redirect_url = '${SITE_URL}/auth/callback'
        WHERE provider_id IN ('google', 'github');
        
        SELECT site_url, app_name FROM auth.config WHERE id = 1;
      `
    });
    
    if (error) {
      throw error;
    }
    
    console.log('✅ Auth settings updated successfully!');
    console.log('✨ Your OAuth login will now display as:', SITE_NAME);
    console.log('✨ It may take a few minutes for changes to take effect');
    
    if (data) {
      console.log('Current settings:', data);
    }
    
  } catch (error) {
    console.error('❌ Error updating settings:', error.message);
    console.log('');
    console.log('Manual steps:');
    console.log('1. Go to your Supabase dashboard');
    console.log('2. Navigate to SQL Editor');
    console.log('3. Run the following SQL:');
    console.log(`
      UPDATE auth.config
      SET 
        site_url = '${SITE_URL}',
        app_name = '${SITE_NAME}'
      WHERE id = 1;
      
      UPDATE auth.providers
      SET 
        redirect_url = '${SITE_URL}/auth/callback'
      WHERE provider_id IN ('google', 'github');
    `);
  }
}

updateOAuthDisplay(); 