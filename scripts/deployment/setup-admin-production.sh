#!/bin/bash

# Production Admin Setup Script for ViticultWhisky
# This script helps set up secure admin credentials for production

set -e  # Exit on error

echo "🔐 ViticultWhisky Production Admin Setup"
echo "========================================"
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

# Function to generate secure password
generate_secure_password() {
    # Generate a 16-character password with uppercase, lowercase, numbers, and symbols
    openssl rand -base64 32 | tr -d "=+/" | cut -c1-16 | sed 's/\(.*\)/\1@Prod2024!/'
}

# Function to encrypt credentials
encrypt_credentials() {
    local data=$1
    local key=$2
    echo "$data" | openssl enc -aes-256-cbc -salt -pbkdf2 -pass pass:"$key" -base64
}

# Check if production env file exists
PROD_ENV_FILE="backend/.env.production"
if [ ! -f "$PROD_ENV_FILE" ]; then
    echo "📝 Creating production environment file..."
    cp backend/.env.example "$PROD_ENV_FILE"
fi

echo "⚠️  PRODUCTION SETUP - Please follow security best practices!"
echo ""

# Get production domain
read -p "Enter your production domain (e.g., viticultwhisky.com): " DOMAIN
if [ -z "$DOMAIN" ]; then
    echo "❌ Domain is required for production"
    exit 1
fi

# Set production email
DEFAULT_PROD_EMAIL="admin@${DOMAIN}"
read -p "Enter production admin email (default: $DEFAULT_PROD_EMAIL): " ADMIN_EMAIL
ADMIN_EMAIL=${ADMIN_EMAIL:-$DEFAULT_PROD_EMAIL}

# Validate email
if [[ ! "$ADMIN_EMAIL" =~ ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$ ]]; then
    echo "❌ Invalid email format"
    exit 1
fi

echo ""
echo "Password Options:"
echo "1. Generate secure random password (recommended)"
echo "2. Enter custom password"
echo ""
read -p "Choose option (1 or 2): " PASSWORD_OPTION

if [ "$PASSWORD_OPTION" = "1" ]; then
    ADMIN_PASSWORD=$(generate_secure_password)
    echo ""
    echo "🔑 Generated secure password: $ADMIN_PASSWORD"
    echo "⚠️  SAVE THIS PASSWORD SECURELY - IT CANNOT BE RECOVERED!"
    echo ""
    read -p "Press Enter to continue after saving the password..."
