const fs = require('fs');
const path = require('path');

console.log('🔍 AgriToday Deployment Verification');
console.log('=' .repeat(50));

// Check if all required files exist
const requiredFiles = [
  'dist/index.html',
  'dist/_redirects',
  'dist/js/main.js',
  'dist/js/api.js',
  'dist/js/auth.js',
  'dist/js/payments.js',
  'dist/js/utils.js',
  'dist/js/translations.js',
  'dist/styles/main.css',
  'dist/styles/responsive.css',
  '.netlify/netlify.toml',
  'server.js',
  'package.json'
];

console.log('📁 Checking required files...');
let missingFiles = [];

requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file}`);
    missingFiles.push(file);
  }
});

// Check environment variables
console.log('\n🔧 Checking environment configuration...');
const envFile = '.env';
if (fs.existsSync(envFile)) {
  console.log('✅ .env file exists');
  const envContent = fs.readFileSync(envFile, 'utf8');
  
  const requiredEnvVars = [
    'MONGODB_URI',
    'JWT_SECRET',
    'PORT',
    'RAZORPAY_KEY_ID',
    'RAZORPAY_KEY_SECRET'
  ];
  
  requiredEnvVars.forEach(envVar => {
    if (envContent.includes(envVar)) {
      console.log(`✅ ${envVar} configured`);
    } else {
      console.log(`❌ ${envVar} missing`);
    }
  });
} else {
  console.log('❌ .env file missing');
}

// Check Netlify configuration
console.log('\n🌐 Checking Netlify configuration...');
const redirectsFile = 'dist/_redirects';
if (fs.existsSync(redirectsFile)) {
  console.log('✅ _redirects file exists');
  const redirectsContent = fs.readFileSync(redirectsFile, 'utf8');
  
  if (redirectsContent.includes('/api/*')) {
    console.log('✅ API redirects configured');
  } else {
    console.log('❌ API redirects missing');
  }
  
  if (redirectsContent.includes('/*    /index.html')) {
    console.log('✅ SPA routing configured');
  } else {
    console.log('❌ SPA routing missing');
  }
} else {
  console.log('❌ _redirects file missing');
}

// Check package.json scripts
console.log('\n📦 Checking package.json scripts...');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const requiredScripts = ['start', 'dev', 'build'];

requiredScripts.forEach(script => {
  if (packageJson.scripts && packageJson.scripts[script]) {
    console.log(`✅ ${script} script available`);
  } else {
    console.log(`❌ ${script} script missing`);
  }
});

// Check dependencies
console.log('\n📚 Checking critical dependencies...');
const criticalDeps = [
  'express',
  'mongoose',
  'cors',
  'helmet',
  'jsonwebtoken',
  'bcryptjs',
  'razorpay'
];

criticalDeps.forEach(dep => {
  if (packageJson.dependencies && packageJson.dependencies[dep]) {
    console.log(`✅ ${dep} dependency available`);
  } else {
    console.log(`❌ ${dep} dependency missing`);
  }
});

// Generate deployment checklist
console.log('\n📋 Deployment Checklist:');
console.log('='.repeat(30));

const checklist = [
  '□ All files present in dist/ folder',
  '□ Environment variables configured',
  '□ Netlify _redirects file configured',
  '□ Backend deployed and running',
  '□ Payment gateway credentials set (for production)',
  '□ Database connection string updated',
  '□ CORS settings configured for production domain',
  '□ Security headers enabled',
  '□ SSL certificate enabled',
  '□ Domain name configured (if custom domain)'
];

checklist.forEach(item => console.log(item));

console.log('\n🚀 Next Steps for Deployment:');
console.log('1. Upload dist/ folder to Netlify');
console.log('2. Configure environment variables in Netlify dashboard');
console.log('3. Deploy backend to Railway/Heroku');
console.log('4. Update API URLs in production');
console.log('5. Test the live application');

console.log('\n✨ Ready for deployment!');

// Summary
if (missingFiles.length === 0) {
  console.log('\n🎉 All required files are present!');
} else {
  console.log(`\n⚠️  Missing ${missingFiles.length} files:`, missingFiles);
}
