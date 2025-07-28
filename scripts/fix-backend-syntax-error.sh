#!/bin/bash

# Fix Backend Syntax Error Script
# Based on Master Troubleshooting Guide and Playwright diagnosis

echo "🔧 FIXING BACKEND SYNTAX ERROR"
echo "=============================="
echo "Issue: 502 Bad Gateway - Backend not responding on port 5001"
echo "Cause: Syntax error in admin.controller.js - 'next is not defined'"
echo ""

# Based on diagnosis: The issue is in admin.controller.js line 144
# exports.verifyAdmin = async (req, res, _next) but calls next()

echo "1️⃣ Creating fixed admin.controller.js..."

cat > /tmp/admin-controller-fix.js << 'EOF'
// Fix for exports.verifyAdmin function - line 144
// Change from: exports.verifyAdmin = async (req, res, _next) => {
// To: exports.verifyAdmin = async (req, res, next) => {

# VPS Commands to run:
cd /var/www/viticultwhisky/backend

# Fix the specific syntax error
sed -i 's/exports\.verifyAdmin = async (req, res, _next) => {/exports.verifyAdmin = async (req, res, next) => {/' controllers/admin.controller.js

# Also fix any other functions missing next parameter  
sed -i 's/exports\.adminLogout = async (req, res) => {/exports.adminLogout = async (req, res, next) => {/' controllers/admin.controller.js
sed -i 's/exports\.changePassword = async (req, res) => {/exports.changePassword = async (req, res, next) => {/' controllers/admin.controller.js
sed -i 's/exports\.exportSubmissions = async (req, res) => {/exports.exportSubmissions = async (req, res, next) => {/' controllers/admin.controller.js

# Restart backend
pm2 restart viticult-backend --update-env

# Test if it's working
sleep 3
curl -X POST https://viticultwhisky.co.uk/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -H "Origin: https://viticultwhisky.co.uk" \
  -d '{"email":"admin@viticultwhisky.co.uk","password":"admin123"}'

EOF

echo "✅ Fix script created"
echo ""
echo "📋 VPS COMMANDS TO RUN:"
echo "======================"
echo "scp this file to VPS and run the commands above"
echo ""
echo "OR run these commands directly on VPS:"
echo ""
echo "cd /var/www/viticultwhisky/backend"
echo ""
echo "# Fix the syntax error:"
echo "sed -i 's/exports\.verifyAdmin = async (req, res, _next) => {/exports.verifyAdmin = async (req, res, next) => {/' controllers/admin.controller.js"
echo ""
echo "# Restart backend:"
echo "pm2 restart viticult-backend --update-env"
echo ""
echo "# Test:"
echo "curl -X POST https://viticultwhisky.co.uk/api/auth/admin/login \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -H \"Origin: https://viticultwhisky.co.uk\" \\"
echo "  -d '{\"email\":\"admin@viticultwhisky.co.uk\",\"password\":\"admin123\"}'"
echo ""
echo "Expected result: {\"success\":true,\"data\":{\"user\":{...}}}"
echo ""
echo "🎯 This addresses the exact 502 Bad Gateway issue identified by Playwright"