-- Function to get user count from auth.users table
-- Run this in the Supabase SQL editor

-- Create a new function to get the count of users
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

-- Add comment to explain function
COMMENT ON FUNCTION public.get_user_count() IS 'Safely returns the count of registered users'; 