import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const initSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase credentials');
    return createPlaceholderClient();
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  });
};

// Export the client instance
const supabase = initSupabaseClient();

// Create a placeholder client for error handling
function createPlaceholderClient() {
  const errorResponse = { error: new Error('Supabase client not initialized properly') };
  
  return {
    auth: {
      signUp: () => Promise.resolve({ user: null, session: null, error: new Error('Supabase client not initialized') }),
      signInWithPassword: () => Promise.resolve({ user: null, session: null, error: new Error('Supabase client not initialized') }),
      signInWithOAuth: () => Promise.resolve({ user: null, session: null, error: new Error('Supabase client not initialized') }),
      signOut: () => Promise.resolve({ error: new Error('Supabase client not initialized') }),
      getUser: () => Promise.resolve({ user: null, error: new Error('Supabase client not initialized') }),
      getSession: () => Promise.resolve({ session: null, error: new Error('Supabase client not initialized') }),
      resetPasswordForEmail: () => Promise.resolve({ data: null, error: new Error('Supabase client not initialized') }),
      onAuthStateChange: () => {
        return { data: { subscription: { unsubscribe: () => {} } }, error: null };
      }
    },
    from: () => ({
      select: () => Promise.resolve(errorResponse),
      insert: () => Promise.resolve(errorResponse),
      update: () => Promise.resolve(errorResponse),
      delete: () => Promise.resolve(errorResponse),
      upsert: () => Promise.resolve(errorResponse)
    })
  };
}

// Export signup function that uses Supabase instead of Firebase
export const signUpWithSupabase = async (
  email: string, 
  password: string, 
  metadata: { first_name: string; last_name?: string; display_name?: string }
) => {
  try {
    // Sign up with Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: metadata.first_name,
          last_name: metadata.last_name || '',
          display_name: metadata.display_name || (metadata.last_name ? `${metadata.first_name} ${metadata.last_name}` : metadata.first_name)
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    });
    
    if (error) throw error;
    
    return {
      success: true,
      user: data.user,
      message: 'User registered successfully'
    };
  } catch (error: any) {
    console.error('Error during Supabase registration:', error);
    return {
      success: false,
      error: error.message || 'An error occurred during registration'
    };
  }
};

// Sign in with Supabase
export const signInWithSupabase = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    
    return {
      success: true,
      user: data.user,
      session: data.session
    };
  } catch (error: any) {
    console.error('Error during Supabase login:', error);
    return {
      success: false,
      error: error.message || 'An error occurred during login'
    };
  }
};

// Sign out
export const signOutFromSupabase = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) throw error;
    
    return { success: true };
  } catch (error: any) {
    console.error('Error during Supabase logout:', error);
    return {
      success: false,
      error: error.message || 'An error occurred during logout'
    };
  }
};

// Get current user
export const getCurrentSupabaseUser = async () => {
  try {
    const { data, error } = await supabase.auth.getUser();
    
    if (error) throw error;
    
    return {
      success: true,
      user: data.user
    };
  } catch (error: any) {
    console.error('Error getting Supabase user:', error);
    return {
      success: false,
      error: error.message || 'An error occurred getting user data'
    };
  }
};

// Reset password
export const resetSupabasePassword = async (email: string) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });
    
    if (error) throw error;
    
    return {
      success: true,
      message: 'Password reset email sent'
    };
  } catch (error: any) {
    console.error('Error sending reset password email:', error);
    return {
      success: false,
      error: error.message || 'An error occurred sending password reset email'
    };
  }
};

export default supabase; 