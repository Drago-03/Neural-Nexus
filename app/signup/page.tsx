"use client";

// The dynamic export configuration at the top ensures this page is only rendered client-side
export const dynamic = "force-dynamic";
export const runtime = "experimental-edge";
export const dynamicParams = true;

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AuthLayout from '@/src/components/auth/AuthLayout';
import { Input } from '@/src/components/ui/Input';
import { Button } from '@/src/components/ui/Button';
import { Mail, Lock, Github, AlertCircle, User } from 'lucide-react';
import Link from 'next/link';
import { useSupabase } from '@/providers/SupabaseProvider';
import { useRouter } from 'next/navigation';
import nextDynamic from 'next/dynamic';

// Dynamically import toast to avoid 'document is not defined' during SSR
const ToastProvider = nextDynamic(
  () => import('react-hot-toast').then((mod) => ({ default: () => null, toast: mod.toast })),
  { ssr: false }
);

interface AuthError {
  field: 'email' | 'password' | 'firstName' | 'lastName' | 'username' | 'general';
  message: string;
}

export default function SignUpPage() {
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
  const [isClient, setIsClient] = useState(false);
  const { supabase } = useSupabase();
  const router = useRouter();
  
  // Set isClient to true when component mounts to ensure we only access browser APIs on the client
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear errors when user starts typing
    if (error && error.field === name) {
      setError(null);
    }
  };
  
  const validateForm = () => {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError({
        field: 'email',
        message: 'Please enter a valid email address'
      });
      return false;
    }
    
    // Validate first name
    if (!formData.firstName.trim()) {
      setError({
        field: 'firstName',
        message: 'First name is required'
      });
      return false;
    }
    
    // Validate username
    if (!formData.username.trim()) {
      setError({
        field: 'username',
        message: 'Username is required'
      });
      return false;
    }
    
    // Username format validation (letters, numbers, underscores only)
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(formData.username)) {
      setError({
        field: 'username',
        message: 'Username can only contain letters, numbers, and underscores'
      });
      return false;
    }
    
    // Validate password
    if (formData.password.length < 8) {
      setError({
        field: 'password',
        message: 'Password must be at least 8 characters long'
      });
      return false;
    }
    
    // Validate password confirmation
    if (formData.password !== formData.confirmPassword) {
      setError({
        field: 'password',
        message: 'Passwords do not match'
      });
      return false;
    }
    
    return true;
  };
  
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      // Sign up with Supabase
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName || '',
            username: formData.username,
            display_name: `${formData.firstName} ${formData.lastName || ''}`.trim(),
            profileComplete: false
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) throw error;
      
      // Success message - use dynamic import for toast
      if (isClient) {
        const { toast } = await import('react-hot-toast');
        toast.success("Account created! Please check your email to verify your account.");
      }
      router.push('/signin');
      
    } catch (err: any) {
      console.error('Sign up error:', err);
      setError({
        field: 'general',
        message: err.message || 'Failed to create account'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGithubSignUp = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      if (error) throw error;
    } catch (err: any) {
      console.error('GitHub sign up error:', err);
      setError({
        field: 'general',
        message: err.message || 'Failed to sign up with GitHub'
      });
      setIsLoading(false);
    }
  };
  
  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      if (error) throw error;
    } catch (err: any) {
      console.error('Google sign up error:', err);
      setError({
        field: 'general',
        message: err.message || 'Failed to sign up with Google'
      });
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Join our community and start building amazing things"
      showBrainAnimation={false}
      mode="signup"
    >
      <div className="bg-white/5 backdrop-blur-md rounded-xl border border-purple-500/10 p-6 md:p-8 shadow-xl">
        {error && error.field === 'general' && (
          <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start"
          >
            <AlertCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
            <p className="text-red-300 text-sm">{error.message}</p>
          </motion.div>
        )}
        
        <form onSubmit={handleSignUp} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="First Name"
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              leftIcon={<User className="h-5 w-5" />}
              placeholder="Enter your first name"
              error={error?.field === 'firstName' ? error.message : undefined}
              required
              autoComplete="given-name"
            />
            
            <Input
              label="Last Name"
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              leftIcon={<User className="h-5 w-5" />}
              placeholder="Enter your last name (optional)"
              autoComplete="family-name"
            />
          </div>
          
          <Input
            label="Username"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            leftIcon={<User className="h-5 w-5" />}
            placeholder="Choose a username"
            error={error?.field === 'username' ? error.message : undefined}
            required
            autoComplete="username"
          />
          
          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            leftIcon={<Mail className="h-5 w-5" />}
            placeholder="Enter your email"
            error={error?.field === 'email' ? error.message : undefined}
            required
            autoComplete="email"
          />
          
          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            leftIcon={<Lock className="h-5 w-5" />}
            placeholder="Create a password (min. 8 characters)"
            error={error?.field === 'password' ? error.message : undefined}
            required
            autoComplete="new-password"
          />
          
          <Input
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            leftIcon={<Lock className="h-5 w-5" />}
            placeholder="Confirm your password"
            error={error?.field === 'password' ? error.message : undefined}
            required
            autoComplete="new-password"
          />
          
          <div className="flex items-center mt-4">
            <input
              type="checkbox"
              id="terms"
              name="terms"
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 bg-gray-700 border-gray-600"
              required
            />
            <label htmlFor="terms" className="ml-2 text-sm text-gray-300">
              I agree to the <Link href="/terms" className="text-blue-400 hover:text-blue-300">Terms of Service</Link> and{' '}
              <Link href="/privacy" className="text-blue-400 hover:text-blue-300">Privacy Policy</Link>
            </label>
          </div>
          
          <Button
            type="submit"
            variant="primary"
            className="w-full"
            isLoading={isLoading}
          >
            Create Account
          </Button>
        </form>
        
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700" />
                  </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-900 text-gray-400">
              Or continue with
            </span>
          </div>
        </div>
        
        <div className="space-y-3">
          <Button
            variant="secondary"
            className="w-full bg-gray-800 hover:bg-gray-700 text-white"
            leftIcon={<Github className="h-5 w-5" />}
            onClick={handleGithubSignUp}
            disabled={isLoading}
          >
            Continue with GitHub
          </Button>
          
          <Button
            variant="secondary"
            className="w-full bg-gray-800 hover:bg-gray-700 text-white"
            onClick={handleGoogleSignUp}
            disabled={isLoading}
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
        
        <p className="text-center text-sm text-gray-400 mt-8">
          Already have an account?{' '}
          <Link
            href="/signin"
            className="text-blue-400 hover:text-blue-300 font-medium"
          >
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
} 