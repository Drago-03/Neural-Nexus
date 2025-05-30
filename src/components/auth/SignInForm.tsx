'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Github, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/src/components/ui/Input';
import { Button } from '@/src/components/ui/Button';
import { useSupabase } from '@/providers/SupabaseProvider';
import { useRouter, useSearchParams } from 'next/navigation';
import { getBaseUrl } from '@/lib/utils';
import { checkEmailVibe, debounce, RateLimitState, checkRateLimit } from '@/lib/validation';
import ReCAPTCHA from 'react-google-recaptcha';

// Field validation state interface
interface FieldState {
  value: string;
  error?: string;
  touched: boolean;
  valid: boolean;
  validating: boolean;
}

export default function SignInForm() {
  // Form field states with validation
  const [emailState, setEmailState] = useState<FieldState>({
    value: '',
    touched: false,
    valid: false,
    validating: false
  });
  
  const [passwordState, setPasswordState] = useState<FieldState>({
    value: '',
    touched: false,
    valid: false,
    validating: false
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  
  // Rate limiting state
  const [rateLimitState, setRateLimitState] = useState<RateLimitState>({
    attempts: 0,
    lastAttempt: 0,
    blocked: false,
    blockExpiry: 0
  });
  
  const { supabase } = useSupabase();
  const router = useRouter();
  const searchParams = useSearchParams();
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  
  // Get callback/redirect URL if provided
  const callbackUrl = searchParams?.get('callback') || searchParams?.get('redirect') || '/dashboard';

  // Debounced validation functions
  const debouncedEmailValidation = useRef(
    debounce((value: string) => {
      const result = checkEmailVibe(value);
      setEmailState(prev => ({
        ...prev,
        valid: result.valid,
        error: result.message,
        validating: false
      }));
    }, 500)
  ).current;
  
  // Handle email input change with validation
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmailState({
      value,
      touched: true,
      valid: emailState.valid,
      validating: true,
      error: undefined
    });
    
    debouncedEmailValidation(value);
  };
  
  // Handle password input change with validation
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPasswordState({
      value,
      touched: true,
      valid: value.length >= 1, // Simple presence check for login
      validating: false,
      error: value.length === 0 ? "Password can't be empty, bestie!" : undefined
    });
  };
  
  // Reset captcha when it's shown
  useEffect(() => {
    if (showCaptcha && recaptchaRef.current) {
      recaptchaRef.current.reset();
    }
  }, [showCaptcha]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);
    
    // Validate form
    if (!emailState.valid) {
      setEmailState(prev => ({
        ...prev,
        touched: true,
        error: prev.error || "Email doesn't look right, check it again!"
      }));
      return;
    }
    
    if (!passwordState.valid) {
      setPasswordState(prev => ({
        ...prev,
        touched: true,
        error: "You need a password to sign in!"
      }));
      return;
    }
    
    // Check rate limiting
    const rateLimitCheck = checkRateLimit(rateLimitState);
    if (!rateLimitCheck.allowed) {
      setGeneralError(rateLimitCheck.message || "Too many sign-in attempts. Try again later.");
      setRateLimitState(rateLimitCheck.newState);
      
      // Show CAPTCHA after multiple attempts
      if (rateLimitCheck.newState.attempts >= 3) {
        setShowCaptcha(true);
      }
      
      return;
    }
    
    // If CAPTCHA is shown but not completed
    if (showCaptcha && !captchaToken) {
      setGeneralError("Please complete the CAPTCHA verification");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: emailState.value,
        password: passwordState.value
      });
      
      // Update rate limit state
      setRateLimitState(rateLimitCheck.newState);
      
      if (error) throw error;
      
      // We're definitely on the client side here
      const { toast } = await import('react-hot-toast');
      toast.success("Successfully signed in!");
      
      // Redirect to callback URL or dashboard
      router.push(callbackUrl);
    } catch (err: any) {
      console.error('Sign in error:', err);
      
      // Handle specific error messages with user-friendly text
      let errorMessage = "Failed to sign in";
      
      if (err.message.includes("Invalid login")) {
        errorMessage = "Wrong email or password, try again!";
      } else if (err.message.includes("Email not confirmed")) {
        errorMessage = "You need to verify your email first. Check your inbox!";
      } else if (err.message.includes("rate limit")) {
        errorMessage = "Whoa, slow down! Too many attempts. Try again in a bit.";
        // Force CAPTCHA after rate limit errors
        setShowCaptcha(true);
      }
      
      setGeneralError(errorMessage);
      
      // If login failed, increment attempts
      const updatedRateLimitState = {
        ...rateLimitState,
        attempts: rateLimitState.attempts + 1,
        lastAttempt: Date.now()
      };
      
      // Show CAPTCHA after 3 failed attempts
      if (updatedRateLimitState.attempts >= 3) {
        setShowCaptcha(true);
      }
      
      setRateLimitState(updatedRateLimitState);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCaptchaChange = (token: string | null) => {
    setCaptchaToken(token);
    if (token) {
      // Reset general error when CAPTCHA is completed
      setGeneralError(null);
    }
  };
  
  const handleGithubSignIn = async () => {
    setIsLoading(true);
    try {
      // Get base URL and site info
      const baseUrl = getBaseUrl();
      const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Neural Nexus';
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://neuralnexus.biz';
      
      // Prepare the callback URL
      let redirectUrl;
      if (typeof window !== 'undefined' && 
          (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
        // Use localhost for development
        const port = window.location.port ? `:${window.location.port}` : '';
        redirectUrl = `http://${window.location.hostname}${port}/auth/callback?callbackUrl=${encodeURIComponent(callbackUrl)}`;
      } else {
        // Use configured site URL for production
        redirectUrl = `${siteUrl}/auth/callback?callbackUrl=${encodeURIComponent(callbackUrl)}`;
      }
      
      // Call the Supabase OAuth with site name for proper branding
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: false,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
            // Add site name for OAuth display
            site_name: siteName
          }
        },
      });
      
      if (error) throw error;
    } catch (err: any) {
      console.error('GitHub sign in error:', err);
      setGeneralError(err.message || 'Failed to sign in with GitHub');
      setIsLoading(false);
    }
  };
  
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      // Get base URL and site info
      const baseUrl = getBaseUrl();
      const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Neural Nexus';
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://neuralnexus.biz';
      
      // Prepare the callback URL
      let redirectUrl;
      if (typeof window !== 'undefined' && 
          (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
        // Use localhost for development
        const port = window.location.port ? `:${window.location.port}` : '';
        redirectUrl = `http://${window.location.hostname}${port}/auth/callback?callbackUrl=${encodeURIComponent(callbackUrl)}`;
      } else {
        // Use configured site URL for production
        redirectUrl = `${siteUrl}/auth/callback?callbackUrl=${encodeURIComponent(callbackUrl)}`;
      }
      
      // Use the redirectUrl in the OAuth call with site name for proper branding
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: false,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
            // Add site name for OAuth display
            site_name: siteName,
            app_name: siteName
          }
        },
      });
      
      if (error) throw error;
    } catch (err: any) {
      console.error('Google sign in error:', err);
      setGeneralError(err.message || 'Failed to sign in with Google');
      setIsLoading(false);
    }
  };

  // Get validation status icon for email field
  const getEmailStatusIcon = () => {
    if (!emailState.touched) return null;
    if (emailState.validating) return null;
    
    return emailState.valid ? 
      <CheckCircle className="h-5 w-5 text-green-500" /> : 
      <XCircle className="h-5 w-5 text-red-500" />;
  };

  return (
    <div className="bg-white/5 backdrop-blur-md rounded-xl border border-purple-500/10 p-6 md:p-8 shadow-xl">
      {generalError && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start"
        >
          <AlertCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
          <p className="text-red-300 text-sm">{generalError}</p>
        </motion.div>
      )}
      
      <form onSubmit={handleSignIn} className="space-y-6">
        <Input
          label="Email"
          type="email"
          name="email"
          value={emailState.value}
          onChange={handleEmailChange}
          leftIcon={<Mail className="h-5 w-5" />}
          rightIcon={getEmailStatusIcon()}
          placeholder="Enter your email"
          required
          autoComplete="email"
          error={emailState.touched ? emailState.error : undefined}
        />
        
        <Input
          label="Password"
          type="password"
          name="password"
          value={passwordState.value}
          onChange={handlePasswordChange}
          leftIcon={<Lock className="h-5 w-5" />}
          placeholder="Enter your password"
          required
          autoComplete="current-password"
          error={passwordState.touched ? passwordState.error : undefined}
        />
        
        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input 
              type="checkbox" 
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 bg-gray-700 border-gray-600"
            />
            <span className="ml-2 text-sm text-gray-300">
              Remember me
            </span>
          </label>
          <Link
            href="/forgot-password"
            className="text-sm text-blue-400 hover:text-blue-300"
          >
            Forgot password?
          </Link>
        </div>
        
        {showCaptcha && (
          <div className="flex justify-center my-4">
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'} // Default is Google's test key
              onChange={handleCaptchaChange}
              theme="dark"
            />
          </div>
        )}
        
        <Button
          type="submit"
          variant="primary"
          className="w-full"
          isLoading={isLoading}
          disabled={isLoading || (showCaptcha && !captchaToken) || rateLimitState.blocked}
        >
          Sign in
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
          onClick={handleGithubSignIn}
          disabled={isLoading || rateLimitState.blocked}
        >
          Continue with GitHub
        </Button>
        
        <Button
          variant="secondary"
          className="w-full bg-gray-800 hover:bg-gray-700 text-white"
          onClick={handleGoogleSignIn}
          disabled={isLoading || rateLimitState.blocked}
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
        Don't have an account?{' '}
        <Link
          href="/signup"
          className="text-blue-400 hover:text-blue-300 font-medium"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
} 