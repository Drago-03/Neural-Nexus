"use client";

// The dynamic export configuration ensures this page is only rendered client-side
export const dynamic = "force-dynamic";
export const runtime = "edge";
export const dynamicParams = true;

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import AuthLayout from '@/src/components/auth/AuthLayout';
import { Input } from '@/src/components/ui/Input';
import { Button } from '@/src/components/ui/Button';
import { Mail, Lock, Github, AlertCircle, User, CheckCircle, XCircle, Info, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useSupabase } from '@/providers/SupabaseProvider';
import { useRouter, useSearchParams } from 'next/navigation';
import { getBaseUrl } from '@/lib/utils';
import { PasswordStrengthMeter } from '@/src/components/ui/PasswordStrengthMeter';
import { 
  checkEmailVibe, 
  checkNameVibe, 
  checkUsernameVibe, 
  checkPasswordStrength, 
  checkPasswordsMatch,
  debounce,
  RateLimitState,
  checkRateLimit
} from '@/lib/validation';
import ReCAPTCHA from 'react-google-recaptcha';
import { UsernameSuggestions } from '@/src/components/ui/UsernameSuggestions';

// Import toast dynamically to avoid SSR issues
const importToast = () => import('react-hot-toast').then(mod => mod.toast);

// Field validation state interface
interface FieldState {
  value: string;
  error?: string;
  touched: boolean;
  valid: boolean;
  validating: boolean;
}

interface AuthError {
  field: 'email' | 'password' | 'firstName' | 'lastName' | 'username' | 'general';
  message: string;
}

