-- SQL script to update Supabase auth settings
-- To use this script:
-- 1. Go to the Supabase dashboard
-- 2. Open the SQL Editor
-- 3. Paste this script and execute it
-- 4. This will update your OAuth display name

-- Update the site_url and app_name in auth.config
UPDATE auth.config
SET 
  site_url = 'https://neuralnexus.biz',
  app_name = 'Neural Nexus'
WHERE id = 1;

-- Update the OAuth provider settings if needed
UPDATE auth.providers
SET 
  redirect_url = 'https://neuralnexus.biz/auth/callback'
WHERE provider_id IN ('google', 'github');

-- Confirm the changes
SELECT site_url, app_name FROM auth.config WHERE id = 1; 