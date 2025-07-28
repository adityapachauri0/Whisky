#!/bin/bash

# Pre-Push Cleanup Script
# Run this before pushing to VPS to avoid login issues

echo "🧹 Cleaning up before push to VPS..."
echo "===================================="

# 1. Remove duplicate/conflicting env files
echo "1️⃣ Removing duplicate .env files..."
rm -f .env.production  # Root level - wrong location
rm -f .env.production.example  # Root level - not needed
echo "✅ Cleaned root-level env files"

# 2. Fix production env format
echo ""
echo "2️⃣ Checking backend/.env.production..."
if [ -f "backend/.env.production" ]; then
    # Check if password hash is base64 (wrong format)
    if grep -q "ADMIN_PASSWORD_HASH=.*==$" backend/.env.production; then
        echo "⚠️  WARNING: Password hash appears to be Base64, not bcrypt!"
        echo "   Run ./setup-admin-production.sh to generate correct hash"
    else
        echo "✅ Password hash format looks correct"
    fi
else
    echo "❌ backend/.env.production not found!"
    echo "   Run ./setup-admin-production.sh to create it"
fi

# 3. Ensure NODE_ENV is set
echo ""
echo "3️⃣ Checking NODE_ENV in production config..."
if grep -q "NODE_ENV=production" backend/.env.production 2>/dev/null; then
    echo "✅ NODE_ENV=production is set"
else
    echo "⚠️  Adding NODE_ENV=production to backend/.env.production"
    echo "NODE_ENV=production" >> backend/.env.production
fi

# 4. Clean up test files
echo ""
echo "4️⃣ Cleaning up test files..."
rm -f test-*.js
rm -f verify-*.js
rm -f generate-*.js
rm -f debug-*.js
rm -f backend/test-*.js
rm -f backend/verify-*.js
rm -f backend/generate-*.js
echo "✅ Test files cleaned"

# 5. Clean up backups
echo ""
echo "5️⃣ Cleaning old backups..."
find . -name "*.backup*" -o -name "*.bak" | grep -v node_modules | head -10
echo "   (Keeping backups for safety)"

# 6. Verify critical files
echo ""
echo "6️⃣ Verifying critical files..."
REQUIRED_FILES=(
    "backend/.env.production"
    "backend/server.js"
    "setup-admin-production.sh"
    "deploy-admin-update.sh"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file exists"
    else
        echo "❌ $file missing!"
    fi
done

# 7. Show what will be pushed
echo ""
echo "7️⃣ Files to be committed:"
git status --porcelain | grep -E "\.env|\.sh|\.md" | grep -v node_modules

# 8. Final checklist
echo ""
echo "📋 Pre-Push Checklist:"
echo "===================="
echo "□ Password hash is bcrypt format (starts with \$2a\$ or \$2b\$)"
echo "□ Only ONE .env.production in backend/ folder"
echo "□ NODE_ENV=production is set"
echo "□ No .env files in root directory"
echo "□ Admin email is admin@viticultwhisky.co.uk"
echo ""
echo "🚀 Ready to push? Make sure to:"
echo "1. git add -A"
echo "2. git commit -m 'Fixed admin login configuration'"
echo "3. git push"
echo "4. On VPS: git pull && ./deploy-admin-update.sh"