#!/bin/bash

# Server Cleanup and Audit Script
# Run this on your VPS to identify and fix file organization issues

echo "🔍 Whisky Project Server Audit & Cleanup Script"
echo "=============================================="

# Find all whisky-related directories
echo -e "\n📁 Finding all whisky project directories..."
find / -type d -name "*whisky*" 2>/dev/null | grep -v "/proc" | grep -v "/sys"

# Find duplicate backend files
echo -e "\n🔄 Finding duplicate backend files..."
find / -name "contact.controller.js" 2>/dev/null | grep -v "/proc" | grep -v "/sys"
find / -name "getClientIp.js" 2>/dev/null | grep -v "/proc" | grep -v "/sys"
find / -name "server.js" -path "*/backend/*" 2>/dev/null | grep -v "/proc" | grep -v "/sys"

# Check PM2 processes
echo -e "\n🚀 Current PM2 processes..."
pm2 list
pm2 info whisky-backend | grep -E "script path|cwd|error file|out file"

# Check nginx configurations
echo -e "\n🌐 Nginx configurations for whisky..."
grep -r "viticultwhisky" /etc/nginx/sites-* 2>/dev/null

# Find the actual running backend
echo -e "\n🎯 Finding actual running backend..."
ps aux | grep -i "node.*whisky" | grep -v grep
lsof -i :5001 | grep LISTEN

# Check for multiple node_modules
echo -e "\n📦 Finding node_modules directories..."
find / -type d -name "node_modules" -path "*whisky*" 2>/dev/null | grep -v "/proc" | grep -v "/sys"

# Get directory sizes
echo -e "\n💾 Directory sizes..."
du -sh /var/www/viticultwhisky/* 2>/dev/null
du -sh /home/*/whisky* 2>/dev/null
du -sh /root/whisky* 2>/dev/null

# Save results
echo -e "\n💾 Saving audit results to /tmp/whisky-audit.txt..."