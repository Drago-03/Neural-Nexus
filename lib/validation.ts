/**
 * Neural Nexus Form Validation Utilities
 * 
 * This module contains validation functions for form inputs with Gen-Z style naming.
 */

// Email validation with comprehensive checks
export const checkEmailVibe = (email: string): { valid: boolean; message?: string } => {
  // Basic empty check
  if (!email.trim()) {
    return { valid: false, message: "Email can't be empty, bestie!" };
  }

  // Basic format check using regex
  const basicEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!basicEmailRegex.test(email)) {
    return { valid: false, message: "That's not a legit email format, try again!" };
  }

  // More comprehensive email validation
  const advancedEmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!advancedEmailRegex.test(email)) {
    return { valid: false, message: "This email looks sus, double-check it!" };
  }

  // Check for disposable email domains
  const disposableDomains = [
    'tempmail.com', 'throwawaymail.com', 'mailinator.com', 
    'guerrillamail.com', 'yopmail.com', 'sharklasers.com',
    'temp-mail.org', '10minutemail.com', 'dispostable.com'
  ];
  
  const domain = email.split('@')[1].toLowerCase();
  if (disposableDomains.includes(domain)) {
    return { valid: false, message: "No temp emails allowed, we need the real deal!" };
  }

  return { valid: true };
};

// Username validation
export const checkUsernameVibe = (username: string): { valid: boolean; message?: string } => {
  // Basic empty check
  if (!username.trim()) {
    return { valid: false, message: "Username can't be empty, fr!" };
  }

  // Length check
  if (username.length < 3) {
    return { valid: false, message: "Username's too smol, need at least 3 characters!" };
  }

  if (username.length > 30) {
    return { valid: false, message: "Username's too extra, keep it under 30 characters!" };
  }

  // Character validation
  const usernameRegex = /^[a-zA-Z0-9_]+$/;
  if (!usernameRegex.test(username)) {
    return { valid: false, message: "Username can only have letters, numbers, and underscores. No cap!" };
  }

  // Reserved username check
  const reservedUsernames = [
    'admin', 'administrator', 'system', 'support', 'help',
    'root', 'moderator', 'mod', 'official', 'staff', 'team'
  ];
  
  if (reservedUsernames.includes(username.toLowerCase())) {
    return { valid: false, message: "That username is reserved, pick something more you!" };
  }

  return { valid: true };
};

// Password validation
export const checkPasswordStrength = (password: string): { 
  valid: boolean; 
  message?: string;
  strength: 'weak' | 'mid' | 'strong' | 'fire';
  score: number;
} => {
  // Basic empty check
  if (!password) {
    return { 
      valid: false, 
      message: "Password can't be empty, no cap!", 
      strength: 'weak',
      score: 0
    };
  }

  let score = 0;
  const checks = [];

  // Length check - base requirement
  if (password.length < 8) {
    return { 
      valid: false, 
      message: "Password's too short, need at least 8 characters!", 
      strength: 'weak',
      score: 0
    };
  } else {
    score += 1;
  }

  // Length bonus
  if (password.length >= 12) {
    score += 1;
  }

  // Check for lowercase
  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    checks.push("lowercase letters");
  }

  // Check for uppercase
  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    checks.push("uppercase letters");
  }

  // Check for numbers
  if (/[0-9]/.test(password)) {
    score += 1;
  } else {
    checks.push("numbers");
  }

  // Check for special characters
  if (/[^a-zA-Z0-9]/.test(password)) {
    score += 1;
  } else {
    checks.push("special characters");
  }

  // Determine strength based on score
  let strength: 'weak' | 'mid' | 'strong' | 'fire' = 'weak';
  let message: string | undefined;

  if (score <= 2) {
    strength = 'weak';
    message = "That password is mid, add more variety!";
  } else if (score <= 4) {
    strength = 'mid';
    message = "Getting better, but still not fire!";
  } else if (score <= 5) {
    strength = 'strong';
    message = "Strong password, you're getting there!";
  } else {
    strength = 'fire';
    message = "This password is fire! 🔥";
  }

  // Add specific suggestions if needed
  if (checks.length > 0 && strength !== 'fire') {
    message = `${message} Try adding ${checks.join(', ')}.`;
  }

  return { 
    valid: score >= 3, // Require at least a "mid" password
    message: score >= 3 ? undefined : message,
    strength,
    score
  };
};

// Password confirmation validation
export const checkPasswordsMatch = (password: string, confirmPassword: string): { valid: boolean; message?: string } => {
  // If confirm password is empty, don't validate yet
  if (!confirmPassword) {
    return { valid: false, message: "Please confirm your password!" };
  }
  
  // Check if passwords match
  if (password !== confirmPassword) {
    return { valid: false, message: "Passwords don't match, check again!" };
  }
  
  // Passwords match
  return { valid: true };
};

// Name validation
export const checkNameVibe = (name: string): { valid: boolean; message?: string } => {
  if (!name.trim()) {
    return { valid: false, message: "Name can't be empty!" };
  }

  // Check for reasonable length
  if (name.length < 2) {
    return { valid: false, message: "Name's too short, bestie!" };
  }

  if (name.length > 50) {
    return { valid: false, message: "That name's way too long, keep it real!" };
  }

  // Check for valid name characters (letters, spaces, hyphens, apostrophes)
  const nameRegex = /^[a-zA-ZÀ-ÖØ-öø-ÿ\s'-]+$/;
  if (!nameRegex.test(name)) {
    return { valid: false, message: "Names should only have letters, spaces, hyphens or apostrophes!" };
  }

  return { valid: true };
};

// Rate limiting for form submissions
export interface RateLimitState {
  attempts: number;
  lastAttempt: number;
  blocked: boolean;
  blockExpiry: number;
}

export const checkRateLimit = (state: RateLimitState): { 
  allowed: boolean; 
  message?: string;
  newState: RateLimitState;
} => {
  const now = Date.now();
  const MAX_ATTEMPTS = 5;
  const BLOCK_DURATION = 5 * 60 * 1000; // 5 minutes
  const ATTEMPT_WINDOW = 60 * 1000; // 1 minute
  
  // If currently blocked, check if block has expired
  if (state.blocked) {
    if (now > state.blockExpiry) {
      // Block expired, reset state
      return {
        allowed: true,
        newState: {
          attempts: 1,
          lastAttempt: now,
          blocked: false,
          blockExpiry: 0
        }
      };
    } else {
      // Still blocked
      const remainingSeconds = Math.ceil((state.blockExpiry - now) / 1000);
      return {
        allowed: false,
        message: `Too many attempts! Try again in ${remainingSeconds} seconds.`,
        newState: state
      };
    }
  }
  
  // Check if we're in a new attempt window
  if (now - state.lastAttempt > ATTEMPT_WINDOW) {
    // Reset attempts for new window
    return {
      allowed: true,
      newState: {
        attempts: 1,
        lastAttempt: now,
        blocked: false,
        blockExpiry: 0
      }
    };
  }
  
  // Increment attempts
  const newAttempts = state.attempts + 1;
  
  // Check if we should block
  if (newAttempts > MAX_ATTEMPTS) {
    return {
      allowed: false,
      message: "Too many attempts! Take a 5 minute break and try again later.",
      newState: {
        attempts: newAttempts,
        lastAttempt: now,
        blocked: true,
        blockExpiry: now + BLOCK_DURATION
      }
    };
  }
  
  // Allow but update state
  return {
    allowed: true,
    newState: {
      attempts: newAttempts,
      lastAttempt: now,
      blocked: false,
      blockExpiry: 0
    }
  };
};

// Debounce function for real-time validation
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;
  
  return function(...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}; 