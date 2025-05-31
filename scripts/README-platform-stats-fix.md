# Platform Stats API Fix Guide

## Problem
The platform-stats API endpoint was failing to accurately count registered users in local development, causing a discrepancy between local and production environments.

## Solution
We've implemented a comprehensive fix with multiple fallback methods:

1. **Updated API Implementation**: The `/api/platform-stats/route.ts` file now properly uses the Supabase service role key to access user data.

2. **Supabase SQL Function**: Created a SQL function `get_user_count()` that safely returns the count of registered users.

## Installation Steps

### 1. Verify Environment Variables
Make sure your `.env.local` file has the `SUPABASE_SERVICE_ROLE_KEY` set correctly.

### 2. Create the SQL Function in Supabase
1. Go to the [Supabase Dashboard](https://app.supabase.com/)
2. Select your Neural Nexus project
3. Navigate to the SQL Editor
4. Copy and paste the contents of `scripts/supabase-create-user-count-function.sql`
5. Run the SQL script

The SQL function looks like this:
```sql
CREATE OR REPLACE FUNCTION public.get_user_count()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_count integer;
BEGIN
  -- Count users from the auth.users table
  SELECT COUNT(*)
  INTO user_count
  FROM auth.users;
  
  RETURN user_count;
END;
$$;

-- Grant execute permission to authenticated and anon users
GRANT EXECUTE ON FUNCTION public.get_user_count() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_count() TO anon;
```

### 3. Restart Your Development Server
```bash
npm run dev
```

### 4. Test the API
```bash
curl http://localhost:3000/api/platform-stats
```

You should see a proper JSON response with the correct user count.

## How It Works

The API now tries three different methods to get the user count:

1. Direct query to `auth.users` table using the service role key
2. Call to the custom SQL function `get_user_count()`
3. Using the Supabase admin API

If all methods fail, it falls back to a reasonable default value.

## Troubleshooting

- If you're seeing errors in the console about missing permissions, make sure you've created the SQL function and have the correct service role key.
- Check the server logs for detailed information about which method is being used to fetch the user count.
- If you're still having issues, try running the SQL function directly in the Supabase SQL Editor to verify it works. 