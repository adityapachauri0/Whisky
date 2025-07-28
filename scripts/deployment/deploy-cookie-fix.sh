#!/bin/bash

# Deploy Cookie Fix to Production
# This script fixes the admin login issue on production

echo "🚀 Deploying Cookie Fix to Production"
echo "====================================="

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if we have the VPS details
if [ -z "$1" ]; then
    echo -e "${YELLOW}Usage: ./deploy-cookie-fix.sh user@vps-ip${NC}"
    echo "Example: ./deploy-cookie-fix.sh root@185.123.456.789"
    exit 1
fi

VPS_SSH=$1
REMOTE_PATH="/var/www/viticultwhisky" # Adjust if different

echo -e "\n${GREEN}1. Creating deployment package...${NC}"

# Create a temporary directory
mkdir -p cookie-fix-deploy
cd cookie-fix-deploy

# Copy the fixed admin.controller.js
cp ../backend/controllers/admin.controller.js ./

# Create the deployment script
cat > apply-fix.sh << 'EOF'
#!/bin/bash

echo "📦 Applying Cookie Fix on VPS..."

# Navigate to backend
cd /var/www/viticultwhisky/backend || exit 1

# Backup current controller
cp controllers/admin.controller.js controllers/admin.controller.js.backup

# Apply the new controller
cp /tmp/cookie-fix/admin.controller.js controllers/

# Verify the fix was applied
if grep -q "sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax'" controllers/admin.controller.js; then
    echo "✅ Cookie fix applied successfully!"
else
    echo "❌ Cookie fix failed to apply"
    exit 1
fi

# Restart the backend service
echo "🔄 Restarting backend service..."
pm2 restart viticult-backend || pm2 restart backend || pm2 restart all

echo "✅ Fix deployed successfully!"
EOF

chmod +x apply-fix.sh

cd ..

echo -e "\n${GREEN}2. Uploading to VPS...${NC}"

# Upload the fix
scp -r cookie-fix-deploy ${VPS_SSH}:/tmp/cookie-fix

echo -e "\n${GREEN}3. Applying fix on VPS...${NC}"

# Execute the fix
ssh ${VPS_SSH} "cd /tmp/cookie-fix && bash apply-fix.sh"

echo -e "\n${GREEN}4. Testing production login...${NC}"

# Test the login endpoint
RESPONSE=$(curl -s -X POST https://viticultwhisky.co.uk/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@viticultwhisky.co.uk","password":"admin123"}' \
  -w "\nHTTP_STATUS:%{http_code}")

HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)

if [ "$HTTP_STATUS" = "200" ]; then
    echo -e "${GREEN}✅ Production login is working!${NC}"
else
    echo -e "${RED}❌ Production login still failing. Status: $HTTP_STATUS${NC}"
    echo "Response: $RESPONSE"
fi

# Cleanup
rm -rf cookie-fix-deploy
ssh ${VPS_SSH} "rm -rf /tmp/cookie-fix"

echo -e "\n${GREEN}🎉 Deployment complete!${NC}"
echo -e "${YELLOW}Test the login at: https://viticultwhisky.co.uk/admin/login${NC}"