else
    echo ""
    echo "Password requirements for production:"
    echo "- Minimum 12 characters"
    echo "- Must include uppercase, lowercase, number, and special character"
    echo "- Avoid common patterns and dictionary words"
    echo ""
    
    while true; do
        read -s -p "Enter production password: " ADMIN_PASSWORD
        echo ""
        
        # Validate password strength
        if [ ${#ADMIN_PASSWORD} -lt 12 ]; then
            echo "❌ Password must be at least 12 characters for production"
            continue
        fi
        
        if ! [[ "$ADMIN_PASSWORD" =~ [A-Z] ]] || ! [[ "$ADMIN_PASSWORD" =~ [a-z] ]] || 
           ! [[ "$ADMIN_PASSWORD" =~ [0-9] ]] || ! [[ "$ADMIN_PASSWORD" =~ [^a-zA-Z0-9] ]]; then
            echo "❌ Password must contain uppercase, lowercase, number, and special character"
            continue
        fi
        
        read -s -p "Confirm password: " CONFIRM_PASSWORD
        echo ""
        
        if [ "$ADMIN_PASSWORD" != "$CONFIRM_PASSWORD" ]; then
            echo "❌ Passwords don't match"
            continue
        fi
        
        break
    done
fi

# Generate password hash
echo ""
echo "⏳ Generating secure password hash..."
HASH=$(generate_hash "$ADMIN_PASSWORD")

if [ -z "$HASH" ]; then
    echo "❌ Error generating password hash"
    exit 1
fi

# Generate other production secrets
echo "🔐 Generating production secrets..."
JWT_SECRET=$(openssl rand -hex 64)
SESSION_SECRET=$(openssl rand -hex 32)
ENCRYPTION_KEY=$(openssl rand -hex 32)
COOKIE_SECRET=$(openssl rand -hex 32)

# Create master password for credential encryption
echo ""
read -s -p "Enter master password for credential backup (remember this!): " MASTER_PASSWORD
echo ""

# Create encrypted backup
BACKUP_DATA=$(cat <<EOF
ADMIN_EMAIL=$ADMIN_EMAIL
ADMIN_PASSWORD=$ADMIN_PASSWORD
DOMAIN=$DOMAIN
CREATED=$(date -u +"%Y-%m-%d %H:%M:%S UTC")
EOF
)

ENCRYPTED_BACKUP=$(encrypt_credentials "$BACKUP_DATA" "$MASTER_PASSWORD")

# Save encrypted backup
BACKUP_FILE="production-credentials-$(date +%Y%m%d-%H%M%S).enc"
echo "$ENCRYPTED_BACKUP" > "$BACKUP_FILE"
echo "📄 Encrypted backup saved to: $BACKUP_FILE"

# Update production .env file
echo ""
echo "📝 Updating production environment file..."

# Update or add values
update_env_var() {
    local file=$1
    local key=$2
    local value=$3
    
    if grep -q "^$key=" "$file"; then
        sed -i.bak "s|^$key=.*|$key=$value|" "$file"
    else
        echo "$key=$value" >> "$file"
    fi
}

update_env_var "$PROD_ENV_FILE" "NODE_ENV" "production"
update_env_var "$PROD_ENV_FILE" "ADMIN_EMAIL" "$ADMIN_EMAIL"
update_env_var "$PROD_ENV_FILE" "ADMIN_PASSWORD_HASH" "$HASH"
update_env_var "$PROD_ENV_FILE" "JWT_SECRET" "$JWT_SECRET"
update_env_var "$PROD_ENV_FILE" "SESSION_SECRET" "$SESSION_SECRET"
update_env_var "$PROD_ENV_FILE" "ENCRYPTION_KEY" "$ENCRYPTION_KEY"
update_env_var "$PROD_ENV_FILE" "COOKIE_SECRET" "$COOKIE_SECRET"
update_env_var "$PROD_ENV_FILE" "DOMAIN" "$DOMAIN"

# Clean up backup files
rm -f "${PROD_ENV_FILE}.bak"

# Create deployment-ready file
DEPLOY_FILE="deploy-env-$(date +%Y%m%d-%H%M%S).sh"
cat > "$DEPLOY_FILE" <<EOF
#!/bin/bash
# Deployment script for production environment variables
# Generated on $(date)

# Run this on your production server
cat >> .env <<'END_ENV'
NODE_ENV=production
ADMIN_EMAIL=$ADMIN_EMAIL
ADMIN_PASSWORD_HASH=$HASH
JWT_SECRET=$JWT_SECRET
SESSION_SECRET=$SESSION_SECRET
ENCRYPTION_KEY=$ENCRYPTION_KEY
COOKIE_SECRET=$COOKIE_SECRET
DOMAIN=$DOMAIN
END_ENV

echo "✅ Production environment variables added"
echo "⚠️  Remember to restart your application"
EOF

chmod +x "$DEPLOY_FILE"

echo ""
echo "✅ Production setup complete!"
echo ""
echo "📋 Production Admin Credentials:"
echo "================================"
echo "Email: $ADMIN_EMAIL"
echo "Password: [saved in encrypted backup]"
echo ""
echo "🚀 Next Steps:"
echo "1. Copy $DEPLOY_FILE to your production server"
echo "2. Run it to set environment variables"
echo "3. Restart your application"
echo "4. Test login at https://$DOMAIN/admin/login"
echo ""
echo "📁 Generated Files:"
echo "- $BACKUP_FILE (encrypted backup - store securely)"
echo "- $DEPLOY_FILE (deployment script)"
echo "- $PROD_ENV_FILE (local production config)"
echo ""
echo "🔒 Security Checklist:"
echo "□ Store encrypted backup in secure location"
echo "□ Delete deployment script after use"
echo "□ Enable HTTPS on production"
echo "□ Set up firewall rules"
echo "□ Enable rate limiting"
echo "□ Set up monitoring/alerts"
echo "□ Regular password rotation (90 days)"
echo ""
echo "🆘 Emergency Recovery:"
echo "To decrypt backup: cat $BACKUP_FILE | openssl enc -aes-256-cbc -d -pbkdf2 -base64"