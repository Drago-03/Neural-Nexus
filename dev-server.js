const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const fs = require('fs');
const path = require('path');

// Create a Next.js app in production mode with custom server
const app = next({ dev: false });
const handle = app.getRequestHandler();

// Paths that require static file handling
const staticPaths = {
  '/signin': '/public/signin-static.html',
  '/signup': '/public/signup-static.html',
  '/auth/callback': '/public/auth-callback-static.html'
};

// Simple fallback content in case files are missing
const defaultFallback = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Loading...</title>
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
    }
    .container {
      max-width: 500px;
      padding: 2rem;
      background-color: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border-radius: 1rem;
      text-align: center;
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
    <p>Please wait while we redirect you...</p>
    <script>
      setTimeout(() => {
        window.location = window.location.href;
      }, 1500);
    </script>
  </div>
</body>
</html>
`;

// Start the app
app.prepare().then(() => {
  createServer((req, res) => {
    // Set headers for middleware to identify special handling
    req.headers['x-is-build'] = 'true';
    
    const parsedUrl = parse(req.url, true);
    const { pathname } = parsedUrl;
    
    // Handle static paths for auth pages
    if (staticPaths[pathname]) {
      try {
        const filePath = path.join(process.cwd(), staticPaths[pathname]);
        
        if (fs.existsSync(filePath)) {
          const fileContent = fs.readFileSync(filePath, 'utf8');
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(fileContent);
          return;
        } else {
          console.warn(`Static file not found: ${filePath}, using default fallback`);
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(defaultFallback);
          return;
        }
      } catch (err) {
        console.error(`Error serving static file for ${pathname}:`, err);
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(defaultFallback);
        return;
      }
    }
    
    // Let Next.js handle everything else
    handle(req, res, parsedUrl);
  }).listen(3000, (err) => {
    if (err) {
      console.error('Failed to start server:', err);
      process.exit(1);
    }
    
    console.log('\n🚀 Server running at http://localhost:3000');
    console.log('✅ Auth pages using static HTML fallbacks');
  });
}).catch(err => {
  console.error('Error preparing Next.js app:', err);
  process.exit(1);
}); 