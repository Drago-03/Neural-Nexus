# Manual Instructions to Fix OAuth Display Name

These instructions will help you fix the OAuth display name in your Supabase project, so that when users sign in with Google, they'll see "Sign in to Neural Nexus" instead of "Sign in to gtqeeihydjqvidqleawe.supabase.co".

## Step 1: Access the Supabase Dashboard

1. Go to [https://app.supabase.com/](https://app.supabase.com/)
2. Sign in with your credentials
3. Select your project: "Neural-Nexus" (or the project with ID `gtqeeihydjqvidqleawe`)

## Step 2: Open the SQL Editor

1. In the left sidebar, click on "SQL Editor"
2. Click the "+" button to create a new SQL query

## Step 3: Run the SQL Commands

Copy and paste the following SQL into the editor:

```sql
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
```

4. Click the "Run" button to execute the SQL

## Step 4: Verify the Changes

After running the SQL, you should see a result showing:

```
site_url             | app_name
---------------------|------------
https://neuralnexus.biz | Neural Nexus
```

## Step 5: Configure Auth Settings in Supabase Dashboard

1. In the left sidebar, click on "Authentication"
2. Click on "URL Configuration" 
3. Set the "Site URL" to `https://neuralnexus.biz`
4. Add the following URLs to the "Redirect URLs" list:
   - `https://neuralnexus.biz/auth/callback`
   - `https://neuralnexus.biz/dashboard`
   - `http://localhost:3000/auth/callback` (for local development)
5. Click "Save"

## Step 6: Configure Google OAuth Provider

1. In the Authentication section, click on "Providers"
2. Find "Google" in the list and click to edit it
3. Make sure it's enabled
4. Set the "Redirect URL" to: `https://neuralnexus.biz/auth/callback`
5. Make sure your Client ID and Client Secret are set correctly:
   - Client ID: `162793081801-ck7bq03g2dvtf5m6j3lcnlp4jv2a94ic.apps.googleusercontent.com`
   - Client Secret: Your secret from .env.local
6. Click "Save"

## Step 7: Test the Changes

1. Open an incognito/private browser window
2. Go to your app's sign-in page
3. Click "Continue with Google"
4. Verify that the OAuth consent screen now shows "Sign in to Neural Nexus" instead of the Supabase project ID

## Note

It may take a few minutes for the changes to fully propagate in Google's OAuth system. If you still see the old project ID, wait about 5-10 minutes and try again. 