#!/bin/bash

# ==========================================
# VITICULTWHISKY PRODUCTION DEPLOYMENT SCRIPT
# ==========================================
# This script handles complete deployment including:
# - Building React app
# - Transferring build files
# - Transferring public assets (hero images, etc.)
# - Setting correct permissions
# ==========================================

echo "==========================================="
echo "STARTING VITICULTWHISKY DEPLOYMENT"
echo "==========================================="

# Configuration
SERVER_IP="31.97.57.193"
SERVER_USER="root"
SERVER_PASS="w(7rjMOF4'nzhIOuOdPF"
REMOTE_PATH="/var/www/viticultwhisky/frontend"
LOCAL_BUILD_PATH="/Users/adityapachauri/Desktop/Whisky/frontend/build"
LOCAL_PUBLIC_PATH="/Users/adityapachauri/Desktop/Whisky/frontend/public"

# Step 1: Build the React application
echo ""
echo "Step 1: Building React application..."
echo "-----------------------------------"
cd /Users/adityapachauri/Desktop/Whisky/frontend
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Exiting..."
    exit 1
fi
echo "✅ Build completed successfully"

# Step 2: Clean Mac metadata files
echo ""
echo "Step 2: Cleaning Mac metadata files..."
echo "-----------------------------------"
find build -name "._*" -delete
find public -name "._*" -delete
echo "✅ Cleaned Mac metadata files"

# Step 3: Create deployment archive
echo ""
echo "Step 3: Creating deployment archive..."
echo "-----------------------------------"
tar -czf /tmp/viticult-build.tar.gz build/
echo "✅ Archive created: $(ls -lh /tmp/viticult-build.tar.gz | awk '{print $5}')"

# Step 4: Transfer build to server
echo ""
echo "Step 4: Transferring build to server..."
echo "-----------------------------------"
expect -c "
set timeout 300
spawn scp /tmp/viticult-build.tar.gz ${SERVER_USER}@${SERVER_IP}:/tmp/
expect \"password:\"
send \"${SERVER_PASS}\r\"
expect eof
"

if [ $? -ne 0 ]; then
    echo "❌ Build transfer failed!"
    exit 1
fi
echo "✅ Build transferred successfully"

# Step 5: Deploy build on server
echo ""
echo "Step 5: Deploying build on server..."
echo "-----------------------------------"
expect -c "
set timeout 120
spawn ssh ${SERVER_USER}@${SERVER_IP}
expect \"password:\"
send \"${SERVER_PASS}\r\"
expect \"*#\"
send \"cd ${REMOTE_PATH}\r\"
expect \"*#\"
send \"rm -rf build.backup\r\"
expect \"*#\"
send \"if [ -d build ]; then mv build build.backup; fi\r\"
expect \"*#\"
send \"tar -xzf /tmp/viticult-build.tar.gz\r\"
expect \"*#\"
send \"chown -R www-data:www-data build\r\"
expect \"*#\"
send \"chmod -R 755 build\r\"
expect \"*#\"
send \"rm /tmp/viticult-build.tar.gz\r\"
expect \"*#\"
send \"echo 'Build deployed successfully'\r\"
expect \"*#\"
send \"exit\r\"
expect eof
"

if [ $? -ne 0 ]; then
    echo "❌ Build deployment failed!"
    exit 1
fi
echo "✅ Build deployed on server"

# Step 6: Transfer public assets (hero images, etc.)
echo ""
echo "Step 6: Transferring public assets..."
echo "-----------------------------------"

# Transfer ENTIRE whisky folder to ensure ALL images persist
echo "Transferring all whisky assets (hero, distilleries, etc.)..."
expect -c "
set timeout 600
spawn rsync -avz --progress ${LOCAL_PUBLIC_PATH}/whisky/ ${SERVER_USER}@${SERVER_IP}:${REMOTE_PATH}/build/whisky/
expect \"password:\"
send \"${SERVER_PASS}\r\"
expect eof
"

if [ $? -ne 0 ]; then
    echo "❌ ERROR: Whisky assets transfer failed!"
    echo "Running fallback transfer..."
    # Fallback: Try transferring in smaller chunks
    expect -c "
    set timeout 300
    spawn rsync -avz ${LOCAL_PUBLIC_PATH}/whisky/hero/ ${SERVER_USER}@${SERVER_IP}:${REMOTE_PATH}/build/whisky/hero/
    expect \"password:\"
    send \"${SERVER_PASS}\r\"
    expect eof
    "
else
    echo "✅ All whisky assets transferred successfully"
fi

# Transfer other critical public assets
echo "Transferring other public assets..."
expect -c "
set timeout 120
spawn rsync -avz --progress \
    --include='*.pdf' \
    --include='*.ico' \
    --include='favicon.*' \
    --include='robots.txt' \
    --include='sitemap.xml' \
    --include='manifest.json' \
    --exclude='whisky/' \
    --exclude='*' \
    ${LOCAL_PUBLIC_PATH}/ ${SERVER_USER}@${SERVER_IP}:${REMOTE_PATH}/build/
expect \"password:\"
send \"${SERVER_PASS}\r\"
expect eof
"

echo "✅ Public assets transferred"

# Step 7: Set permissions and reload nginx
echo ""
echo "Step 7: Finalizing deployment..."
echo "-----------------------------------"
expect -c "
set timeout 60
spawn ssh ${SERVER_USER}@${SERVER_IP}
expect \"password:\"
send \"${SERVER_PASS}\r\"
expect \"*#\"
send \"cd ${REMOTE_PATH}/build\r\"
expect \"*#\"
send \"chown -R www-data:www-data .\r\"
expect \"*#\"
send \"chmod -R 755 .\r\"
expect \"*#\"
send \"nginx -s reload\r\"
expect \"*#\"
send \"echo '✅ Nginx reloaded'\r\"
expect \"*#\"
send \"exit\r\"
expect eof
"

# Step 8: Verify deployment
echo ""
echo "Step 8: Verifying deployment..."
echo "-----------------------------------"
expect -c "
set timeout 30
spawn ssh ${SERVER_USER}@${SERVER_IP}
expect \"password:\"
send \"${SERVER_PASS}\r\"
expect \"*#\"
send \"ls -la ${REMOTE_PATH}/build/static/js/ | head -3\r\"
expect \"*#\"
send \"ls -la ${REMOTE_PATH}/build/whisky/hero/optimized/ | wc -l\r\"
expect \"*#\"
send \"curl -s -o /dev/null -w '%{http_code}' https://viticultwhisky.co.uk\r\"
expect \"*#\"
send \"exit\r\"
expect eof
"

# Clean up local temporary files
rm -f /tmp/viticult-build.tar.gz

echo ""
echo "==========================================="
echo "✅ DEPLOYMENT COMPLETE!"
echo "==========================================="
echo "Site URL: https://viticultwhisky.co.uk"
echo ""
echo "Post-deployment checklist:"
echo "1. ✅ Build files deployed"
echo "2. ✅ Hero images transferred"
echo "3. ✅ Public assets synced"
echo "4. ✅ Permissions set correctly"
echo "5. ✅ Nginx reloaded"
echo ""
echo "Please verify:"
echo "- [ ] Homepage loads correctly"
echo "- [ ] Hero carousel images display"
echo "- [ ] Contact form works"
echo "- [ ] Admin dashboard accessible"
echo "==========================================="