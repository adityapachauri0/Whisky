#!/bin/bash

# 🧪 Pre-Deployment Testing Script
# Run comprehensive tests before any deployment

set -e

echo "🧪 PRE-DEPLOYMENT TESTING SUITE"
echo "==============================="
echo "Time: $(date)"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

FAILED_TESTS=0
TOTAL_TESTS=0

# Function to run test and track results
run_test() {
    local test_name="$1"
    local test_command="$2"
    local expected_result="$3"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    echo -n "Testing: $test_name... "
    
    if eval "$test_command" > /dev/null 2>&1; then
        if [ "$expected_result" = "success" ]; then
            echo -e "${GREEN}PASS${NC}"
            return 0
        else
            echo -e "${RED}FAIL${NC} (unexpected success)"
            FAILED_TESTS=$((FAILED_TESTS + 1))
            return 1
        fi
    else
        if [ "$expected_result" = "fail" ]; then
            echo -e "${GREEN}PASS${NC} (expected failure)"
            return 0
        else
            echo -e "${RED}FAIL${NC}"
            FAILED_TESTS=$((FAILED_TESTS + 1))
            return 1
        fi
    fi
}

# Test 1: Backend Service Health
echo "🔧 Backend Service Tests"
echo "----------------------"
run_test "Backend service running" "pm2 list | grep -q 'viticult-backend.*online'" "success"
run_test "Backend responds to health check" "curl -s http://localhost:5001/api/health | grep -q 'healthy'" "success"
run_test "Backend port 5001 accessible" "nc -z localhost 5001" "success"

echo ""

# Test 2: Database Connectivity
echo "🗄️  Database Tests"
echo "----------------"
cd /var/www/viticultwhisky/backend

# Check if MongoDB URI is configured
MONGODB_URI=$(grep "MONGODB_URI=" .env.production 2>/dev/null | cut -d= -f2)
if [ -n "$MONGODB_URI" ]; then
    run_test "Database connection" "mongosh '$MONGODB_URI' --eval 'db.runCommand({ping: 1})' | grep -q 'ok.*1'" "success"
    run_test "Database collections exist" "mongosh '$MONGODB_URI' --eval 'db.stats()' | grep -q 'collections'" "success"
else
    echo -e "${YELLOW}⚠️ MongoDB URI not found, skipping database tests${NC}"
fi

echo ""

# Test 3: Environment Configuration
echo "⚙️  Environment Tests"
echo "-------------------"
run_test "NODE_ENV set to production" "[ '$NODE_ENV' = 'production' ]" "success"

# Check ENCRYPTION_KEY length
ENCRYPTION_KEY=$(grep "ENCRYPTION_KEY=" .env.production 2>/dev/null | cut -d= -f2)
run_test "ENCRYPTION_KEY length (32 chars)" "[ $(echo -n '$ENCRYPTION_KEY' | wc -c) -eq 32 ]" "success"

# Check ALLOWED_ORIGINS includes localhost
ALLOWED_ORIGINS=$(grep "ALLOWED_ORIGINS=" .env.production 2>/dev/null | cut -d= -f2)
run_test "ALLOWED_ORIGINS includes localhost" "echo '$ALLOWED_ORIGINS' | grep -q 'localhost'" "success"

echo ""

# Test 4: Admin Authentication
echo "🔐 Admin Authentication Tests"
echo "----------------------------"

# Test admin login
ADMIN_RESPONSE=$(curl -s -X POST http://localhost:5001/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -H "Origin: https://viticultwhisky.co.uk" \
  -d '{"email":"admin@viticultwhisky.co.uk","password":"admin123"}')

run_test "Admin login successful" "echo '$ADMIN_RESPONSE' | grep -q '\"success\":true'" "success"
run_test "Admin login returns user data" "echo '$ADMIN_RESPONSE' | grep -q '\"user\"'" "success"
run_test "Admin login returns correct email" "echo '$ADMIN_RESPONSE' | grep -q 'admin@viticultwhisky.co.uk'" "success"

echo ""

# Test 5: API Endpoints
echo "🌐 API Endpoint Tests"
echo "-------------------"
run_test "Contact form endpoint exists" "curl -s -X POST http://localhost:5001/api/contact -H 'Content-Type: application/json' -d '{}' | grep -v 'Cannot.*POST'" "success"
run_test "Sell whisky endpoint exists" "curl -s -X POST http://localhost:5001/api/sell-whisky -H 'Content-Type: application/json' -d '{}' | grep -v 'Cannot.*POST'" "success"
run_test "Admin forms endpoint exists" "curl -s http://localhost:5001/api/admin/forms/contact -H 'Authorization: Bearer dummy' | grep -v 'Cannot.*GET'" "success"

echo ""

# Test 6: Frontend Files
echo "📂 Frontend File Tests"
echo "--------------------"
cd /var/www/viticultwhisky/frontend

run_test "Frontend build directory exists" "[ -d 'build' ]" "success"
run_test "Index.html exists" "[ -f 'build/index.html' ]" "success"
run_test "Static assets exist" "[ -d 'build/static' ]" "success"
run_test "Whisky images directory exists" "[ -d 'public/whisky' ]" "success"
run_test "Videos directory exists" "[ -d 'public/videos' ]" "success"

