#!/bin/bash

# 🏥 System Health Check Script
# Run this daily to catch issues before they become problems

echo "🏥 WHISKY WEBSITE HEALTH CHECK"
echo "=============================="
echo "Time: $(date)"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

ISSUES=0

# 1. Backend Service Check
echo "🔧 Backend Service Status"
echo "------------------------"
BACKEND_STATUS=$(pm2 list | grep viticult-backend | awk '{print $10}')
if [ "$BACKEND_STATUS" = "online" ]; then
    echo -e "${GREEN}✅ Backend service running${NC}"
else
    echo -e "${RED}❌ Backend service not running: $BACKEND_STATUS${NC}"
    ISSUES=$((ISSUES + 1))
fi

# 2. Database Connection
echo ""
echo "🗄️  Database Connection"
echo "----------------------"
DB_TEST=$(curl -s http://localhost:5001/api/health 2>/dev/null)
if echo "$DB_TEST" | grep -q "healthy"; then
    echo -e "${GREEN}✅ Database connection working${NC}"
else
    echo -e "${RED}❌ Database connection failed${NC}"
    ISSUES=$((ISSUES + 1))
fi

# 3. Admin Login Test
echo ""
echo "🔐 Admin Login Test"
echo "------------------"
ADMIN_TEST=$(curl -s -X POST http://localhost:5001/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -H "Origin: https://viticultwhisky.co.uk" \
  -d '{"email":"admin@viticultwhisky.co.uk","password":"admin123"}' 2>/dev/null)

if echo "$ADMIN_TEST" | grep -q '"success":true'; then
    echo -e "${GREEN}✅ Admin login working${NC}"
else
    echo -e "${RED}❌ Admin login failed${NC}"
    echo "Response: $ADMIN_TEST"
    ISSUES=$((ISSUES + 1))
fi

# 4. Website Accessibility
echo ""
echo "🌐 Website Accessibility"
echo "-----------------------"
WEBSITE_CODE=$(curl -s -o /dev/null -w "%{http_code}" https://viticultwhisky.co.uk 2>/dev/null)
if [ "$WEBSITE_CODE" = "200" ]; then
    echo -e "${GREEN}✅ Website accessible (HTTP $WEBSITE_CODE)${NC}"
else
    echo -e "${RED}❌ Website not accessible (HTTP $WEBSITE_CODE)${NC}"
    ISSUES=$((ISSUES + 1))
fi

# 5. SSL Certificate Check
echo ""
echo "🔒 SSL Certificate"
echo "-----------------"
SSL_EXPIRY=$(echo | openssl s_client -servername viticultwhisky.co.uk -connect viticultwhisky.co.uk:443 2>/dev/null | openssl x509 -noout -dates | grep notAfter | cut -d= -f2)
SSL_DAYS=$(( ($(date -d "$SSL_EXPIRY" +%s) - $(date +%s)) / 86400 ))

if [ $SSL_DAYS -gt 30 ]; then
    echo -e "${GREEN}✅ SSL certificate valid for $SSL_DAYS more days${NC}"
elif [ $SSL_DAYS -gt 7 ]; then
    echo -e "${YELLOW}⚠️ SSL certificate expires in $SSL_DAYS days${NC}"
else
    echo -e "${RED}❌ SSL certificate expires in $SSL_DAYS days - URGENT${NC}"
    ISSUES=$((ISSUES + 1))
fi

# 6. Environment Variables Check
echo ""
echo "🔧 Environment Variables"
echo "-----------------------"
cd /var/www/viticultwhisky/backend

# Check ENCRYPTION_KEY length
ENCRYPTION_KEY=$(grep "ENCRYPTION_KEY=" .env.production 2>/dev/null | cut -d= -f2)
KEY_LENGTH=$(echo -n "$ENCRYPTION_KEY" | wc -c)

if [ "$KEY_LENGTH" -eq 32 ]; then
    echo -e "${GREEN}✅ ENCRYPTION_KEY length correct (32 chars)${NC}"
else
    echo -e "${RED}❌ ENCRYPTION_KEY wrong length: $KEY_LENGTH chars (need 32)${NC}"
    ISSUES=$((ISSUES + 1))
fi

# Check NODE_ENV
if [ "$NODE_ENV" = "production" ]; then
    echo -e "${GREEN}✅ NODE_ENV set to production${NC}"
else
    echo -e "${YELLOW}⚠️ NODE_ENV not set to production: $NODE_ENV${NC}"
fi

# 7. Disk Space Check
echo ""
echo "💾 Disk Space"
echo "------------"
DISK_USAGE=$(df /var/www | tail -1 | awk '{print $5}' | sed 's/%//')
if [ $DISK_USAGE -lt 80 ]; then
    echo -e "${GREEN}✅ Disk usage: ${DISK_USAGE}%${NC}"
elif [ $DISK_USAGE -lt 90 ]; then
    echo -e "${YELLOW}⚠️ Disk usage: ${DISK_USAGE}% - Monitor closely${NC}"
else
    echo -e "${RED}❌ Disk usage: ${DISK_USAGE}% - Critical${NC}"
    ISSUES=$((ISSUES + 1))
fi

# 8. Memory Usage
echo ""
echo "🧠 Memory Usage"
echo "--------------"
MEMORY_USAGE=$(free | grep Mem | awk '{printf "%.0f", ($3/$2) * 100}')
if [ $MEMORY_USAGE -lt 80 ]; then
    echo -e "${GREEN}✅ Memory usage: ${MEMORY_USAGE}%${NC}"
elif [ $MEMORY_USAGE -lt 90 ]; then
    echo -e "${YELLOW}⚠️ Memory usage: ${MEMORY_USAGE}% - Monitor${NC}"
else
    echo -e "${RED}❌ Memory usage: ${MEMORY_USAGE}% - Critical${NC}"
    ISSUES=$((ISSUES + 1))
fi

# 9. Recent Error Logs
echo ""
echo "📋 Recent Error Logs"
echo "-------------------"
ERROR_COUNT=$(pm2 logs viticult-backend --lines 100 --nostream 2>/dev/null | grep -i error | wc -l)
if [ $ERROR_COUNT -eq 0 ]; then
    echo -e "${GREEN}✅ No recent errors in logs${NC}"
elif [ $ERROR_COUNT -lt 5 ]; then
    echo -e "${YELLOW}⚠️ $ERROR_COUNT recent errors - review logs${NC}"
else
    echo -e "${RED}❌ $ERROR_COUNT recent errors - investigate immediately${NC}"
    ISSUES=$((ISSUES + 1))
fi

# Summary
echo ""
echo "📊 HEALTH CHECK SUMMARY"
echo "======================"
if [ $ISSUES -eq 0 ]; then
    echo -e "${GREEN}🎉 ALL SYSTEMS HEALTHY${NC}"
    echo "✅ No issues detected"
elif [ $ISSUES -lt 3 ]; then
    echo -e "${YELLOW}⚠️ MINOR ISSUES DETECTED${NC}"
    echo "Issues found: $ISSUES"
    echo "Action: Monitor and fix non-critical issues"
else
    echo -e "${RED}🚨 CRITICAL ISSUES DETECTED${NC}"
    echo "Issues found: $ISSUES"
    echo "Action: Immediate attention required"
fi

echo ""
echo "Next health check recommended: $(date -d '+1 day')"
echo ""

# Log to file
LOG_FILE="/var/log/whisky-health-check.log"
echo "$(date): Health check completed - $ISSUES issues found" >> "$LOG_FILE" 2>/dev/null || true

exit $ISSUES