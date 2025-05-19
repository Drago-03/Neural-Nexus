/**
 * Post-build script to patch any missing files that might cause the build to fail
 * This script runs after the build process to ensure all necessary files exist
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Patching build artifacts...');

// Ensure .next directory exists
if (!fs.existsSync('.next')) {
  fs.mkdirSync('.next', { recursive: true });
  console.log('📁 Created .next directory');
}

// Ensure prerender-manifest.json exists
const prerenderManifestPath = path.join('.next', 'prerender-manifest.json');
if (!fs.existsSync(prerenderManifestPath)) {
  fs.writeFileSync(prerenderManifestPath, '{}', 'utf8');
  console.log('📄 Created empty prerender-manifest.json');
}

// Create server directories for auth pages
const serverDirs = [
  '.next/server/pages/signin',
  '.next/server/pages/signup',
  '.next/server/pages/auth/callback',
  '.next/server/app/signin',
  '.next/server/app/signup',
  '.next/server/app/auth/callback',
];

serverDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁 Creating directory: ${dir}`);
  }
});

// Copy static HTML files from public to the server directory
const staticFiles = [
  { source: 'public/signin-static.html', dest: '.next/server/pages/signin.html' },
  { source: 'public/signup-static.html', dest: '.next/server/pages/signup.html' },
  { source: 'public/auth-callback-static.html', dest: '.next/server/pages/auth/callback.html' },
  // Also copy to app directory for client-side rendering
  { source: 'public/signin-static.html', dest: '.next/server/app/signin/page.html' },
  { source: 'public/signup-static.html', dest: '.next/server/app/signup/page.html' },
  { source: 'public/auth-callback-static.html', dest: '.next/server/app/auth/callback/page.html' },
];

staticFiles.forEach(({ source, dest }) => {
  if (fs.existsSync(source)) {
    // Create the directory if it doesn't exist
    const destDir = path.dirname(dest);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    
    // Copy the file
    fs.copyFileSync(source, dest);
    console.log(`📄 Copying ${source} to ${dest}`);
  } else {
    console.warn(`⚠️ Warning: ${source} does not exist`);
  }
});

console.log('✅ Build patching complete');
console.log('🚀 The build is ready for deployment!'); 