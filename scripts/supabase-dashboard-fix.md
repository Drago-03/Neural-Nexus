# Fix Supabase OAuth Display Name

Follow these simple steps to fix the "Sign in to gtqeeihydjqvidqleawe.supabase.co" issue when users authenticate with Google:

## Method 1: Using the Supabase Dashboard UI (Recommended)

### Step 1: Access Supabase Dashboard
1. Go to [https://app.supabase.com/](https://app.supabase.com/)
2. Sign in and select your project (Neural Nexus)

### Step 2: Update Auth Settings
1. In the left sidebar, click on **Authentication**
2. Click on **URL Configuration**
3. Set the **Site URL** to: `https://neuralnexus.biz`
4. Under **Redirect URLs**, add:
   - `https://neuralnexus.biz/auth/callback`
   - `http://localhost:3000/auth/callback` (for local development)
5. Click **Save**

### Step 3: Update Google Provider Settings
1. In the left sidebar, under Authentication, click on **Providers**
2. Find **Google** in the list and click to edit it
3. Make sure it's **enabled**
4. Set the **Redirect URL** to: `https://neuralnexus.biz/auth/callback`
5. Verify your Client ID and Client Secret match what's in your .env.local file
6. Click **Save**

### Step 4: Update Project Settings
1. In the left sidebar, click on **Project Settings**
2. Under **General** tab, find the **Project Name** field
3. Update it to: `Neural Nexus`
4. Click **Save**

### Step 5: Test the Changes
1. Open an incognito/private browser window
2. Go to your app's sign-in page
3. Click "Continue with Google"
4. Verify that the OAuth consent screen now shows "Sign in to Neural Nexus"

## Important Notes

1. It may take a few minutes for the changes to fully propagate in Google's OAuth system
2. If it still doesn't work, check that the Client ID and Client Secret match the ones in your Google Cloud Console
3. Make sure the authorized redirect URIs in Google Cloud Console include `https://neuralnexus.biz/auth/callback` and match what you set in Supabase

## If You Still See Issues

If you're still seeing the wrong display name in the Google OAuth screen, you might need to clear your browser cache and cookies, or try a different browser. 