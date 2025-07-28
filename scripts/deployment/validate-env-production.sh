#!/bin/bash

# Production Environment Validation Script
# Run this BEFORE every deployment to prevent recurring issues

echo "🔍 Production Environment Validation"
echo "=================================="

cd /var/www/viticultwhisky/backend

# Check if .env.production exists
if [ ! -f .env.production ]; then
    echo "❌ ERROR: .env.production file not found"
    exit 1
fi

echo "✅ .env.production file exists"

# Validate ENCRYPTION_KEY length
ENCRYPTION_KEY=$(grep "ENCRYPTION_KEY=" .env.production | cut -d= -f2)
KEY_LENGTH=$(echo -n "$ENCRYPTION_KEY" | wc -c)

if [ "$KEY_LENGTH" -ne 32 ]; then
    echo "❌ ERROR: ENCRYPTION_KEY is $KEY_LENGTH characters, must be exactly 32"
    echo "🔧 Generating new 32-character key..."
    NEW_KEY=$(openssl rand -hex 16)
    sed -i "s/ENCRYPTION_KEY=.*/ENCRYPTION_KEY=$NEW_KEY/" .env.production
    echo "✅ ENCRYPTION_KEY fixed: $NEW_KEY"
else
    echo "✅ ENCRYPTION_KEY length correct: $KEY_LENGTH characters"
fi

# Validate ALLOWED_ORIGINS includes localhost for internal calls
ALLOWED_ORIGINS=$(grep "ALLOWED_ORIGINS=" .env.production | cut -d= -f2)

if [[ "$ALLOWED_ORIGINS" != *"localhost"* ]]; then
    echo "❌ ERROR: ALLOWED_ORIGINS missing localhost for internal API calls"
    echo "🔧 Adding localhost to ALLOWED_ORIGINS..."
    sed -i 's/ALLOWED_ORIGINS=.*/ALLOWED_ORIGINS=https:\/\/viticultwhisky.co.uk,https:\/\/www.viticultwhisky.co.uk,http:\/\/localhost:5001,http:\/\/127.0.0.1:5001/' .env.production
    echo "✅ ALLOWED_ORIGINS fixed"
else
    echo "✅ ALLOWED_ORIGINS includes localhost"
fi

# Validate NODE_ENV
if [ "$NODE_ENV" != "production" ]; then
    echo "❌ ERROR: NODE_ENV not set to production"
    echo "🔧 Setting NODE_ENV=production"
    export NODE_ENV=production
    echo "✅ NODE_ENV set to production"
else
    echo "✅ NODE_ENV is production"
fi

# Check required environment variables
REQUIRED_VARS=("ADMIN_EMAIL" "ADMIN_PASSWORD_HASH" "JWT_SECRET" "SESSION_SECRET" "MONGODB_URI")

for var in "${REQUIRED_VARS[@]}"; do
    if ! grep -q "^$var=" .env.production; then
        echo "❌ ERROR: Missing required variable: $var"
        exit 1
    else
        echo "✅ $var is set"
    fi
done

# Validate password hash format
ADMIN_HASH=$(grep "ADMIN_PASSWORD_HASH=" .env.production | cut -d= -f2)
if [[ "$ADMIN_HASH" == \$2a\$* ]] || [[ "$ADMIN_HASH" == \$2b\$* ]]; then
    echo "✅ Admin password hash format correct (bcrypt)"
else
    echo "❌ ERROR: Admin password hash not in bcrypt format"
    echo "   Current: $ADMIN_HASH"
    echo "   Should start with \$2a\$ or \$2b\$"
    exit 1
fi

echo ""
echo "🎉 All environment validations passed!"
echo "🚀 Safe to restart backend with: pm2 restart viticult-backend --update-env"
echo ""