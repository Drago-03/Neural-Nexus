/**
 * Supabase OAuth display name fix via Management API
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Configuration from environment
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'Neural Nexus';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://neuralnexus.biz';

// Exit if required env vars are missing
if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env.local');
  process.exit(1);
}

async function fixOAuthDisplayName() {
  console.log('🔄 Updating Supabase Auth settings...');
  console.log(`Site URL: ${SITE_URL}`);
  console.log(`App Name: ${SITE_NAME}`);
  
  // Create Supabase client with service role key (admin access)
  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { persistSession: false }
  });
  
  try {
    // Use the Supabase admin API to update auth settings
    const { data: authSettings, error: authError } = await supabase
      .from('_auth_settings')
      .update({
        site_url: SITE_URL,
        app_name: SITE_NAME
      })
      .eq('id', 1);
      
    if (authError) {
      console.error('❌ Error updating auth settings:', authError.message);
      
      // Try alternative method - update auth settings via RPC
      console.log('Trying alternative method...');
      
      const { error: rpcError } = await supabase.rpc('update_auth_settings', {
        p_site_url: SITE_URL,
        p_app_name: SITE_NAME
      });
      
      if (rpcError) {
        console.error('❌ Error updating via RPC:', rpcError.message);
        throw new Error('Failed to update auth settings');
      } else {
        console.log('✅ Auth settings updated via RPC');
      }
    } else {
      console.log('✅ Auth settings updated successfully');
    }
    
    // Update OAuth provider redirect URLs
    const { error: providersError } = await supabase
      .from('auth_providers')
      .update({
        redirect_url: `${SITE_URL}/auth/callback`
      })
      .in('provider_id', ['google', 'github']);
    
    if (providersError) {
      console.error('❌ Error updating provider redirect URLs:', providersError.message);
    } else {
      console.log('✅ OAuth provider redirect URLs updated');
    }
    
    console.log('');
    console.log('✨ Your OAuth login should now display as:', SITE_NAME);
    console.log('✨ It may take a few minutes for changes to take effect');
    
  } catch (error) {
    console.error('❌ Error updating settings:', error.message);
    console.log('');
    console.log('Please manually update the settings in the Supabase dashboard:');
    console.log('1. Go to Authentication > URL Configuration');
    console.log(`2. Set Site URL to: ${SITE_URL}`);
    console.log(`3. Add ${SITE_URL}/auth/callback to Redirect URLs`);
    console.log('4. Go to Authentication > Providers > Google');
    console.log(`5. Set Redirect URL to: ${SITE_URL}/auth/callback`);
  }
}

fixOAuthDisplayName(); 