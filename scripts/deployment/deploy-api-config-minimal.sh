#!/bin/bash

# Minimal deployment script - only transfers changed files
echo "🚀 Deploying API Configuration (Minimal Package)..."
echo "================================================"

# Create minimal package with only JS/CSS changes
echo "📦 Creating minimal deployment package..."
tar -czf frontend-api-minimal.tar.gz \
    --exclude='frontend/build/whisky' \
    --exclude='frontend/build/videos' \
    --exclude='frontend/build/whisky_backup_*' \
    frontend/build/static \
    frontend/build/index.html \
    frontend/build/asset-manifest.json \
    frontend/src/config/api.config.js

ls -lh frontend-api-minimal.tar.gz

echo ""
echo "📤 Transferring minimal package to VPS..."
scp frontend-api-minimal.tar.gz root@31.97.57.193:/tmp/

echo ""
echo "🔧 Deploying on VPS..."
ssh root@31.97.57.193 << 'EOF'
cd /var/www/viticultwhisky

# Only update the changed files
echo "📦 Extracting JS/CSS updates..."
tar -xzf /tmp/frontend-api-minimal.tar.gz

# Update only the static files
cp -r frontend/build/static/* frontend/build.production/static/
cp frontend/build/index.html frontend/build.production/
cp frontend/build/asset-manifest.json frontend/build.production/

# Copy the API config for reference
mkdir -p frontend/src/config
cp frontend/src/config/api.config.js frontend/src/config/

# Clean up
rm /tmp/frontend-api-minimal.tar.gz
rm -rf frontend/build

echo "✅ Minimal deployment complete!"
EOF

rm -f frontend-api-minimal.tar.gz
echo "✅ Done! Only updated the necessary JS/CSS files."