echo ""

# Test 7: Nginx Configuration
echo "🌍 Nginx Configuration Tests"
echo "---------------------------"
run_test "Nginx service running" "systemctl is-active nginx" "success"
run_test "Nginx config syntax valid" "nginx -t" "success"
run_test "Site config exists" "[ -f '/etc/nginx/sites-available/viticultwhisky.co.uk' ]" "success"
run_test "Site enabled" "[ -f '/etc/nginx/sites-enabled/viticultwhisky.co.uk' ]" "success"

# Check proxy configuration
run_test "Nginx proxy to correct port" "grep -q 'proxy_pass.*:5001' /etc/nginx/sites-available/viticultwhisky.co.uk" "success"

echo ""

# Test 8: SSL Certificate
echo "🔒 SSL Certificate Tests"
echo "-----------------------"
run_test "SSL certificate exists" "[ -f '/etc/letsencrypt/live/viticultwhisky.co.uk/fullchain.pem' ]" "success"
run_test "SSL private key exists" "[ -f '/etc/letsencrypt/live/viticultwhisky.co.uk/privkey.pem' ]" "success"

# Check certificate expiry
SSL_EXPIRY_DAYS=$(openssl x509 -checkend $((30*24*3600)) -noout -in /etc/letsencrypt/live/viticultwhisky.co.uk/fullchain.pem 2>/dev/null && echo "OK" || echo "EXPIRED")
run_test "SSL certificate not expiring soon" "[ '$SSL_EXPIRY_DAYS' = 'OK' ]" "success"

echo ""

# Test 9: Website Accessibility
echo "🌐 Website Accessibility Tests"
echo "-----------------------------"
run_test "Website homepage loads" "curl -s -o /dev/null -w '%{http_code}' https://viticultwhisky.co.uk | grep -q '200'" "success"
run_test "Website contact page loads" "curl -s -o /dev/null -w '%{http_code}' https://viticultwhisky.co.uk/contact | grep -q '200'" "success"
run_test "Website sell-whisky page loads" "curl -s -o /dev/null -w '%{http_code}' https://viticultwhisky.co.uk/sell-whisky | grep -q '200'" "success"
run_test "Admin login page loads" "curl -s -o /dev/null -w '%{http_code}' https://viticultwhisky.co.uk/admin/login | grep -q '200'" "success"

echo ""

# Test 10: Performance Tests
echo "⚡ Performance Tests"
echo "------------------"

# Test response times
HOMEPAGE_TIME=$(curl -s -w '%{time_total}' -o /dev/null https://viticultwhisky.co.uk)
run_test "Homepage loads under 3 seconds" "[ $(echo '$HOMEPAGE_TIME < 3.0' | bc) -eq 1 ]" "success"

API_TIME=$(curl -s -w '%{time_total}' -o /dev/null http://localhost:5001/api/health)
run_test "API responds under 1 second" "[ $(echo '$API_TIME < 1.0' | bc) -eq 1 ]" "success"

echo ""

# Test 11: Resource Usage
echo "📊 Resource Usage Tests"
echo "---------------------"

# Memory usage
MEMORY_USAGE=$(free | grep Mem | awk '{printf "%.0f", ($3/$2) * 100}')
run_test "Memory usage under 80%" "[ $MEMORY_USAGE -lt 80 ]" "success"

# Disk usage
DISK_USAGE=$(df /var/www | tail -1 | awk '{print $5}' | sed 's/%//')
run_test "Disk usage under 90%" "[ $DISK_USAGE -lt 90 ]" "success"

echo ""

# Test 12: Log Analysis
echo "📋 Log Analysis Tests"
echo "-------------------"

# Check for recent errors
ERROR_COUNT=$(pm2 logs viticult-backend --lines 50 --nostream 2>/dev/null | grep -i error | wc -l)
run_test "No critical errors in recent logs" "[ $ERROR_COUNT -lt 3 ]" "success"

NGINX_ERRORS=$(sudo tail -n 50 /var/log/nginx/error.log 2>/dev/null | grep -i error | wc -l)
run_test "No critical Nginx errors" "[ $NGINX_ERRORS -lt 3 ]" "success"

echo ""

# Test Summary
echo "📊 TEST SUMMARY"
echo "==============="
PASSED_TESTS=$((TOTAL_TESTS - FAILED_TESTS))

echo "Total Tests: $TOTAL_TESTS"
echo -e "Passed: ${GREEN}$PASSED_TESTS${NC}"
echo -e "Failed: ${RED}$FAILED_TESTS${NC}"
echo ""

if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "${GREEN}🎉 ALL TESTS PASSED${NC}"
    echo -e "${GREEN}✅ System ready for deployment${NC}"
    exit 0
elif [ $FAILED_TESTS -lt 3 ]; then
    echo -e "${YELLOW}⚠️ MINOR ISSUES DETECTED${NC}"
    echo -e "${YELLOW}Some non-critical tests failed. Review and proceed with caution.${NC}"
    exit 1
else
    echo -e "${RED}🚨 CRITICAL ISSUES DETECTED${NC}"
    echo -e "${RED}Multiple tests failed. DO NOT DEPLOY until issues are resolved.${NC}"
    exit 2
fi