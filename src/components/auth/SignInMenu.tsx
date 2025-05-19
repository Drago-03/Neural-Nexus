import React, { useState, useEffect } from 'react';
import { Github, Mail, Lock, X, AlertCircle, User } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
// Import Supabase auth functions
import { signUpWithSupabase, signInWithSupabase } from '@/lib/supabase';
import supabase from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useSupabase } from '@/providers/SupabaseProvider';

interface SignInMenuProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
}

interface AuthError {
  type: 'email' | 'password' | 'firstName' | 'lastName' | 'username' | 'general';
  message: string;
}

export function SignInMenu({ isOpen, onClose, initialMode = 'signin' }: SignInMenuProps) {
  const [isSignIn, setIsSignIn] = useState(initialMode === 'signin');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<AuthError | null>(null);
  const router = useRouter();
  const { supabase } = useSupabase();

  // Update when initialMode changes from parent
  useEffect(() => {
    setIsSignIn(initialMode === 'signin');
  }, [initialMode]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear errors when user starts typing
    if (error?.type === name || error?.type === 'general') {
      setError(null);
    }
  };

  const validateForm = () => {
    // Reset previous errors
    setError(null);
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError({
        type: 'email',
        message: 'Please enter a valid email address'
      });
      return false;
    }
    
    // Validate password
    if (formData.password.length < 8) {
      setError({
        type: 'password',
        message: 'Password must be at least 8 characters long'
      });
      return false;
    }
    
    // Additional signup validation
    if (!isSignIn) {
      // Validate first name
      if (!formData.firstName.trim()) {
        setError({
          type: 'firstName',
          message: 'First name is required'
        });
        return false;
      }
      
      // Validate username
      if (!formData.username.trim()) {
        setError({
          type: 'username',
          message: 'Username is required'
        });
        return false;
      }
      
      // Username format validation (letters, numbers, underscores only)
      const usernameRegex = /^[a-zA-Z0-9_]+$/;
      if (!usernameRegex.test(formData.username)) {
        setError({
          type: 'username',
          message: 'Username can only contain letters, numbers, and underscores'
        });
        return false;
      }
      
      // Validate password confirmation
      if (formData.password !== formData.confirmPassword) {
        setError({
          type: 'password',
          message: 'Passwords do not match'
        });
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      if (isSignIn) {
        // Sign in directly with Supabase
        const response = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password
        });

        if (response.error) throw response.error;
        
        if (response.data.user) {
          console.log('Signed in successfully:', response.data.user);
          toast.success("You've been signed in successfully.");
          router.push('/dashboard'); // Redirect to dashboard
        } else {
          throw new Error('Failed to sign in');
        }
      } else {
        // Sign up directly with Supabase
        const response = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              first_name: formData.firstName,
              last_name: formData.lastName || '',
              username: formData.username,
              display_name: `${formData.firstName} ${formData.lastName || ''}`.trim(),
              profileComplete: false
            }
          }
        });

        if (response.error) throw response.error;
        
        if (response.data.user) {
          console.log('Account created successfully:', response.data.user);
          // For auto-confirmed email flows
          if (response.data.session) {
            toast.success("You've been signed in successfully.");
            router.push('/dashboard'); // Redirect to dashboard if session exists
          } else {
            // For email confirmation flows
            toast.success("Please check your email to verify your account before signing in.");
            onClose();
          }
        } else {
          throw new Error('Failed to create account');
        }
      }
    } catch (err: any) {
      console.error('Authentication error:', err);
      setError({
        type: 'general',
        message: err.message || 'An error occurred during authentication'
      });
      setIsLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      if (error) {
        console.error("GitHub login error:", error);
        setError({
          type: 'general',
          message: error.message || "Failed to sign in with GitHub"
        });
      }
    } catch (error: any) {
      console.error("GitHub auth error:", error);
      setError({
        type: 'general',
        message: error.message || "An unexpected error occurred"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      if (error) {
        console.error("Google login error:", error);
        setError({
          type: 'general',
          message: error.message || "Failed to sign in with Google"
        });
      }
    } catch (error: any) {
      console.error("Google auth error:", error);
      setError({
        type: 'general',
        message: error.message || "An unexpected error occurred"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      <div className="fixed right-4 top-20 z-50 w-full max-w-md">
        <div className="overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow-xl animate-slide-in">
          <div className="relative p-6">
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-500"
              title="Close"
            >
              <X className="h-5 w-5" />
            </button>
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {isSignIn ? 'Welcome back' : 'Create an account'}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {isSignIn 
                ? 'Sign in to access your account' 
                : 'Join our community of AI enthusiasts'}
            </p>

            {error?.type === 'general' && (
              <div className="mb-4 p-3 rounded bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 flex items-center">
                <AlertCircle className="h-4 w-4 mr-2" />
                {error.message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isSignIn && (
                <>
                  <Input
                    label="First Name"
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    leftIcon={<User className="h-5 w-5" />}
                    placeholder="Enter your first name"
                    error={error?.type === 'firstName' ? error.message : undefined}
                    required
                  />
                  
                  <Input
                    label="Last Name"
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    leftIcon={<User className="h-5 w-5" />}
                    placeholder="Enter your last name (optional)"
                    error={error?.type === 'lastName' ? error.message : undefined}
                  />

                  <Input
                    label="Username"
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    leftIcon={<User className="h-5 w-5" />}
                    placeholder="Choose a username"
                    error={error?.type === 'username' ? error.message : undefined}
                    required
                  />
                </>
              )}

              <Input
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                leftIcon={<Mail className="h-5 w-5" />}
                placeholder="Enter your email"
                error={error?.type === 'email' ? error.message : undefined}
                required
              />
              
              <Input
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                leftIcon={<Lock className="h-5 w-5" />}
                placeholder="Enter your password"
                error={error?.type === 'password' ? error.message : undefined}
                required
              />

              {!isSignIn && (
                <Input
                  label="Confirm Password"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  leftIcon={<Lock className="h-5 w-5" />}
                  placeholder="Confirm your password"
                  error={error?.type === 'password' ? error.message : undefined}
                  required
                />
              )}

              {isSignIn && (
                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                      Remember me
                    </span>
                  </label>
                  <button
                    type="button"
                    className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400"
                    onClick={() => console.log('Reset password')}
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                className="w-full"
                isLoading={isLoading}
              >
                {isSignIn ? 'Sign in' : 'Create account'}
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white dark:bg-gray-800 px-2 text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                variant="secondary"
                className="w-full"
                leftIcon={<Github className="h-5 w-5" />}
                onClick={handleGithubLogin}
              >
                Continue with GitHub
              </Button>
              
              <Button
                variant="secondary"
                className="w-full"
                onClick={handleGoogleLogin}
                leftIcon={
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                }
              >
                Continue with Google
              </Button>
            </div>

            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
              {isSignIn ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button
                type="button"
                className="text-blue-600 hover:text-blue-500 dark:text-blue-400"
                onClick={() => setIsSignIn(!isSignIn)}
              >
                {isSignIn ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
