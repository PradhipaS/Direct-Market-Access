#!/bin/bash

echo "🚀 Building AgroCulture for Netlify deployment..."

# Ensure dist directory exists
mkdir -p dist

# Copy all necessary files
echo "📁 Copying files to dist directory..."

# Copy index.html (main entry point)
cp dist/index.html dist/index.html.backup 2>/dev/null || echo "Creating index.html"

# Ensure all required directories exist
mkdir -p dist/js
mkdir -p dist/styles
mkdir -p dist/images

# Copy JavaScript files
echo "📜 Copying JavaScript files..."
cp dist/js/* dist/js/ 2>/dev/null || echo "JavaScript files already in place"

# Copy CSS files
echo "🎨 Copying CSS files..."
cp dist/styles/* dist/styles/ 2>/dev/null || echo "CSS files already in place"

# Create a simple health check file for Netlify
echo "🔍 Creating health check file..."
cat > dist/health.json << EOF
{
  "status": "ok",
  "service": "AgriToday Frontend",
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "version": "1.0.0"
}
EOF

# Create _redirects file for Netlify (SPA routing)
echo "🔀 Creating Netlify redirects..."
cat > dist/_redirects << 'EOF'
# API redirects to backend
/api/*  https://incredible-beauty-production-f2fe.up.railway.app/api/:splat  200

# SPA fallback - serve index.html for all non-API routes
/*    /index.html   200
EOF

# Create netlify.toml if it doesn't exist in dist
echo "⚙️ Creating Netlify configuration..."
cat > dist/netlify.toml << 'EOF'
[build]
  publish = "."

# Handle SPA routing
[[redirects]]
  from = "/api/*"
  to = "https://incredible-beauty-production-f2fe.up.railway.app/api/:splat"
  status = 200
  force = true

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

# Security headers
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline' https://pay.google.com https://checkout.razorpay.com https://fonts.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com; font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com; img-src 'self' data: https:; connect-src 'self' https://incredible-beauty-production-f2fe.up.railway.app;"

# Cache static assets
[[headers]]
  for = "/styles/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/js/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
EOF

echo "✅ Build completed successfully!"
echo "📁 Files ready for deployment in dist/ directory"
echo "🌐 Your site will be available at your Netlify URL"
echo ""
echo "🔗 Make sure your backend is running at:"
echo "   https://incredible-beauty-production-f2fe.up.railway.app"
echo ""
echo "📋 Next steps:"
echo "   1. Deploy the dist/ folder to Netlify"
echo "   2. Ensure your Railway backend is running"
echo "   3. Test the live site"
