# Deploying Platform Stats Fix to Production

This document outlines the steps needed to deploy our platform-stats API fix to the production environment.

## Step 1: Update Environment Variables

Make sure your production environment has the `SUPABASE_SERVICE_ROLE_KEY` set correctly in your hosting platform's environment variables.

### For Vercel:
1. Go to your Vercel dashboard
2. Select the Neural Nexus project
3. Navigate to Settings > Environment Variables
4. Verify that `SUPABASE_SERVICE_ROLE_KEY` is set to the correct value
5. If it's not set or incorrect, add/update it with the value from your `.env.local` file

## Step 2: Create the SQL Function in Supabase

1. Go to the [Supabase Dashboard](https://app.supabase.com/)
2. Select your Neural Nexus project
3. Navigate to the SQL Editor
4. Copy and paste the contents of `scripts/supabase-create-user-count-function.sql`
5. Run the SQL script
6. Verify the function was created successfully by running:
   ```sql
   SELECT get_user_count();
   ```

## Step 3: Deploy Code Changes

Deploy your codebase with the updated platform-stats API route:

### For Vercel or similar platforms:
```bash
git add .
git commit -m "Fix platform stats API to correctly count registered users"
git push
```

The deployment should happen automatically when you push to your main branch.

## Step 4: Verify Deployment

After deployment is complete:

1. Test the production API:
   ```bash
   curl https://neuralnexus.biz/api/platform-stats
   ```

2. Verify that the response includes the correct registered users count

3. Check your logs to ensure the API is using the correct method to fetch the count

## Troubleshooting

If you encounter issues in production:

1. **Check Logs**: Review the logs in your hosting platform to see if there are any errors
2. **Verify SQL Function**: Test the SQL function directly in the Supabase SQL Editor
3. **Check Service Role Key**: Ensure the service role key is correctly set in your environment variables
4. **Temporary Workaround**: If necessary, you can temporarily modify the API to use only the default values until the issue is resolved

## Rollback Plan

If needed, you can revert to the previous version:

```bash
git revert <commit-hash>
git push
```

Replace `<commit-hash>` with the hash of the commit that introduced these changes. 