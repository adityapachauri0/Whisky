#!/bin/bash

# Auto-Fix Deployment Script
# Run this AFTER every deployment to automatically fix common issues

echo "🔧 Auto-Fix Deployment Issues"
echo "============================"

cd /var/www/viticultwhisky/backend

# 1. Fix ENCRYPTION_KEY if needed
echo "1. Checking ENCRYPTION_KEY..."
ENCRYPTION_KEY=$(grep "ENCRYPTION_KEY=" .env.production 2>/dev/null | cut -d= -f2)
KEY_LENGTH=$(echo -n "$ENCRYPTION_KEY" | wc -c)

if [ "$KEY_LENGTH" -ne 32 ]; then
    echo "🔧 Fixing ENCRYPTION_KEY (was $KEY_LENGTH chars, need 32)..."
    NEW_KEY=$(openssl rand -hex 16)
    sed -i "s/ENCRYPTION_KEY=.*/ENCRYPTION_KEY=$NEW_KEY/" .env.production
    echo "✅ ENCRYPTION_KEY fixed"
fi

# 2. Fix ALLOWED_ORIGINS for localhost
echo "2. Checking ALLOWED_ORIGINS..."
ALLOWED_ORIGINS=$(grep "ALLOWED_ORIGINS=" .env.production 2>/dev/null | cut -d= -f2)

if [[ "$ALLOWED_ORIGINS" != *"localhost"* ]]; then
    echo "🔧 Adding localhost to ALLOWED_ORIGINS..."
    sed -i 's/ALLOWED_ORIGINS=.*/ALLOWED_ORIGINS=https:\/\/viticultwhisky.co.uk,https:\/\/www.viticultwhisky.co.uk,http:\/\/localhost:5001,http:\/\/127.0.0.1:5001/' .env.production
    echo "✅ ALLOWED_ORIGINS fixed"
fi

# 3. Set NODE_ENV
echo "3. Setting NODE_ENV..."
export NODE_ENV=production
echo "✅ NODE_ENV=production"

# 4. Restart backend
echo "4. Restarting backend..."
pm2 restart viticult-backend --update-env

# 5. Wait and test
echo "5. Testing backend..."
sleep 3

# Test the API
RESPONSE=$(curl -s -X POST http://localhost:5001/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -H "Origin: https://viticultwhisky.co.uk" \
  -d '{"email":"admin@viticultwhisky.co.uk","password":"admin123"}')

if [[ "$RESPONSE" == *"success\":true"* ]]; then
    echo "✅ Backend API working correctly!"
    echo "🎉 Deployment auto-fix completed successfully!"
else
    echo "❌ Backend API still not working:"
    echo "$RESPONSE"
    echo "📋 Check logs: pm2 logs viticult-backend --lines 10"
fi

echo ""
echo "📊 Final Status:"
echo "- ENCRYPTION_KEY: $(echo -n "$(grep ENCRYPTION_KEY .env.production | cut -d= -f2)" | wc -c) chars"
echo "- NODE_ENV: $NODE_ENV"
echo "- Backend: $(pm2 list | grep viticult-backend | awk '{print $10}')"
echo ""