#!/bin/bash

echo "🚀 Frontend Deployment Script"
echo "============================"

# Configuration
SERVER="root@31.97.57.193"
REMOTE_PATH="/var/www/viticultwhisky/frontend"
LOCAL_BUILD="frontend/build"

echo "📦 Creating deployment package..."
cd /Users/adityapachauri/Desktop/Whisky

# Create a tarball of the build
tar -czf frontend-build.tar.gz -C frontend build

echo "📤 Uploading to production server..."
echo "Please enter the server password when prompted:"

# Copy to server
scp frontend-build.tar.gz $SERVER:/tmp/

echo "🔧 Deploying on server..."
ssh $SERVER << 'EOF'
cd /var/www/viticultwhisky/frontend
echo "📁 Backing up current build..."
rm -rf build.backup
mv build build.backup 2>/dev/null || true

echo "📦 Extracting new build..."
tar -xzf /tmp/frontend-build.tar.gz
rm /tmp/frontend-build.tar.gz

echo "🔍 Verifying deployment..."
if [ -f build/index.html ]; then
    echo "✅ Build files deployed successfully"
    
    # Clear any CDN cache if using Cloudflare
    echo "🌐 Clearing cache..."
    # Note: Add Cloudflare cache purge here if needed
    
    echo "✨ Deployment complete!"
else
    echo "❌ Deployment failed - restoring backup"
    mv build.backup build
    exit 1
fi
EOF

echo "🧹 Cleaning up local files..."
rm -f frontend-build.tar.gz

echo "✅ Frontend deployment complete!"
echo ""
echo "🔗 Test the deployment at: https://viticultwhisky.co.uk/admin/login"