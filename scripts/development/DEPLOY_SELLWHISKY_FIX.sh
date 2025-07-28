#!/bin/bash
# Deploy Sell Whisky Fix to Production

echo "🚀 Deploying Sell Whisky Form Fix to Production"
echo "=============================================="
echo ""
echo "This script will guide you through deploying the fix."
echo ""

# Step 1: Transfer the file
echo "📦 Step 1: Transfer the fixed file"
echo "Run this command to copy the file to VPS:"
echo ""
echo "scp /Users/adityapachauri/Desktop/Whisky/frontend/src/pages/SellWhisky.tsx root@31.97.57.193:/var/www/viticultwhisky/frontend/src/pages/"
echo ""
echo "Press Enter after file is transferred..."
read

# Step 2: SSH and rebuild
echo ""
echo "🔨 Step 2: SSH to VPS and rebuild frontend"
echo "Run these commands:"
echo ""
cat << 'EOF'
ssh root@31.97.57.193

# Navigate to frontend
cd /var/www/viticultwhisky/frontend

# Rebuild the frontend
npm run build

# Check if build succeeded
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed! Check errors above."
    exit 1
fi

# Restart PM2 if needed
pm2 restart viticult-frontend
pm2 status

# Exit SSH
exit
EOF

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📋 Testing Steps:"
echo "1. Visit https://viticultwhisky.co.uk/sell-whisky"
echo "2. Fill and submit the form"
echo "3. Look for success message: 'Thank you! We've received your submission...'"
echo "4. Check admin dashboard for the submission"
echo ""
echo "🔍 What was fixed:"
echo "- API URL was: /api/api/sell-whisky (incorrect)"
echo "- API URL now: /api/sell-whisky (correct)"