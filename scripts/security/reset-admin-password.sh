#!/bin/bash

# Password Reset Utility for ViticultWhisky Admin
# Use this when you forget the admin password

echo "🔐 Admin Password Reset Utility"
echo "==============================="
echo ""

# Check if we're in the right directory
if [ ! -f "backend/package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Check if backend .env exists
if [ ! -f "backend/.env" ]; then
    echo "❌ Error: backend/.env file not found"
    echo "Run ./setup-admin.sh first to create it"
    exit 1
fi

# Get current admin email
CURRENT_EMAIL=$(grep "^ADMIN_EMAIL=" backend/.env | cut -d'=' -f2)

if [ -z "$CURRENT_EMAIL" ]; then
    echo "❌ Error: No admin email found in backend/.env"
    echo "Run ./setup-admin.sh to configure admin credentials"
    exit 1
fi

echo "Current admin email: $CURRENT_EMAIL"
echo ""

# Ask for new password
echo "Enter new admin password"
echo "Requirements:"
echo "- Minimum 8 characters"
echo "- For production: Include uppercase, lowercase, number, and special character"
echo ""

# Read password with confirmation
while true; do
    read -s -p "New password: " PASSWORD1
    echo ""
    read -s -p "Confirm password: " PASSWORD2
    echo ""
    
    if [ "$PASSWORD1" != "$PASSWORD2" ]; then
        echo "❌ Passwords don't match. Try again."
        echo ""
    else
        break
    fi
done

# Validate password length
if [ ${#PASSWORD1} -lt 8 ]; then
    echo "❌ Password must be at least 8 characters"
    exit 1
fi

# Generate new hash
echo ""
echo "⏳ Generating new password hash..."

cd backend
HASH=$(node -e "
const bcrypt = require('bcryptjs');
bcrypt.hash('$PASSWORD1', 12).then(hash => console.log(hash));
" 2>/dev/null)
cd ..

if [ -z "$HASH" ]; then
    echo "❌ Error generating password hash"
    echo "Make sure bcryptjs is installed: cd backend && npm install"
    exit 1
fi

# Update the .env file
sed -i.bak "s|^ADMIN_PASSWORD_HASH=.*|ADMIN_PASSWORD_HASH=$HASH|" backend/.env
rm -f backend/.env.bak

echo ""
echo "✅ Password reset successfully!"
echo ""
echo "📋 Updated Admin Credentials:"
echo "============================"
echo "Email: $CURRENT_EMAIL"
echo "Password: [updated]"
echo ""
echo "⚠️  Important: Restart the backend server for changes to take effect"
echo ""
echo "To restart servers:"
echo "1. Kill existing processes: pkill -f nodemon"
echo "2. Start servers: ./start-servers.sh"
echo ""