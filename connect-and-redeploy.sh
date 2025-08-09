#!/bin/bash

# Automated VPS Connection and Redeployment Script
# This script will connect to VPS and execute the redeployment

echo "🚀 Starting VPS Redeployment Process..."
echo "Connecting to VPS: 31.97.57.193"

expect -c "
  spawn ssh root@31.97.57.193
  expect \"password:\"
  send \"w(7rjMOF4'nzhIOuOdPF\r\"
  expect \"#\"
  
  # Execute redeployment commands
  send \"echo '🛑 Stopping services...'\r\"
  expect \"#\"
  
  send \"pm2 stop all\r\"
  expect \"#\"
  
  send \"systemctl stop nginx\r\"
  expect \"#\"
  
  send \"systemctl stop mongod\r\"
  expect \"#\"
  
  send \"echo '💾 Creating backup...'\r\"
  expect \"#\"
  
  send \"BACKUP_DIR=/tmp/whisky-backup-\$(date +%Y%m%d-%H%M%S)\r\"
  expect \"#\"
  
  send \"mkdir -p \$BACKUP_DIR\r\"
  expect \"#\"
  
  send \"if [ -d '/var/www/viticultwhisky' ]; then find /var/www/viticultwhisky -name '*.env*' -not -path '*/node_modules/*' -exec cp {} \$BACKUP_DIR/ \\; 2>/dev/null || true; fi\r\"
  expect \"#\"
  
  send \"systemctl start mongod && sleep 3\r\"
  expect \"#\"
  
  send \"mongodump --db=viticult_whisky --out=\$BACKUP_DIR/mongodb/ 2>/dev/null || true\r\"
  expect \"#\"
  
  send \"systemctl stop mongod\r\"
  expect \"#\"
  
  send \"echo '🗑️ Removing old project...'\r\"
  expect \"#\"
  
  send \"rm -rf /var/www/viticultwhisky\r\"
  expect \"#\"
  
  send \"echo '📥 Cloning fresh from GitHub...'\r\"
  expect \"#\"
  
  send \"cd /var/www\r\"
  expect \"#\"
  
  send \"git clone https://github.com/adityapachauri0/whisky.git viticultwhisky\r\"
  expect \"#\"
  
  send \"cd viticultwhisky\r\"
  expect \"#\"
  
  send \"echo '🔧 Setting up environment...'\r\"
  expect \"#\"
  
  send \"cat > backend/.env << 'EOF'
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://localhost:27017/viticult_whisky
JWT_SECRET=whisky-jwt-secret-production-2024
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
CORS_ORIGIN=https://viticultwhisky.co.uk
EOF\r\"
  expect \"#\"
  
  send \"cat > frontend/.env << 'EOF'
REACT_APP_API_URL=https://viticultwhisky.co.uk/api
REACT_APP_ENVIRONMENT=production
EOF\r\"
  expect \"#\"
  
  send \"echo '📦 Installing backend dependencies...'\r\"
  expect \"#\"
  
  send \"cd backend && npm ci --production\r\"
  expect \"#\"
  
  send \"echo '📦 Installing frontend and building...'\r\"
  expect \"#\"
  
  send \"cd ../frontend && npm ci\r\"
  expect \"#\"
  
  send \"npm run build\r\"
  expect \"#\"
  
  send \"cd ..\r\"
  expect \"#\"
  
  send \"echo '🔐 Setting permissions...'\r\"
  expect \"#\"
  
  send \"chown -R www-data:www-data /var/www/viticultwhisky\r\"
  expect \"#\"
  
  send \"echo '🚀 Starting services...'\r\"
  expect \"#\"
  
  send \"systemctl start mongod && systemctl enable mongod\r\"
  expect \"#\"
  
  send \"pm2 delete all 2>/dev/null || true\r\"
  expect \"#\"
  
  send \"pm2 start backend/server.js --name 'whisky-backend'\r\"
  expect \"#\"
  
  send \"pm2 startup\r\"
  expect \"#\"
  
  send \"pm2 save\r\"
  expect \"#\"
  
  send \"systemctl start nginx && systemctl enable nginx\r\"
  expect \"#\"
  
  send \"echo '✅ Deployment complete!'\r\"
  expect \"#\"
  
  send \"pm2 status\r\"
  expect \"#\"
  
  send \"systemctl status nginx --no-pager -l\r\"
  expect \"#\"
  
  send \"echo '🌐 Site: https://viticultwhisky.co.uk'\r\"
  expect \"#\"
  
  send \"echo '💾 Backup: '\$BACKUP_DIR\r\"
  expect \"#\"
  
  interact
"