export default function SignUpPage() {
  // Field states with validation
  const [fields, setFields] = useState({
    firstName: { value: '', error: undefined, touched: false, valid: false, validating: false } as FieldState,
    lastName: { value: '', error: undefined, touched: false, valid: true, validating: false } as FieldState, // Optional field
    username: { value: '', error: undefined, touched: false, valid: false, validating: false } as FieldState,
    email: { value: '', error: undefined, touched: false, valid: false, validating: false } as FieldState,
    password: { value: '', error: undefined, touched: false, valid: false, validating: false } as FieldState,
    confirmPassword: { value: '', error: undefined, touched: false, valid: false, validating: false } as FieldState,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Rate limiting state
  const [rateLimitState, setRateLimitState] = useState<RateLimitState>({
    attempts: 0,
    lastAttempt: 0,
    blocked: false,
    blockExpiry: 0
  });

  // Add state for username suggestions
  const [usernameSuggestions, setUsernameSuggestions] = useState<string[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  // Add a state for tooltip text
  const [usernameTooltipText, setUsernameTooltipText] = useState("First 3 are based on your name, last 3 are tech/gaming inspired");

  const { supabase } = useSupabase();
  const router = useRouter();
  const searchParams = useSearchParams();
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  // Create debounced validation functions
  const debouncedValidations = {
    firstName: useRef(debounce((value: string) => {
      const result = checkNameVibe(value);
      updateField('firstName', { valid: result.valid, error: result.message, validating: false });
    }, 400)).current,

    lastName: useRef(debounce((value: string) => {
      if (!value) {
        // Last name is optional
        updateField('lastName', { valid: true, error: undefined, validating: false });
        return;
      }
      const result = checkNameVibe(value);
      updateField('lastName', { valid: result.valid, error: result.message, validating: false });
    }, 400)).current,

    username: useRef(debounce(async (value: string) => {
      // First check basic format
      const result = checkUsernameVibe(value);
      if (!result.valid) {
        updateField('username', { valid: false, error: result.message, validating: false });
        return;
      }

      // Then check if username is already taken
      try {
        // Call our API to check if username is available
        const response = await fetch(`/api/username-check?username=${encodeURIComponent(value)}`);
        const data = await response.json();

        if (!data.available) {
          updateField('username', { 
            valid: false, 
            error: "This username is already taken, try another one!", 
            validating: false 
          });
        } else {
          updateField('username', { valid: true, error: undefined, validating: false });
        }
      } catch (err) {
        console.error('Error checking username availability:', err);
        // If API call fails, just validate the format
        updateField('username', { valid: result.valid, error: result.message, validating: false });
      }
    }, 600)).current,

    email: useRef(debounce(async (value: string) => {
      // First check format
      const result = checkEmailVibe(value);
      if (!result.valid) {
        updateField('email', { valid: false, error: result.message, validating: false });
        return;
      }

      // Then check if email is already registered
      try {
        // This would be a real API call in production
        // For now, just simulate a check
        const isRegistered = value.includes('taken') || value.includes('exists');

        if (isRegistered) {
          updateField('email', { 
            valid: false, 
            error: "This email is already registered. Try signing in instead!", 
            validating: false 
          });
        } else {
          updateField('email', { valid: true, error: undefined, validating: false });
        }
      } catch (err) {
        // If API call fails, just validate the format
        updateField('email', { valid: result.valid, error: result.message, validating: false });
      }
    }, 600)).current,

    password: useRef(debounce((value: string) => {
      const result = checkPasswordStrength(value);
      updateField('password', { 
        valid: result.valid, 
        error: result.valid ? undefined : result.message, 
        validating: false 
      });

      // Also validate confirm password if it's been touched and has a value
      if (fields.confirmPassword.touched && fields.confirmPassword.value) {
        // Check if passwords match
        const passwordsMatch = value === fields.confirmPassword.value;
        updateField('confirmPassword', { 
          valid: passwordsMatch, 
          error: passwordsMatch ? undefined : "Passwords don't match, check again!",
          validating: false 
        });
      }
    }, 400)).current,

    confirmPassword: useRef(debounce((value: string) => {
      // Only validate if there's a value to check
      if (!value) {
        updateField('confirmPassword', {
          valid: false,
          error: "Please confirm your password",
          validating: false
        });
        return;
      }
      
      // Check if passwords match
      const passwordsMatch = fields.password.value === value;
      console.log('Password validation:', {
        password: fields.password.value,
        confirmPassword: value,
        match: passwordsMatch
      });
      
      updateField('confirmPassword', { 
        valid: passwordsMatch, 
        error: passwordsMatch ? undefined : "Passwords don't match, check again!",
        validating: false 
      });
    }, 300)).current,
  };

  // Set isClient to true when component mounts to ensure we only access browser APIs on the client
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Mark that we're on the client
      setIsClient(true);

      // Check for error message in URL - use safe access
      const errorMsg = searchParams?.get ? searchParams.get('error') : null;
      if (errorMsg) {
        // Import toast dynamically
        importToast().then(toast => {
          toast.error(typeof errorMsg === 'string' ? errorMsg : 'An error occurred');
        }).catch(err => {
          console.error("Error showing toast:", err);
        });
      }

      // Stop loading after a short delay to ensure smooth transition
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    }
  }, [searchParams]);

  // Helper function to update a field's state
  const updateField = (fieldName: keyof typeof fields, updates: Partial<FieldState>) => {
    setFields(prev => ({
      ...prev,
      [fieldName]: {
        ...prev[fieldName],
        ...updates
      }
    }));
  };

  // Handle input change with validation
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Special handling for username field to sanitize input and prevent emojis
    if (name === 'username') {
      // Only allow alphanumeric, periods, underscores, and hyphens
      const sanitizedValue = value.replace(/[^a-zA-Z0-9._-]/g, '');
      
      // If the sanitized value is different from the input value, it means invalid characters were entered
      if (sanitizedValue !== value) {
        // Set field with sanitized value and show error about invalid characters
        updateField('username', {
          value: sanitizedValue,
          touched: true,
          validating: false,
          valid: false,
          error: 'Username can only contain letters, numbers, periods, underscores, and hyphens'
        });
        
        // Clear general error
        if (error && error.field === 'username') {
          setError(null);
        }
        
        // Use the appropriate debounced validation function with sanitized value
        if (sanitizedValue) {
          debouncedValidations.username(sanitizedValue);
        }
        
        return;
      }
      
      // Update the field with sanitized value
      updateField('username', {
        value: sanitizedValue,
        touched: true,
        validating: true
      });
      
      // Clear general error
      if (error && error.field === 'username') {
        setError(null);
      }
      
      // Use the appropriate debounced validation function
      debouncedValidations.username(sanitizedValue);
      
      return;
    }

    // Normal handling for other fields
    // Update the field value and mark as touched and validating
    updateField(name as keyof typeof fields, {
      value,
      touched: true,
      validating: true
    });

    // Clear general error when user starts typing
    if (error && error.field === name) {
      setError(null);
    }

    // Special handling for confirmPassword to ensure immediate validation
    if (name === 'confirmPassword') {
      const passwordsMatch = fields.password.value === value;
      updateField('confirmPassword', {
        valid: passwordsMatch,
        error: passwordsMatch ? undefined : "Passwords don't match, check again!",
        validating: false
      });
    } else {
      // Use the appropriate debounced validation function
      if (name in debouncedValidations) {
        debouncedValidations[name as keyof typeof debouncedValidations](value);
      }
    }
  };

  // Handle terms checkbox change
  const handleTermsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTermsAccepted(e.target.checked);
  };

  // Reset captcha when it's shown
  useEffect(() => {
    if (showCaptcha && recaptchaRef.current) {
      recaptchaRef.current.reset();
    }
  }, [showCaptcha]);

  const handleCaptchaChange = (token: string | null) => {
    setCaptchaToken(token);
    if (token) {
      // Reset general error when CAPTCHA is completed
      setError(null);
    }
  };

  // Validate the entire form
  const validateForm = () => {
    let isValid = true;
    let firstInvalidField: keyof typeof fields | null = null;

    // Check each required field
    const requiredFields: (keyof typeof fields)[] = ['firstName', 'username', 'email', 'password', 'confirmPassword'];

    for (const field of requiredFields) {
      // Skip if already valid
      if (fields[field].valid) continue;

      // Mark field as touched to show validation errors
      updateField(field, { touched: true });

      // Set field-specific error message if not already set
      if (!fields[field].error) {
        let errorMessage = `${field} is required`;

        switch (field) {
          case 'firstName':
            errorMessage = "First name can't be empty, bestie!";
            break;
          case 'username':
            errorMessage = "You need a username, no cap!";
            break;
          case 'email':
            errorMessage = "Email is required, how else can we reach you?";
            break;
          case 'password':
            errorMessage = "Password can't be empty, you need some security!";
            break;
          case 'confirmPassword':
            errorMessage = "Please confirm your password!";
            break;
        }

        updateField(field, { error: errorMessage });
      }

      // Track the first invalid field to focus it later
      if (!firstInvalidField) {
        firstInvalidField = field;
      }

      isValid = false;
    }

    // Check terms acceptance
    if (!termsAccepted) {
      setError({
        field: 'general',
        message: "You need to accept the Terms of Service and Privacy Policy"
      });
      isValid = false;
    }

    // If form is invalid, set a general error message
    if (!isValid) {
      setError({
        field: 'general',
        message: "Please check your information and try again."
      });
    }

    return isValid;
  };

  // Handle sign up form submission
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate all fields
    if (!validateForm()) return;

    // Check rate limiting
    const rateLimitCheck = checkRateLimit(rateLimitState);
    if (!rateLimitCheck.allowed) {
      setError({
        field: 'general',
        message: rateLimitCheck.message || "Too many sign-up attempts. Try again later."
      });
      setRateLimitState(rateLimitCheck.newState);

      // Show CAPTCHA after multiple attempts
      if (rateLimitCheck.newState.attempts >= 2) {
        setShowCaptcha(true);
      }

      return;
    }

    // If CAPTCHA is shown but not completed
    if (showCaptcha && !captchaToken) {
      setError({
        field: 'general',
        message: "Please complete the CAPTCHA verification"
      });
      return;
    }

    setIsLoading(true);
    try {
      const baseUrl = getBaseUrl();
      // Get callback URL if provided in the search params
      const callbackUrl = searchParams?.get('callback') || searchParams?.get('redirect') || '/dashboard';

      // Sign up with Supabase
      const { error } = await supabase.auth.signUp({
        email: fields.email.value,
        password: fields.password.value,
        options: {
          data: {
            first_name: fields.firstName.value,
            last_name: fields.lastName.value || '',
            username: fields.username.value,
            display_name: `${fields.firstName.value} ${fields.lastName.value || ''}`.trim(),
            profileComplete: false
          },
          emailRedirectTo: `${baseUrl}/auth/callback?callbackUrl=${encodeURIComponent(callbackUrl)}`
        }
      });

      if (error) throw error;

      // Success message - use dynamic import for toast
      if (isClient) {
        const { toast } = await import('react-hot-toast');
        toast.success("Account created! Please check your email to verify your account.");
      }

      // Redirect to sign-in with the callback preserved
      router.push(`/signin?callback=${encodeURIComponent(callbackUrl)}`);

    } catch (err: any) {
      console.error('Sign up error:', err);

      // Handle specific error messages with user-friendly text
      let errorMessage = err.message || 'Failed to create account';
      let errorField: AuthError['field'] = 'general';

      if (err.message.includes("email")) {
        errorField = 'email';
        if (err.message.includes("already registered")) {
          errorMessage = "This email is already registered. Try signing in instead!";
        }
      } else if (err.message.includes("password")) {
        errorField = 'password';
      } else if (err.message.includes("username")) {
        errorField = 'username';
        if (err.message.includes("already exists")) {
          errorMessage = "This username is already taken. Try another one!";
        }
      }

      setError({
        field: errorField,
        message: errorMessage
      });

      // Update rate limit state
      const updatedRateLimitState = {
        ...rateLimitState,
        attempts: rateLimitState.attempts + 1,
        lastAttempt: Date.now()
      };

      // Show CAPTCHA after 2 failed attempts
      if (updatedRateLimitState.attempts >= 2) {
        setShowCaptcha(true);
      }

      setRateLimitState(updatedRateLimitState);
    } finally {
      setIsLoading(false);
    }
  };

  // OAuth sign up handlers
  const handleGithubSignUp = async () => {
    setIsLoading(true);
    try {
      const baseUrl = getBaseUrl();
      // Get callback URL if provided in the search params
      const callbackUrl = searchParams?.get('callback') || searchParams?.get('redirect') || '/dashboard';

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${baseUrl}/auth/callback?callbackUrl=${encodeURIComponent(callbackUrl)}`,
          skipBrowserRedirect: false,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
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
      const baseUrl = getBaseUrl();
      // Get callback URL if provided in the search params
      const callbackUrl = searchParams?.get('callback') || searchParams?.get('redirect') || '/dashboard';

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${baseUrl}/auth/callback?callbackUrl=${encodeURIComponent(callbackUrl)}`,
          skipBrowserRedirect: false,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
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

  // Get validation status icon for a field
  const getStatusIcon = (fieldName: keyof typeof fields) => {
    const field = fields[fieldName];
    if (!field.touched) return null;
    if (field.validating) return null;

    return field.valid ? 
      <CheckCircle className="h-5 w-5 text-green-500" /> : 
      <XCircle className="h-5 w-5 text-red-500" />;
  };

  // Update the fetchUsernameSuggestions function to handle 6 suggestions
  const fetchUsernameSuggestions = async () => {
    if (!fields.firstName.value) return;
    
    setIsLoadingSuggestions(true);
    setUsernameSuggestions([]);
    
    try {
      const response = await fetch('/api/username-check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          firstName: fields.firstName.value,
          lastName: fields.lastName.value || ''
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch username suggestions');
      }
      
      const data = await response.json();
      
      if (data.suggestions && data.suggestions.length) {
        setUsernameSuggestions(data.suggestions);
        setUsernameTooltipText("First 3 are based on your name, last 3 are tech/gaming inspired");
      } else {
        // Generate fallback suggestions client-side if the API fails
        let fallbackSuggestions = [];
        
        // Sanitize function to ensure no emojis
        const sanitizeUsername = (username: string): string => {
          return username.replace(/[^\w_]/g, ''); // Only allow alphanumeric and underscore
        };
        
        // Name-based suggestions (3)
        const firstName = fields.firstName.value.toLowerCase();
        const lastName = fields.lastName.value ? fields.lastName.value.toLowerCase() : '';
        
        fallbackSuggestions.push(sanitizeUsername(firstName + (lastName ? lastName.substring(0, 1) : '')));
        fallbackSuggestions.push(sanitizeUsername(firstName + (lastName || '') + Math.floor(Math.random() * 999)));
        fallbackSuggestions.push(sanitizeUsername((firstName.substring(0, 1) + (lastName || '')).toLowerCase()));
        
        // Tech/Gaming suggestions (3)
        const techTerms = ['dev', 'tech', 'code', 'ai', 'web3', 'crypto', 'pixel'];
        const gamingTerms = ['gamer', 'player', 'elite', 'pro', 'legend', 'champion', 'win'];
        const getRandomItem = (arr: string[]): string => arr[Math.floor(Math.random() * arr.length)];
        
        fallbackSuggestions.push(sanitizeUsername(firstName + getRandomItem(techTerms)));
        fallbackSuggestions.push(sanitizeUsername(getRandomItem(gamingTerms) + firstName));
        fallbackSuggestions.push(sanitizeUsername(firstName + getRandomItem(gamingTerms) + Math.floor(Math.random() * 99)));
        
        setUsernameSuggestions(fallbackSuggestions);
        setUsernameTooltipText("Generated locally - first 3 name-based, last 3 tech/gaming vibes");
      }
    } catch (error) {
      console.error('Error fetching username suggestions:', error);
      setUsernameTooltipText("Something's off with our suggestion engine right now");
    } finally {
      setIsLoadingSuggestions(false);
    }
  };
  
  // Add function to handle selecting a suggestion
  const handleSelectSuggestion = (username: string) => {
    updateField('username', {
      value: username,
      touched: true,
      validating: true
    });
    
    // Validate the selected username
    debouncedValidations.username(username);
    
    // Remove this suggestion from the list
    setUsernameSuggestions(prev => prev.filter(s => s !== username));
  };
  
  // Fetch suggestions when first name or last name changes
  useEffect(() => {
    // Only fetch if first name has a decent length
    if (fields.firstName.value && fields.firstName.value.length >= 2) {
      // Debounce to avoid too many requests while typing
      const timer = setTimeout(() => {
        fetchUsernameSuggestions();
      }, 600); // Wait 600ms after typing stops
      
      return () => clearTimeout(timer);
    }
  }, [fields.firstName.value, fields.lastName.value]);

  // Clear suggestions when username field is manually changed
  useEffect(() => {
    // If user is typing their own username, hide suggestions
    if (fields.username.touched && fields.username.value && usernameSuggestions.length > 0) {
      // Only hide suggestions if the current username doesn't match any suggestion
      if (!usernameSuggestions.includes(fields.username.value)) {
        setUsernameSuggestions([]);
      }
    }
  }, [fields.username.value, fields.username.touched]);

  // Show loading state until client-side code is ready
  if (!isClient || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <div className="p-8 rounded-xl bg-gray-800/30 backdrop-blur-md text-center">
          <div className="w-12 h-12 border-t-2 border-purple-500 border-r-2 rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-white mb-2">Loading</h2>
          <p className="text-gray-300">Preparing sign-up page...</p>
        </div>
      </div>
    );
  }

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
              value={fields.firstName.value}
              onChange={handleInputChange}
              leftIcon={<User className="h-5 w-5" />}
              rightIcon={getStatusIcon('firstName')}
              placeholder="Enter your first name"
              error={fields.firstName.touched ? fields.firstName.error : undefined}
              required
              autoComplete="given-name"
            />

            <Input
              label="Last Name"
              type="text"
              name="lastName"
              value={fields.lastName.value}
              onChange={handleInputChange}
              leftIcon={<User className="h-5 w-5" />}
              rightIcon={getStatusIcon('lastName')}
              placeholder="Enter your last name (optional)"
              error={fields.lastName.touched ? fields.lastName.error : undefined}
              autoComplete="family-name"
            />
          </div>

          <Input
            label="Username"
            type="text"
            name="username"
            value={fields.username.value}
            onChange={handleInputChange}
            leftIcon={<User className="h-5 w-5" />}
            rightIcon={getStatusIcon('username')}
            placeholder="Choose a username"
            error={fields.username.touched ? fields.username.error : undefined}
            required
            autoComplete="username"
          />

          {/* Add username suggestions with smooth animation */}
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ 
              opacity: fields.firstName.value && fields.firstName.value.length >= 2 ? 1 : 0,
              height: fields.firstName.value && fields.firstName.value.length >= 2 ? 'auto' : 0
            }}
            transition={{ duration: 0.3 }}
          >
            {fields.firstName.value && fields.firstName.value.length >= 2 && (
              <>
                <div className="text-xs text-gray-400 italic mb-1">{usernameTooltipText}</div>
                <UsernameSuggestions
                  suggestions={usernameSuggestions}
                  onSelectSuggestion={handleSelectSuggestion}
                  onRefresh={fetchUsernameSuggestions}
                  isLoading={isLoadingSuggestions}
                />
              </>
            )}
          </motion.div>

          <Input
            label="Email"
            type="email"
            name="email"
            value={fields.email.value}
            onChange={handleInputChange}
            leftIcon={<Mail className="h-5 w-5" />}
            rightIcon={getStatusIcon('email')}
            placeholder="Enter your email"
            error={fields.email.touched ? fields.email.error : undefined}
            required
            autoComplete="email"
          />

          <div>
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={fields.password.value}
              onChange={handleInputChange}
              leftIcon={<Lock className="h-5 w-5" />}
              rightIcon={
                <div className="flex space-x-2">
                  {fields.password.touched && getStatusIcon('password')}
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-300"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowPassword(!showPassword);
                    }}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              }
              placeholder="Create a password (min. 8 characters)"
              error={fields.password.touched ? fields.password.error : undefined}
              required
              autoComplete="new-password"
            />

            {/* Password strength meter */}
            {fields.password.value && (
              <PasswordStrengthMeter password={fields.password.value} />
            )}
          </div>

          <div>
            <Input
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={fields.confirmPassword.value}
              onChange={handleInputChange}
              leftIcon={<Lock className="h-5 w-5" />}
              rightIcon={
                <div className="flex space-x-2">
                  {fields.confirmPassword.touched && getStatusIcon('confirmPassword')}
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-300"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowConfirmPassword(!showConfirmPassword);
                    }}
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              }
              placeholder="Confirm your password"
              error={fields.confirmPassword.touched ? fields.confirmPassword.error : undefined}
              required
              autoComplete="new-password"
            />
          </div>

          <div className="flex items-center mt-4">
            <input
              type="checkbox"
              id="terms"
              name="terms"
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 bg-gray-700 border-gray-600"
              checked={termsAccepted}
              onChange={handleTermsChange}
              required
            />
            <label htmlFor="terms" className="ml-2 text-sm text-gray-300">
              I agree to the <Link href="/terms" className="text-blue-400 hover:text-blue-300">Terms of Service</Link> and{' '}
              <Link href="/privacy" className="text-blue-400 hover:text-blue-300">Privacy Policy</Link>
            </label>
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

          {/* General form error message */}
          {error && error.field === 'general' && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start"
            >
              <AlertCircle className="h-4 w-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
              <p className="text-red-300 text-sm">{error.message}</p>
            </motion.div>
          )}

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            isLoading={isLoading}
            disabled={isLoading || (showCaptcha && !captchaToken) || rateLimitState.blocked}
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
            disabled={isLoading || rateLimitState.blocked}
          >
            Continue with GitHub
          </Button>

          <Button
            variant="secondary"
            className="w-full bg-gray-800 hover:bg-gray-700 text-white"
            onClick={handleGoogleSignUp}
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
