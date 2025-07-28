#!/bin/bash

# Production Secrets Generator
# This script generates secure random secrets for production

echo "🔐 Generating Production Secrets for ViticultWhisky"
echo "=================================================="
echo ""

# Function to generate secure random string
generate_secret() {
    openssl rand -base64 $1 | tr -d '\n'
}

# Generate secrets
JWT_SECRET=$(generate_secret 64)
SESSION_SECRET=$(generate_secret 64)
CSRF_SECRET=$(generate_secret 32)
ADMIN_PASSWORD=$(generate_secret 16)

# Generate MongoDB password if needed
MONGO_PASSWORD=$(generate_secret 32)

# Create .env.production with generated secrets
cat > .env.production <<EOF
# Production Environment Variables
# Generated on: $(date)
# IMPORTANT: Keep this file secure and never commit to git

# MongoDB Configuration (update with your MongoDB auth)
MONGODB_URI=mongodb://viticultapp:${MONGO_PASSWORD}@localhost:27017/viticultwhisky?authSource=viticultwhisky

# Security Keys (auto-generated)
JWT_SECRET=${JWT_SECRET}
SESSION_SECRET=${SESSION_SECRET}
CSRF_SECRET=${CSRF_SECRET}

# Email Configuration (UPDATE THESE WITH REAL VALUES)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password

# Payment Gateway (UPDATE THESE WITH REAL VALUES)
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-secret

# Admin Configuration
ADMIN_EMAIL=admin@viticultwhisky.com
ADMIN_PASSWORD=${ADMIN_PASSWORD}

# Application Settings
NODE_ENV=production
PORT=5001
FRONTEND_URL=https://viticultwhisky.com

# Rate Limiting
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=60
AUTH_RATE_LIMIT_MAX=3

# Security Settings
SECURE_COOKIES=true
SAME_SITE=strict
ACCOUNT_LOCKOUT_ATTEMPTS=5
ACCOUNT_LOCKOUT_DURATION=1800000

# Logging
LOG_LEVEL=error
LOG_FILE=./logs/app.log

# Session Configuration
SESSION_MAX_AGE=86400000
SESSION_CHECK_PERIOD=900000

# CORS
CORS_ORIGIN=https://viticultwhisky.com
CORS_CREDENTIALS=true

# Content Security Policy
CSP_REPORT_URI=/api/csp-report
EOF

# Add to .gitignore if not already present
if ! grep -q ".env.production" .gitignore 2>/dev/null; then
    echo -e "\n# Production environment variables\n.env.production" >> .gitignore
    echo "✅ Added .env.production to .gitignore"
fi

# Create secrets backup file (encrypted)
echo ""
echo "📝 Creating encrypted backup of secrets..."
cat > secrets-backup.txt <<EOF
ViticultWhisky Production Secrets Backup
Generated: $(date)
========================================

JWT_SECRET:
${JWT_SECRET}

SESSION_SECRET:
${SESSION_SECRET}

CSRF_SECRET:
${CSRF_SECRET}

ADMIN_PASSWORD:
${ADMIN_PASSWORD}

MONGODB_PASSWORD:
${MONGO_PASSWORD}

IMPORTANT REMINDERS:
1. Update EMAIL_USER and EMAIL_PASS with real email credentials
2. Update RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET with real payment credentials
3. Update MONGODB_URI with your actual MongoDB connection string
4. Store this file securely and delete after saving elsewhere
5. Enable 2FA for admin account after first login
EOF

# Encrypt the backup
openssl enc -aes-256-cbc -salt -in secrets-backup.txt -out secrets-backup.enc -k "$(generate_secret 32)"
rm secrets-backup.txt

echo ""
echo "✅ Production secrets generated successfully!"
echo ""
echo "📋 Next Steps:"
echo "1. Update .env.production with your real email and payment credentials"
echo "2. Save the generated secrets in a secure password manager"
echo "3. Update your MongoDB connection string if different"
echo "4. Deploy using: npm run deploy:production"
echo ""
echo "🔒 Security Checklist:"
echo "[ ] Store secrets-backup.enc in secure location"
echo "[ ] Update email credentials in .env.production"
echo "[ ] Update payment gateway credentials"
echo "[ ] Enable MongoDB authentication"
echo "[ ] Set up SSL certificates"
echo "[ ] Configure firewall rules"
echo "[ ] Set up monitoring/alerting"
echo "[ ] Test backup and recovery procedures"
echo ""
echo "⚠️  IMPORTANT: Delete any files containing plaintext secrets after securing them!"