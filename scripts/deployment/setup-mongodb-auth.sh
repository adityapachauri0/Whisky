#!/bin/bash

# MongoDB Authentication Setup Script for Production
# This script sets up MongoDB with authentication enabled

echo "🔐 MongoDB Authentication Setup for ViticultWhisky"
echo "================================================"

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "❌ MongoDB is not running. Please start MongoDB first."
    exit 1
fi

# Create admin user
echo "📝 Creating MongoDB admin user..."
mongo admin <<EOF
db.createUser({
  user: "viticultadmin",
  pwd: "$(openssl rand -base64 32)",
  roles: [
    { role: "userAdminAnyDatabase", db: "admin" },
    { role: "readWriteAnyDatabase", db: "admin" }
  ]
})
EOF

# Create application user
echo "📝 Creating application database user..."
MONGO_APP_PASSWORD=$(openssl rand -base64 32)
mongo viticultwhisky <<EOF
use viticultwhisky
db.createUser({
  user: "viticultapp",
  pwd: "$MONGO_APP_PASSWORD",
  roles: [
    { role: "readWrite", db: "viticultwhisky" }
  ]
})
EOF

# Create .env.production with MongoDB credentials
echo "📄 Creating .env.production with secure credentials..."
cat > .env.production <<EOL
# MongoDB Configuration (with authentication)
MONGODB_URI=mongodb://viticultapp:${MONGO_APP_PASSWORD}@localhost:27017/viticultwhisky?authSource=viticultwhisky

# Security Keys (auto-generated)
JWT_SECRET=$(openssl rand -base64 64)
SESSION_SECRET=$(openssl rand -base64 64)
CSRF_SECRET=$(openssl rand -base64 32)

# Email Configuration (update with real credentials)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Razorpay (update with real credentials)
RAZORPAY_KEY_ID=your-razorpay-key
RAZORPAY_KEY_SECRET=your-razorpay-secret

# Admin Configuration
ADMIN_EMAIL=admin@viticultwhisky.com
ADMIN_PASSWORD=$(openssl rand -base64 16)

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
EOL

# Create MongoDB configuration file
echo "📄 Creating MongoDB configuration file..."
sudo tee /etc/mongod.conf > /dev/null <<EOL
# MongoDB configuration with authentication

storage:
  dbPath: /var/lib/mongodb
  journal:
    enabled: true

systemLog:
  destination: file
  logAppend: true
  path: /var/log/mongodb/mongod.log

net:
  port: 27017
  bindIp: 127.0.0.1

security:
  authorization: enabled

processManagement:
  timeZoneInfo: /usr/share/zoneinfo
EOL

echo ""
echo "✅ MongoDB authentication setup complete!"
echo ""
echo "⚠️  IMPORTANT: Save these credentials securely:"
echo "================================================"
echo "MongoDB App Password: $MONGO_APP_PASSWORD"
echo "Admin Password: Check .env.production file"
echo ""
echo "📋 Next steps:"
echo "1. Restart MongoDB with: sudo systemctl restart mongod"
echo "2. Update your application to use .env.production"
echo "3. Test connection with: npm run test:db"
echo "4. Delete this script after setup"
echo ""
echo "🔒 Security Notes:"
echo "- MongoDB auth is now required for all connections"
echo "- Passwords are randomly generated for security"
echo "- Update EMAIL and RAZORPAY credentials in .env.production"
echo "- Keep .env.production secure and never commit it to git"