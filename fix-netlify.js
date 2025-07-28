const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing Netlify Deployment Issues...');

// Ensure dist directory exists
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist', { recursive: true });
  console.log('✅ Created dist directory');
}

// Check if index.html exists
if (!fs.existsSync('dist/index.html')) {
  console.log('❌ index.html not found in dist/');
  process.exit(1);
} else {
  console.log('✅ index.html found');
}

// Create/update _redirects file with proper format
const redirectsContent = `# API redirects to backend
/api/*  https://incredible-beauty-production-f2fe.up.railway.app/api/:splat  200

# SPA fallback - MUST be last rule
/*    /index.html   200`;

fs.writeFileSync('dist/_redirects', redirectsContent);
console.log('✅ Updated _redirects file');

// Create netlify.toml in dist directory (not .netlify)
const netlifyTomlContent = `[build]
  publish = "."

# API redirects
[[redirects]]
  from = "/api/*"
  to = "https://incredible-beauty-production-f2fe.up.railway.app/api/:splat"
  status = 200
  force = true

# SPA routing
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

# Headers for security
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"`;

fs.writeFileSync('dist/netlify.toml', netlifyTomlContent);
console.log('✅ Created netlify.toml in dist/');

// Verify all required files
const requiredFiles = [
  'dist/index.html',
  'dist/_redirects',
  'dist/netlify.toml',
  'dist/js/main.js',
  'dist/js/api.js',
  'dist/styles/main.css'
];

console.log('\n📁 Verifying required files:');
let allFilesExist = true;

requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
    allFilesExist = false;
  }
});

if (allFilesExist) {
  console.log('\n🎉 All files ready for Netlify deployment!');
  console.log('\n📋 Manual Deployment Steps:');
  console.log('1. Go to https://netlify.app');
  console.log('2. Drag and drop the ENTIRE dist/ folder to Netlify');
  console.log('3. Wait for deployment to complete');
  console.log('4. Your site will be live!');
  
  console.log('\n🔗 Alternative: Using Netlify CLI');
  console.log('1. Install: npm install -g netlify-cli');
  console.log('2. Login: netlify login');
  console.log('3. Deploy: netlify deploy --prod --dir=dist');
} else {
  console.log('\n❌ Some files are missing. Please check the errors above.');
}

// Create a deployment verification file
const deploymentInfo = {
  timestamp: new Date().toISOString(),
  version: '1.0.0',
  backend: 'https://incredible-beauty-production-f2fe.up.railway.app',
  files: fs.readdirSync('dist'),
  status: allFilesExist ? 'ready' : 'incomplete'
};

fs.writeFileSync('dist/deployment-info.json', JSON.stringify(deploymentInfo, null, 2));
console.log('✅ Created deployment-info.json');

console.log('\n✨ Netlify deployment fix completed!');
