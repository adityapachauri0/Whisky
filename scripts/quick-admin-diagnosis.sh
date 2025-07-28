#!/bin/bash

# Quick Admin Login Diagnosis Script
# Based on Master Troubleshooting Guide - runs checks without making changes

echo "🔍 Quick Admin Login Diagnosis"
echo "Checking all common admin login issues..."
echo ""

# Check 1: Backend Service Status
echo "1️⃣ Backend Service Status:"
if pm2 list | grep -q "viticult-backend.*online"; then
    echo "✅ Backend is running"
else
    echo "❌ Backend is NOT running"
    echo "   Fix: pm2 start server.js --name viticult-backend"
fi
echo ""

# Check 2: Environment Variables
echo "2️⃣ Environment Variables:"
cd /var/www/viticultwhisky/backend

if [ -f ".env.production" ]; then
    echo "✅ .env.production file exists"
    
    # Check NODE_ENV
    if [ "$NODE_ENV" = "production" ]; then
        echo "✅ NODE_ENV=production"
    else
        echo "❌ NODE_ENV is not set to production (current: $NODE_ENV)"
        echo "   Fix: export NODE_ENV=production"
    fi
    
    # Check ENCRYPTION_KEY length
    KEY_LENGTH=$(echo -n "$(grep ENCRYPTION_KEY .env.production | cut -d= -f2)" | wc -c)
    if [ "$KEY_LENGTH" -eq 32 ]; then
        echo "✅ ENCRYPTION_KEY length is correct (32 characters)"
    else
        echo "❌ ENCRYPTION_KEY length is wrong ($KEY_LENGTH chars, needs 32)"
        echo "   Fix: Generate new key with: openssl rand -hex 16"
    fi
    
    # Check password hash format
    HASH=$(grep ADMIN_PASSWORD_HASH .env.production | cut -d= -f2)
    if [[ $HASH == \$2* ]]; then
        echo "✅ Password hash format is correct (bcrypt)"
    else
        echo "❌ Password hash format is wrong (not bcrypt)"
        echo "   Current: $HASH"
        echo "   Fix: Generate bcrypt hash"
    fi
    
    # Check CORS configuration
    if grep -q "localhost:5001" .env.production; then
        echo "✅ CORS includes localhost"
    else
        echo "❌ CORS missing localhost"
        echo "   Fix: Add localhost:5001 to ALLOWED_ORIGINS"
    fi
    
else
    echo "❌ .env.production file not found"
    echo "   Fix: Create .env.production with proper configuration"
fi
echo ""

# Check 3: Nginx Configuration
echo "3️⃣ Nginx Configuration:"
if [ -f "/etc/nginx/sites-available/viticultwhisky.co.uk" ]; then
    
    # Check proxy port
    if grep -q "proxy_pass http://localhost:5001" /etc/nginx/sites-available/viticultwhisky.co.uk; then
        echo "✅ Nginx proxying to correct port (5001)"
    else
        echo "❌ Nginx proxying to wrong port"
        echo "   Current config:"
        grep "proxy_pass" /etc/nginx/sites-available/viticultwhisky.co.uk | head -1
        echo "   Fix: Change to proxy_pass http://localhost:5001"
    fi
    
    # Check HTTPS headers
    if grep -q "X-Forwarded-Proto" /etc/nginx/sites-available/viticultwhisky.co.uk; then
        echo "✅ HTTPS forwarding headers present"
    else
        echo "❌ Missing HTTPS forwarding headers"
        echo "   Fix: Add X-Forwarded-Proto header"
    fi
    
else
    echo "❌ Nginx config file not found"
    echo "   Fix: Create nginx configuration for viticultwhisky.co.uk"
fi
echo ""

# Check 4: API Connectivity
echo "4️⃣ API Connectivity Test:"
echo "Testing backend API..."

# Test local backend
if curl -s http://localhost:5001/api/health > /dev/null 2>&1; then
    echo "✅ Backend responding on localhost:5001"
else
    echo "❌ Backend not responding on localhost:5001"
    echo "   Check: pm2 logs viticult-backend"
fi

# Test production API
if curl -s https://viticultwhisky.co.uk/api/health > /dev/null 2>&1; then
    echo "✅ Production API responding"
else
    echo "❌ Production API not responding"
    echo "   Check: nginx configuration and backend status"
fi
echo ""

# Check 5: Quick Login Test
echo "5️⃣ Quick Login Test:"
echo "Testing admin login endpoint..."

RESPONSE=$(curl -s -X POST https://viticultwhisky.co.uk/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -H "Origin: https://viticultwhisky.co.uk" \
  -d '{"email":"admin@viticultwhisky.co.uk","password":"admin123"}' \
  -w "HTTPSTATUS:%{http_code}")

HTTP_CODE=$(echo $RESPONSE | grep -o "HTTPSTATUS:[0-9]*" | cut -d: -f2)
BODY=$(echo $RESPONSE | sed 's/HTTPSTATUS:[0-9]*$//')

case $HTTP_CODE in
    200)
        if echo "$BODY" | grep -q '"success":true'; then
            echo "✅ Admin login working perfectly!"
        else
            echo "⚠️  Login endpoint responding but login failed"
            echo "   Response: $BODY"
        fi
        ;;
    401)
        echo "❌ Login failed - Invalid credentials"
        echo "   Check password hash format"
        ;;
    404)
        echo "❌ Login endpoint not found"
        echo "   Check backend routes configuration"
        ;;
    500)
        echo "❌ Internal server error"
        echo "   Check backend logs: pm2 logs viticult-backend"
        ;;
    502)
        echo "❌ Bad Gateway - nginx can't reach backend"
        echo "   Check nginx proxy configuration"
        ;;
    *)
        echo "❌ Unexpected HTTP status: $HTTP_CODE"
        echo "   Response: $BODY"
        ;;
esac
echo ""

# Summary
echo "🎯 DIAGNOSIS SUMMARY:"
echo ""
echo "To fix admin login issues, run:"
echo "1. chmod +x /var/www/viticultwhisky/scripts/vps-admin-login-fix.sh"
echo "2. ./scripts/vps-admin-login-fix.sh"
echo ""
echo "Or use the automated fix script from master troubleshooting guide:"
echo "./scripts/deployment/auto-fix-deployment.sh"