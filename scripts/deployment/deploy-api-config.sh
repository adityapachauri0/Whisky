#!/bin/bash

# Deploy API Configuration Update Script
# This script deploys the smart API configuration to fix admin login issues permanently

echo "🚀 Deploying API Configuration Update..."
echo "======================================="

# Check if we're in the right directory
if [ ! -d "frontend" ] || [ ! -d "backend" ]; then
    echo "❌ Error: Must be run from the Whisky project root directory"
    exit 1
fi

# Check if build exists
if [ ! -d "frontend/build" ]; then
    echo "❌ Error: Frontend build not found. Run 'npm run build' in frontend directory first."
    exit 1
fi

# Create deployment package
echo "📦 Creating deployment package..."
tar -czf frontend-api-config-update.tar.gz \
    frontend/build \
    frontend/src/config/api.config.js \
    API_CONFIG_DEPLOYMENT.md

echo "✅ Package created: frontend-api-config-update.tar.gz"

# Transfer to VPS
echo ""
echo "📤 Transferring to VPS..."
scp frontend-api-config-update.tar.gz root@31.97.57.193:/tmp/

if [ $? -ne 0 ]; then
    echo "❌ Error: Failed to transfer file to VPS"
    exit 1
fi

echo "✅ File transferred successfully"

# Deploy on VPS
echo ""
echo "🔧 Deploying on VPS..."
ssh root@31.97.57.193 << 'EOF'
set -e

echo "📍 Connected to VPS"
cd /var/www/viticultwhisky

# Backup current build
echo "💾 Backing up current build..."
if [ -d "frontend/build" ]; then
    mv frontend/build frontend/build.backup-$(date +%Y%m%d-%H%M%S)
    echo "✅ Backup created"
else
    echo "⚠️  No existing build to backup"
fi

# Extract new build
echo "📦 Extracting new build..."
tar -xzf /tmp/frontend-api-config-update.tar.gz
rm /tmp/frontend-api-config-update.tar.gz

# Set permissions
echo "🔐 Setting permissions..."
chown -R nodeapp:nodeapp frontend/build
chmod -R 755 frontend/build

# Copy the deployment guide for reference
if [ -f "API_CONFIG_DEPLOYMENT.md" ]; then
    mv API_CONFIG_DEPLOYMENT.md /var/www/viticultwhisky/docs/
fi

echo "✅ Deployment complete on VPS!"
EOF

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 API Configuration deployed successfully!"
    echo ""
    echo "📋 Next Steps:"
    echo "1. Clear your browser cache or test in incognito mode"
    echo "2. Visit https://viticultwhisky.co.uk/admin/login"
    echo "3. Login with: admin@viticultwhisky.co.uk / admin123"
    echo ""
    echo "🔍 To verify the deployment:"
    echo "1. Open browser console on the site"
    echo "2. You should see: API Configuration: {hostname: 'viticultwhisky.co.uk', apiUrl: 'https://viticultwhisky.co.uk/api'}"
    echo ""
    echo "⚠️  Important: Clear browser cache to ensure new code is loaded!"
else
    echo ""
    echo "❌ Deployment failed. Check the error messages above."
    exit 1
fi

# Clean up local package
echo ""
echo "🧹 Cleaning up local files..."
rm -f frontend-api-config-update.tar.gz

echo "✅ All done!"