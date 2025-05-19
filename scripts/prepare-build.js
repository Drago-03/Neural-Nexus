/**
 * prepare-build.js
 * 
 * This script prepares the project for building by creating necessary
 * static HTML fallback files for authentication pages.
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Preparing build environment...');

// Create public directory if it doesn't exist
const publicDir = path.join(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  console.log('📁 Creating public directory');
  fs.mkdirSync(publicDir, { recursive: true });
}

// Base fallback content for static HTML files
const FALLBACK_CONTENT = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Loading</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      margin: 0;
      padding: 0;
      min-height: 100vh;
      background: linear-gradient(to bottom, #1a1a2e, #000000);
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
    }
    .container {
      max-width: 500px;
      padding: 2rem;
      background-color: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border-radius: 1rem;
    }
    .loader {
      display: inline-block;
      width: 40px;
      height: 40px;
      border: 3px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      border-top-color: #9f7aea;
      animation: spin 1s ease-in-out infinite;
      margin-bottom: 1.5rem;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="loader"></div>
    <h1>Loading...</h1>
    <p>Please wait while the page loads.</p>
    <script>
      // Redirect to the actual page
      const path = window.location.pathname;
      setTimeout(() => {
        window.location.href = path.replace("-static.html", "");
      }, 100);
    </script>
  </div>
</body>
</html>`;

// Files to create
const staticFiles = [
  { path: 'signin-static.html', title: 'Sign In' },
  { path: 'signup-static.html', title: 'Sign Up' },
  { path: 'auth-callback-static.html', title: 'Authentication' },
];

// Create each static file if it doesn't exist
staticFiles.forEach(file => {
  const filePath = path.join(publicDir, file.path);
  
  if (!fs.existsSync(filePath)) {
    console.log(`📄 Creating ${file.path}`);
    
    // Replace the generic title with a specific one for each page
    const content = FALLBACK_CONTENT.replace('<title>Loading</title>', `<title>${file.title} - Neural Nexus</title>`);
    
    fs.writeFileSync(filePath, content, 'utf8');
  } else {
    console.log(`✅ ${file.path} already exists`);
  }
});

// Create app directory structure for output
const serverAppDirs = [
  '.next/server/app/signin',
  '.next/server/app/signup',
  '.next/server/app/auth/callback',
  '.next/server/pages/signin',
  '.next/server/pages/signup',
  '.next/server/pages/auth/callback'
];

// Create directories if .next exists
const nextDir = path.join(process.cwd(), '.next');
if (fs.existsSync(nextDir)) {
  serverAppDirs.forEach(dir => {
    const fullPath = path.join(process.cwd(), dir);
    if (!fs.existsSync(fullPath)) {
      console.log(`📁 Creating directory: ${dir}`);
      fs.mkdirSync(fullPath, { recursive: true });
    }
  });
}

console.log('✅ Build preparation complete'); 