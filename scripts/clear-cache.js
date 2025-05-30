/**
 * clear-cache.js
 * 
 * Script to clean Next.js cache directories to fix chunk loading and other build issues.
 * Run this script if you encounter chunk loading errors or other build-related problems.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🧹 Starting cache cleanup...');

// Directories to clean
const cacheDirs = [
  '.next',
  'node_modules/.cache'
];

// Delete each directory
cacheDirs.forEach(dir => {
  const fullPath = path.join(process.cwd(), dir);
  
  try {
    if (fs.existsSync(fullPath)) {
      console.log(`🗑️ Removing ${dir}...`);
      
      // On Windows, we need to use rimraf or similar because
      // fs.rmSync might fail with EPERM on some locked files
      if (process.platform === 'win32') {
        try {
          execSync(`rmdir /s /q "${fullPath}"`, { stdio: 'ignore' });
        } catch (e) {
          // If the Windows command fails, try the Node.js way
          fs.rmSync(fullPath, { recursive: true, force: true });
        }
      } else {
        // On Unix-like systems, we can use fs.rmSync directly
        fs.rmSync(fullPath, { recursive: true, force: true });
      }
      
      console.log(`✅ Removed ${dir}`);
    } else {
      console.log(`ℹ️ ${dir} does not exist, skipping`);
    }
  } catch (error) {
    console.error(`❌ Failed to remove ${dir}:`, error.message);
  }
});

// Create necessary directories again
cacheDirs.forEach(dir => {
  const fullPath = path.join(process.cwd(), dir);
  
  try {
    if (!fs.existsSync(fullPath)) {
      console.log(`📁 Creating ${dir}...`);
      fs.mkdirSync(fullPath, { recursive: true });
      console.log(`✅ Created ${dir}`);
    }
  } catch (error) {
    console.error(`❌ Failed to create ${dir}:`, error.message);
  }
});

console.log('✅ Cache cleanup complete');
console.log('🔥 Next steps:');
console.log('   1. Run "npm install" to reinstall dependencies');
console.log('   2. Run "npm run dev" to start the development server');
console.log('   3. If the issue persists, run "npm run build" to create a fresh build'); 