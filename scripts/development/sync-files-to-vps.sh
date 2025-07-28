#!/bin/bash

# Simple script to sync critical files to VPS

# STEP 1: Update these with your VPS details
VPS_USER="your-username"
VPS_HOST="your-vps-ip"
VPS_PATH="/path/to/whisky"

echo "📁 File Sync to VPS"
echo "=================="

# STEP 2: Test connection first
echo "Testing VPS connection..."
if ssh -o ConnectTimeout=5 "$VPS_USER@$VPS_HOST" "echo 'Connected!'" > /dev/null 2>&1; then
    echo "✅ Connected to VPS"
else
    echo "❌ Cannot connect. Please check:"
    echo "   - VPS_USER=$VPS_USER"
    echo "   - VPS_HOST=$VPS_HOST"
    echo "   - Your SSH key is set up"
    exit 1
fi

# STEP 3: Backup existing VPS files
echo ""
echo "Creating backup on VPS..."
ssh "$VPS_USER@$VPS_HOST" "cd $VPS_PATH && mkdir -p backups && tar -czf backups/backup-$(date +%Y%m%d-%H%M%S).tar.gz backend/.env* frontend/.env* 2>/dev/null || echo 'No existing files to backup'"

# STEP 4: Copy files one by one
echo ""
echo "Syncing files..."

# Backend production config
if [ -f "backend/.env.production" ]; then
    echo "📤 Copying backend/.env.production..."
    scp backend/.env.production "$VPS_USER@$VPS_HOST:$VPS_PATH/backend/.env.production"
else
    echo "❌ backend/.env.production not found locally!"
fi

# Frontend production config
if [ -f "frontend/.env.production" ]; then
    echo "📤 Copying frontend/.env.production..."
    scp frontend/.env.production "$VPS_USER@$VPS_HOST:$VPS_PATH/frontend/.env.production"
else
    echo "❌ frontend/.env.production not found locally!"
fi

# Deploy script
if [ -f "deploy-fix.sh" ]; then
    echo "📤 Copying deploy-fix.sh..."
    scp deploy-fix.sh "$VPS_USER@$VPS_HOST:$VPS_PATH/"
    ssh "$VPS_USER@$VPS_HOST" "chmod +x $VPS_PATH/deploy-fix.sh"
fi

# Diagnostic script
if [ -f "diagnose-api.sh" ]; then
    echo "📤 Copying diagnose-api.sh..."
    scp diagnose-api.sh "$VPS_USER@$VPS_HOST:$VPS_PATH/"
    ssh "$VPS_USER@$VPS_HOST" "chmod +x $VPS_PATH/diagnose-api.sh"
fi

# STEP 5: Clean up forbidden files
echo ""
echo "Cleaning up forbidden files on VPS..."
ssh "$VPS_USER@$VPS_HOST" "cd $VPS_PATH && rm -f .env .env.production .env.production.example 2>/dev/null || true"

# STEP 6: Verify critical values
echo ""
echo "Verifying critical values..."
echo "----------------------------"

# Check password hash
echo -n "Password hash format: "
HASH=$(ssh "$VPS_USER@$VPS_HOST" "cd $VPS_PATH && grep ADMIN_PASSWORD_HASH backend/.env.production 2>/dev/null | cut -d= -f2")
if [[ $HASH == \$2[ab]\$* ]]; then
    echo "✅ Correct (bcrypt)"
else
    echo "❌ WRONG! Found: $HASH"
fi

# Check NODE_ENV
echo -n "NODE_ENV: "
ssh "$VPS_USER@$VPS_HOST" "cd $VPS_PATH && grep NODE_ENV backend/.env.production 2>/dev/null | cut -d= -f2"

# Check API URL
echo -n "API URL: "
ssh "$VPS_USER@$VPS_HOST" "cd $VPS_PATH && grep REACT_APP_API_URL frontend/.env.production 2>/dev/null | cut -d= -f2"

echo ""
echo "✅ Sync complete!"
echo ""
echo "Next steps:"
echo "1. SSH to your VPS: ssh $VPS_USER@$VPS_HOST"
echo "2. Go to project: cd $VPS_PATH"
echo "3. Run deploy script: ./deploy-fix.sh"