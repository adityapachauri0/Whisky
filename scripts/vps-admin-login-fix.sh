#!/bin/bash

# VPS Admin Login Comprehensive Fix Script
# Based on Master Troubleshooting Guide

echo "🔧 Starting VPS Admin Login Fix..."
echo "This script fixes ALL known admin login issues on the VPS"

# Step 1: Environment Validation
echo ""
echo "📋 Step 1: Environment Validation"
cd /var/www/viticultwhisky/backend

# Check NODE_ENV
echo "Current NODE_ENV: $NODE_ENV"
export NODE_ENV=production
echo "Set NODE_ENV=production"

# Validate ENCRYPTION_KEY length (Critical Fix)
echo "Checking ENCRYPTION_KEY length..."
KEY_LENGTH=$(echo -n "$(grep ENCRYPTION_KEY .env.production | cut -d= -f2)" | wc -c)
echo "Current ENCRYPTION_KEY length: $KEY_LENGTH"

if [ "$KEY_LENGTH" -ne 32 ]; then
    echo "❌ ENCRYPTION_KEY is $KEY_LENGTH characters, but must be exactly 32"
    echo "Generating new 32-character ENCRYPTION_KEY..."
    NEW_KEY=$(openssl rand -hex 16)
    sed -i.backup "s/ENCRYPTION_KEY=.*/ENCRYPTION_KEY=$NEW_KEY/" .env.production
    echo "✅ ENCRYPTION_KEY fixed to 32 characters"
else
    echo "✅ ENCRYPTION_KEY length is correct (32 characters)"
fi

# Check password hash format
echo "Checking password hash format..."
HASH=$(grep ADMIN_PASSWORD_HASH .env.production | cut -d= -f2)
if [[ $HASH == \$2* ]]; then
    echo "✅ Password hash format is correct (bcrypt)"
else
    echo "❌ Password hash format is wrong (not bcrypt)"
    echo "   Expected: \$2a\$12\$..."
    echo "   Got: $HASH"
fi

# Step 2: CORS Configuration Fix
echo ""
echo "📡 Step 2: CORS Configuration Fix"
echo "Adding localhost to ALLOWED_ORIGINS for internal API calls..."

# Add localhost to ALLOWED_ORIGINS (Critical Fix)
sed -i.backup 's/ALLOWED_ORIGINS=.*/ALLOWED_ORIGINS=https:\/\/viticultwhisky.co.uk,https:\/\/www.viticultwhisky.co.uk,http:\/\/localhost:5001,http:\/\/127.0.0.1:5001/' .env.production

echo "✅ CORS configuration updated"

# Step 3: Nginx Configuration Fix
echo ""
echo "🌐 Step 3: Nginx Configuration Fix"

# Fix proxy port (5000 → 5001) - Critical Fix
echo "Fixing nginx proxy port from 5000 to 5001..."
sed -i.backup 's/proxy_pass http:\/\/localhost:5000;/proxy_pass http:\/\/localhost:5001;/' /etc/nginx/sites-available/viticultwhisky.co.uk

# Add proper HTTPS forwarding headers - Critical Fix
echo "Adding proper HTTPS forwarding headers..."
sed -i.backup '/location \/api {/,/}/c\      location /api {\
          proxy_pass http://localhost:5001;\
          proxy_http_version 1.1;\
          proxy_set_header Upgrade $http_upgrade;\
          proxy_set_header Connection '\''upgrade'\'';\
          proxy_set_header Host $host;\
          proxy_set_header X-Real-IP $remote_addr;\
          proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\
          proxy_set_header X-Forwarded-Proto $scheme;\
          proxy_set_header X-Forwarded-Host $host;\
          proxy_cache_bypass $http_upgrade;\
      }' /etc/nginx/sites-available/viticultwhisky.co.uk

# Test and reload nginx
echo "Testing nginx configuration..."
nginx -t
if [ $? -eq 0 ]; then
    echo "✅ Nginx configuration is valid"
    systemctl reload nginx
    echo "✅ Nginx reloaded"
else
    echo "❌ Nginx configuration has errors"
fi

# Step 4: Restart and Test
echo ""
echo "🔄 Step 4: Restart Backend and Test"

# Restart backend with proper environment
echo "Restarting backend with updated environment..."
pm2 restart viticult-backend --update-env

# Wait for backend to start
sleep 5

# Test API directly
echo "Testing API endpoint..."
curl -X POST https://viticultwhisky.co.uk/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -H "Origin: https://viticultwhisky.co.uk" \
  -d '{"email":"admin@viticultwhisky.co.uk","password":"admin123"}' \
  -w "\nHTTP Status: %{http_code}\n"

echo ""
echo "🎯 Fix Complete!"
echo ""
echo "If the curl command above returned:"
echo "✅ {\"success\":true,\"data\":{\"user\":{...}}} → Admin login is FIXED!"
echo "❌ 502 Bad Gateway → Check if backend is running: pm2 list"
echo "❌ CORS error → Check ALLOWED_ORIGINS includes viticultwhisky.co.uk"
echo "❌ Environment validation failed → Check ENCRYPTION_KEY length"
echo ""
echo "Next steps:"
echo "1. Open https://viticultwhisky.co.uk/admin/login"
echo "2. Login with: admin@viticultwhisky.co.uk / admin123"
echo "3. Should redirect to dashboard"
echo ""
echo "If login still fails, check PM2 logs: pm2 logs viticult-backend"