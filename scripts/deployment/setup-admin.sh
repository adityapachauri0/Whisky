#!/bin/bash

# Admin Setup Script for ViticultWhisky
# This script helps set up admin credentials properly

echo "🔧 ViticultWhisky Admin Setup"
echo "============================"
echo ""

# Check if we're in the right directory
if [ ! -f "backend/package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Function to generate bcrypt hash
generate_hash() {
    local password=$1
    cd backend
    node -e "
    const bcrypt = require('bcryptjs');
    bcrypt.hash('$password', 12).then(hash => console.log(hash));
    " 2>/dev/null
    cd ..
}

# Default values
DEFAULT_EMAIL="admin@viticultwhisky.co.uk"
DEFAULT_PASSWORD="" # No default for security

echo "This script will help you set up admin credentials."
echo ""

# Ask for email
read -p "Enter admin email (default: $DEFAULT_EMAIL): " ADMIN_EMAIL
ADMIN_EMAIL=${ADMIN_EMAIL:-$DEFAULT_EMAIL}

# Validate email
if [[ ! "$ADMIN_EMAIL" =~ ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$ ]]; then
    echo "❌ Invalid email format"
    exit 1
fi

# Ask for password
echo ""
echo "Password requirements:"
echo "- Minimum 8 characters"
echo "- For production: Include uppercase, lowercase, number, and special character"
echo ""
read -s -p "Enter admin password: " ADMIN_PASSWORD
echo ""

# Check if password was provided
if [ -z "$ADMIN_PASSWORD" ]; then
    echo "❌ Password is required for security"
    echo "Please provide a password (you can use 'admin123' for development)"
    exit 1
fi

# Validate password length
if [ ${#ADMIN_PASSWORD} -lt 8 ]; then
    echo "❌ Password must be at least 8 characters"
    exit 1
fi

# Generate password hash
echo ""
echo "⏳ Generating secure password hash..."
HASH=$(generate_hash "$ADMIN_PASSWORD")

if [ -z "$HASH" ]; then
    echo "❌ Error generating password hash. Make sure bcryptjs is installed."
    echo "Run: cd backend && npm install"
    exit 1
fi

# Update backend .env file
ENV_FILE="backend/.env"
if [ ! -f "$ENV_FILE" ]; then
    echo "📝 Creating backend/.env file..."
    cp backend/.env.example "$ENV_FILE"
fi

# Update or add admin credentials
echo ""
echo "📝 Updating $ENV_FILE..."

# Update ADMIN_EMAIL
if grep -q "^ADMIN_EMAIL=" "$ENV_FILE"; then
    sed -i.bak "s|^ADMIN_EMAIL=.*|ADMIN_EMAIL=$ADMIN_EMAIL|" "$ENV_FILE"
else
    echo "ADMIN_EMAIL=$ADMIN_EMAIL" >> "$ENV_FILE"
fi

# Update ADMIN_PASSWORD_HASH
if grep -q "^ADMIN_PASSWORD_HASH=" "$ENV_FILE"; then
    sed -i.bak "s|^ADMIN_PASSWORD_HASH=.*|ADMIN_PASSWORD_HASH=$HASH|" "$ENV_FILE"
else
    echo "ADMIN_PASSWORD_HASH=$HASH" >> "$ENV_FILE"
fi

# Clean up backup files
rm -f "${ENV_FILE}.bak"

echo ""
echo "✅ Admin credentials configured successfully!"
echo ""
echo "📋 Admin Login Details:"
echo "======================"
echo "Email: $ADMIN_EMAIL"
echo "Password: [hidden]"
echo ""
echo "🚀 Next steps:"
echo "1. Start the servers: ./start-servers.sh"
echo "2. Visit: http://localhost:3000/admin/login"
echo "3. Login with the credentials above"
echo ""
echo "⚠️  Security Tips:"
echo "- Change the default password in production"
echo "- Use environment variables for sensitive data"
echo "- Enable 2FA when available"
echo "- Regularly rotate credentials"