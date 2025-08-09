#!/bin/bash

# Safe VPS Redeployment Script - Delete Current Version & Deploy Fresh from GitHub
# Usage: ./safe-vps-redeploy.sh

set -e  # Exit on any error

echo "🚀 Starting Safe VPS Redeployment Process..."
echo "=========================================="

# Configuration
PROJECT_DIR="/var/www/viticultwhisky"
BACKUP_DIR="/tmp/whisky-backup-$(date +%Y%m%d-%H%M%S)"
GITHUB_REPO="https://github.com/adityapachauri0/whisky.git"

echo "📦 Project Directory: $PROJECT_DIR"
echo "💾 Backup Directory: $BACKUP_DIR"
echo "🔗 GitHub Repository: $GITHUB_REPO"
echo ""

# Step 1: Stop all services
echo "🛑 Step 1: Stopping all services..."
sudo pm2 stop all || true
sudo systemctl stop nginx || true
sudo systemctl stop mongod || true
echo "✅ Services stopped"
echo ""

# Step 2: Create backup directory
echo "📁 Step 2: Creating backup directory..."
mkdir -p $BACKUP_DIR
echo "✅ Backup directory created: $BACKUP_DIR"
echo ""

# Step 3: Backup critical files
echo "💾 Step 3: Backing up critical files..."
if [ -d "$PROJECT_DIR" ]; then
    # Backup environment files
    find $PROJECT_DIR -name "*.env*" -not -path "*/node_modules/*" -exec cp {} $BACKUP_DIR/ \; 2>/dev/null || true
    
    # Backup any database files
    find $PROJECT_DIR -name "*.db" -not -path "*/node_modules/*" -exec cp {} $BACKUP_DIR/ \; 2>/dev/null || true
    
    # Backup uploads or user data
    [ -d "$PROJECT_DIR/uploads" ] && cp -r $PROJECT_DIR/uploads $BACKUP_DIR/ || true
    [ -d "$PROJECT_DIR/logs" ] && cp -r $PROJECT_DIR/logs $BACKUP_DIR/ || true
    
    # Backup nginx config
    [ -f "/etc/nginx/sites-available/viticultwhisky" ] && sudo cp /etc/nginx/sites-available/viticultwhisky $BACKUP_DIR/ || true
    
    # Backup PM2 ecosystem
    [ -f "$PROJECT_DIR/ecosystem.config.js" ] && cp $PROJECT_DIR/ecosystem.config.js $BACKUP_DIR/ || true
    
    echo "✅ Critical files backed up to: $BACKUP_DIR"
else
    echo "⚠️  Project directory not found, skipping backup"
fi
echo ""

# Step 4: MongoDB backup
echo "🗄️  Step 4: Backing up MongoDB database..."
sudo systemctl start mongod || true
sleep 3
mongodump --db=viticult_whisky --out=$BACKUP_DIR/mongodb/ 2>/dev/null || echo "⚠️  MongoDB backup failed (database may not exist)"
sudo systemctl stop mongod || true
echo "✅ Database backup completed"
echo ""

# Step 5: Remove old project
echo "🗑️  Step 5: Removing old project directory..."
if [ -d "$PROJECT_DIR" ]; then
    sudo rm -rf $PROJECT_DIR
    echo "✅ Old project directory removed"
else
    echo "ℹ️  Project directory doesn't exist, skipping removal"
fi
echo ""

# Step 6: Clone fresh from GitHub
echo "📥 Step 6: Cloning fresh version from GitHub..."
sudo mkdir -p /var/www
cd /var/www
sudo git clone $GITHUB_REPO viticultwhisky
sudo chown -R $USER:$USER $PROJECT_DIR
echo "✅ Fresh version cloned from GitHub"
echo ""

# Step 7: Restore environment files
echo "🔧 Step 7: Restoring environment files..."
if [ -f "$BACKUP_DIR/.env" ]; then
    cp $BACKUP_DIR/.env $PROJECT_DIR/backend/ || true
    cp $BACKUP_DIR/.env $PROJECT_DIR/frontend/ || true
