/**
 * Direct database update script for Supabase auth settings
 * 
 * This script uses the pg client to directly connect to the Supabase database
 * and update the auth settings to fix the OAuth display name issue.
 */

require('dotenv').config({ path: '.env.local' });
const { Client } = require('pg');

// Configuration from environment and provided credentials
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'Neural Nexus';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://neuralnexus.biz';
const DB_HOST = 'db.gtqeeihydjqvidqleawe.supabase.co';
const DB_PORT = 5432;
const DB_NAME = 'postgres';
const DB_USER = 'postgres';
const DB_PASSWORD = process.env.SUPABASE_DB_PASSWORD;

if (!DB_PASSWORD) {
  console.error('⚠️ SUPABASE_DB_PASSWORD is not set in .env.local');
  process.exit(1);
}

async function updateAuthSettings() {
  console.log('🔄 Connecting directly to Supabase database...');
  console.log(`Site URL: ${SITE_URL}`);
  console.log(`Site Name: ${SITE_NAME}`);
  
  // Create a database client
  const client = new Client({
    host: DB_HOST,
    port: DB_PORT,
    database: DB_NAME,
    user: DB_USER,
    password: DB_PASSWORD,
    ssl: {
      rejectUnauthorized: false
    }
  });
  
  try {
    // Connect to database
    await client.connect();
    console.log('✅ Connected to database successfully');
    
    // Update auth.config table
    console.log('📝 Updating auth.config table...');
    const updateAuthConfig = await client.query(`
      UPDATE auth.config
      SET 
        site_url = $1,
        app_name = $2
      WHERE id = 1
      RETURNING site_url, app_name;
    `, [SITE_URL, SITE_NAME]);
    
    if (updateAuthConfig.rowCount > 0) {
      console.log('✅ Auth config updated successfully:', updateAuthConfig.rows[0]);
    } else {
      console.log('⚠️ No auth config found to update');
    }
    
    // Update OAuth providers
    console.log('📝 Updating auth providers...');
    const updateProviders = await client.query(`
      UPDATE auth.providers
      SET redirect_url = $1
      WHERE provider_id IN ('google', 'github')
      RETURNING provider_id, redirect_url;
    `, [`${SITE_URL}/auth/callback`]);
    
    if (updateProviders.rowCount > 0) {
      console.log(`✅ Updated ${updateProviders.rowCount} auth providers:`, updateProviders.rows);
    } else {
      console.log('⚠️ No auth providers found to update');
    }
    
    console.log('');
    console.log('✨ OAuth display name update complete!');
    console.log('✨ Your OAuth login will now display as:', SITE_NAME);
    console.log('✨ It may take a few minutes for changes to take effect');
    
  } catch (error) {
    console.error('❌ Error updating database:', error.message);
  } finally {
    // Close the database connection
    await client.end();
  }
}

updateAuthSettings(); 