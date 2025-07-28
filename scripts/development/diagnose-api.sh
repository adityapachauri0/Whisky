#!/bin/bash

# API Diagnostic Script
# Run this on VPS to diagnose API issues

echo "🔍 API Diagnostics for ViticultWhisky"
echo "===================================="

# 1. Check if backend is running
echo -e "\n1️⃣ Checking backend process..."
if pgrep -f "node.*server.js" > /dev/null; then
    echo "✅ Backend is running"
    ps aux | grep -E "node.*server.js" | grep -v grep
else
    echo "❌ Backend is NOT running!"
fi

# 2. Check port 5001
echo -e "\n2️⃣ Checking port 5001..."
if netstat -tuln | grep :5001 > /dev/null 2>&1; then
    echo "✅ Port 5001 is listening"
else
    echo "❌ Port 5001 is NOT listening!"
fi

# 3. Test local API health
echo -e "\n3️⃣ Testing local API health..."
HEALTH_RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" http://localhost:5001/api/health 2>/dev/null)
HTTP_STATUS=$(echo "$HEALTH_RESPONSE" | grep HTTP_STATUS | cut -d: -f2)
if [ "$HTTP_STATUS" = "200" ]; then
    echo "✅ Local API health check passed"
else
    echo "❌ Local API health check failed (HTTP $HTTP_STATUS)"
fi

# 4. Check MongoDB
echo -e "\n4️⃣ Checking MongoDB..."
if systemctl is-active --quiet mongod || pgrep -x mongod > /dev/null; then
    echo "✅ MongoDB is running"
    # Test connection
    if mongosh --quiet --eval "db.runCommand({ ping: 1 })" > /dev/null 2>&1; then
        echo "✅ MongoDB connection successful"
    else
        echo "❌ MongoDB connection failed"
    fi
else
    echo "❌ MongoDB is NOT running!"
fi

# 5. Check environment configuration
echo -e "\n5️⃣ Checking environment configuration..."
if [ -f "backend/.env.production" ]; then
    echo "✅ Production env file exists"
    # Check critical variables
    grep -E "NODE_ENV|ALLOWED_ORIGINS|JWT_SECRET|MONGODB_URI" backend/.env.production | sed 's/=.*/=***/'
else
    echo "❌ Production env file missing!"
fi

# 6. Test CORS headers
echo -e "\n6️⃣ Testing CORS configuration..."
CORS_TEST=$(curl -s -I -X OPTIONS http://localhost:5001/api/admin/login \
    -H "Origin: https://viticultwhisky.co.uk" \
    -H "Access-Control-Request-Method: POST" 2>/dev/null | grep -i "access-control")
if [ -n "$CORS_TEST" ]; then
    echo "✅ CORS headers present:"
    echo "$CORS_TEST" | sed 's/^/   /'
else
    echo "❌ No CORS headers found!"
fi

# 7. Test admin login endpoint
echo -e "\n7️⃣ Testing admin login endpoint..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:5001/api/admin/login \
    -H "Content-Type: application/json" \
    -d '{"email":"admin@viticultwhisky.co.uk","password":"admin123"}' \
    -w "\nHTTP_STATUS:%{http_code}" 2>/dev/null)
LOGIN_STATUS=$(echo "$LOGIN_RESPONSE" | grep HTTP_STATUS | cut -d: -f2)
if [ "$LOGIN_STATUS" = "200" ]; then
    echo "✅ Admin login endpoint working (HTTP 200)"
elif [ "$LOGIN_STATUS" = "401" ]; then
    echo "⚠️  Admin login failed - wrong credentials (HTTP 401)"
elif [ "$LOGIN_STATUS" = "429" ]; then
    echo "⚠️  Rate limited - too many attempts (HTTP 429)"
else
    echo "❌ Admin login endpoint error (HTTP $LOGIN_STATUS)"
fi

# 8. Check nginx configuration
echo -e "\n8️⃣ Checking nginx proxy..."
if systemctl is-active --quiet nginx; then
    echo "✅ Nginx is running"
    # Check if API location is configured
    if grep -q "location /api" /etc/nginx/sites-enabled/* 2>/dev/null; then
        echo "✅ API proxy location configured"
    else
        echo "❌ API proxy location NOT configured in nginx!"
    fi
else
    echo "❌ Nginx is NOT running!"
fi

# 9. Check PM2 status (if used)
echo -e "\n9️⃣ Checking PM2 status..."
if command -v pm2 &> /dev/null; then
    pm2 list
else
    echo "ℹ️  PM2 not installed"
fi

# 10. Recent error logs
echo -e "\n🔟 Recent backend errors..."
if [ -f "backend/logs/error.log" ]; then
    echo "Last 5 error entries:"
    tail -5 backend/logs/error.log | sed 's/^/   /'
else
    echo "No error log file found"
fi

# Summary
echo -e "\n📊 Summary"
echo "========="
echo "Run this command to see real-time logs:"
echo "  pm2 logs backend --lines 50"
echo ""
echo "To restart backend with correct environment:"
echo "  export NODE_ENV=production"
echo "  pm2 restart backend --update-env"

# Check for common issues
echo -e "\n⚠️  Common Issues Found:"
[ "$HTTP_STATUS" != "200" ] && echo "  - API health check failing"
[ "$LOGIN_STATUS" = "401" ] && echo "  - Wrong admin credentials (check password hash)"
[ "$LOGIN_STATUS" = "429" ] && echo "  - Rate limiting active (wait 15 minutes)"
[ -z "$CORS_TEST" ] && echo "  - CORS not configured properly"
[ ! -f "backend/.env.production" ] && echo "  - Missing production environment file"

echo -e "\n✅ Diagnostic complete!"