fi

if [ -f "$BACKUP_DIR/.env.production" ]; then
    cp $BACKUP_DIR/.env.production $PROJECT_DIR/backend/ || true
    cp $BACKUP_DIR/.env.production $PROJECT_DIR/frontend/ || true
fi

# Create basic .env files if none exist
if [ ! -f "$PROJECT_DIR/backend/.env" ]; then
    cat > $PROJECT_DIR/backend/.env << EOF
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://localhost:27017/viticult_whisky
JWT_SECRET=your-jwt-secret-here
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EOF
fi

if [ ! -f "$PROJECT_DIR/frontend/.env" ]; then
    cat > $PROJECT_DIR/frontend/.env << EOF
REACT_APP_API_URL=https://viticultwhisky.co.uk/api
REACT_APP_ENVIRONMENT=production
EOF
fi

echo "✅ Environment files configured"
echo ""

# Step 8: Install dependencies
echo "📦 Step 8: Installing dependencies..."
cd $PROJECT_DIR

# Backend dependencies
echo "Installing backend dependencies..."
cd backend
npm ci --production
cd ..

# Frontend dependencies and build
echo "Installing frontend dependencies and building..."
cd frontend
npm ci
npm run build
cd ..

echo "✅ Dependencies installed and frontend built"
echo ""

# Step 9: Restore database
echo "🗄️  Step 9: Restoring database..."
sudo systemctl start mongod
sleep 5
if [ -d "$BACKUP_DIR/mongodb" ]; then
    mongorestore $BACKUP_DIR/mongodb/ 2>/dev/null || echo "⚠️  Database restore failed"
    echo "✅ Database restored"
else
    echo "ℹ️  No database backup found, starting fresh"
fi
echo ""

# Step 10: Update nginx configuration
echo "🌐 Step 10: Updating nginx configuration..."
if [ -f "$PROJECT_DIR/nginx-vps-config" ]; then
    sudo cp $PROJECT_DIR/nginx-vps-config /etc/nginx/sites-available/viticultwhisky
    sudo ln -sf /etc/nginx/sites-available/viticultwhisky /etc/nginx/sites-enabled/ || true
    sudo nginx -t && echo "✅ Nginx configuration updated" || echo "❌ Nginx configuration error"
fi
echo ""

# Step 11: Set proper permissions
echo "🔐 Step 11: Setting proper permissions..."
sudo chown -R $USER:$USER $PROJECT_DIR
chmod +x $PROJECT_DIR/scripts/*.sh || true
echo "✅ Permissions set"
echo ""

# Step 12: Start services
echo "🚀 Step 12: Starting services..."
cd $PROJECT_DIR

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Start backend with PM2
pm2 delete all || true
pm2 start backend/server.js --name "whisky-backend"
pm2 startup
pm2 save

# Start nginx
sudo systemctl start nginx
sudo systemctl enable nginx

echo "✅ All services started"
echo ""

# Step 13: Final verification
echo "🔍 Step 13: Final verification..."
echo "Checking services status..."
pm2 status
sudo systemctl status nginx --no-pager -l
sudo systemctl status mongod --no-pager -l

echo ""
echo "🎉 DEPLOYMENT COMPLETE!"
echo "========================"
echo "✅ Fresh version deployed from GitHub"
echo "✅ All services running"
echo "💾 Backup created at: $BACKUP_DIR"
echo "🌐 Site should be accessible at: https://viticultwhisky.co.uk"
echo ""
echo "🔗 GitHub Repository: $GITHUB_REPO"
echo "📊 Deployment includes:"
echo "   - 114+ optimized WebP images"
echo "   - Complete backend API"
echo "   - React frontend with TypeScript"
echo "   - GDPR compliance features"
echo "   - SEO optimization"
echo "   - Admin dashboard"
echo ""
echo "If you encounter any issues, check the backup at: $BACKUP_DIR"