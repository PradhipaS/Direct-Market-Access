const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Netlify Deployment Process...');
console.log('Site ID: a18d4859-4b05-4ccf-9f4f-d061265b1b2b');

// First, ensure all files are ready
console.log('\n📁 Preparing deployment files...');

// Ensure dist directory structure is correct
if (!fs.existsSync('dist')) {
    console.log('❌ dist folder not found!');
    process.exit(1);
}

// Create/update netlify.toml in project root
const netlifyConfig = `[build]
  publish = "dist"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "18"

# SPA routing
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

# API redirects to backend
[[redirects]]
  from = "/api/*"
  to = "https://incredible-beauty-production-f2fe.up.railway.app/api/:splat"
  status = 200
  force = true

# Security headers
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline' https://pay.google.com https://checkout.razorpay.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://incredible-beauty-production-f2fe.up.railway.app;"`;

fs.writeFileSync('netlify.toml', netlifyConfig);
console.log('✅ Created netlify.toml');

// Update _redirects in dist folder
const redirectsContent = `# API redirects to backend
/api/*  https://incredible-beauty-production-f2fe.up.railway.app/api/:splat  200

# SPA fallback - serve index.html for all routes
/*    /index.html   200`;

fs.writeFileSync('dist/_redirects', redirectsContent);
console.log('✅ Updated dist/_redirects');

// Verify critical files exist
const criticalFiles = [
    'dist/index.html',
    'dist/_redirects',
    'netlify.toml'
];

let allFilesExist = true;
criticalFiles.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`✅ ${file}`);
    } else {
        console.log(`❌ ${file} - MISSING!`);
        allFilesExist = false;
    }
});

if (!allFilesExist) {
    console.log('\n❌ Critical files are missing. Deployment cannot proceed.');
    process.exit(1);
}

console.log('\n🔐 Please run the following commands manually:');
console.log('='.repeat(50));
console.log('1. netlify login');
console.log('2. netlify link --id=a18d4859-4b05-4ccf-9f4f-d061265b1b2b');
console.log('3. netlify deploy --prod --dir=dist');
console.log('='.repeat(50));

console.log('\n📋 What each command does:');
console.log('• netlify login - Authenticates with your Netlify account');
console.log('• netlify link - Links this project to your existing Netlify site');
console.log('• netlify deploy - Deploys your dist folder to Netlify');

console.log('\n🎯 After deployment:');
console.log('• Your site will be live at: https://agritoday.netlify.app');
console.log('• No more 404 errors!');
console.log('• All pages will work correctly');

console.log('\n✨ Files are ready for deployment!');
