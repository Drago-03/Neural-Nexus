#!/usr/bin/env node

/**
 * Neural Nexus Build Script
 * 
 * This script helps with the build process by:
 * 1. Setting environment variables for build time
 * 2. Handling MongoDB connection issues
 * 3. Providing fallback data for API routes
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

// Log helper functions
const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warn: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  title: (msg) => console.log(`\n${colors.bright}${colors.magenta}${msg}${colors.reset}\n`)
};

// Start the build process
log.title('Neural Nexus Build Script');
log.info('Starting build process...');

// Set environment variables for build time
process.env.NEXT_PHASE = 'phase-production-build';
process.env.NODE_ENV = 'production';

// Create a .env.production file if it doesn't exist
try {
  if (!fs.existsSync('.env.production')) {
    log.info('Creating .env.production file...');
    
    // Check if .env.local exists and copy from it
    if (fs.existsSync('.env.local')) {
      fs.copyFileSync('.env.local', '.env.production');
      log.success('Created .env.production from .env.local');
    } else {
      // Create a minimal .env.production file with placeholder values
      const envContent = `
# Neural Nexus Production Environment
NEXT_PUBLIC_SITE_URL=https://neural-nexus.vercel.app
# Replace this placeholder with your actual MongoDB URI in your deployment environment
# This is just a build-time placeholder and doesn't connect to any real database
MONGODB_URI=mongodb://placeholder:placeholder@localhost:27017/neural-nexus?authSource=admin
NEXT_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder
`;
      fs.writeFileSync('.env.production', envContent);
      log.success('Created minimal .env.production file');
    }
  } else {
    log.success('.env.production file already exists');
  }
} catch (error) {
  log.error(`Error creating .env.production: ${error.message}`);
}

// Run the build command
try {
  log.info('Running Next.js build...');
  execSync('next build', { stdio: 'inherit' });
  log.success('Build completed successfully!');
} catch (error) {
  log.error(`Build failed: ${error.message}`);
  process.exit(1);
}

// Success message
log.title('Build Completed Successfully!');
log.info('Your application is ready to be deployed.'); 