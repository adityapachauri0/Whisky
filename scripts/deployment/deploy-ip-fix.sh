#!/bin/bash

echo "🚀 Deploying IP address fix to production..."

# Build frontend
echo "📦 Building frontend..."
cd /Users/adityapachauri/Desktop/Whisky/frontend
npm run build

# Copy files to VPS
echo "📤 Copying files to VPS..."
cd /Users/adityapachauri/Desktop/Whisky

# Copy backend files
scp backend/controllers/contact.controller.js root@188.166.137.240:/var/www/viticultwhisky/backend/controllers/
scp backend/controllers/sellWhisky.controller.js root@188.166.137.240:/var/www/viticultwhisky/backend/controllers/
scp backend/utils/getClientIp.js root@188.166.137.240:/var/www/viticultwhisky/backend/utils/

# Copy frontend build
rsync -avz --delete frontend/build/ root@188.166.137.240:/var/www/viticultwhisky/frontend/build/

# Restart backend on VPS
ssh root@188.166.137.240 << 'EOF'
cd /var/www/viticultwhisky/backend

# Set correct permissions
chown -R nodeapp:nodeapp /var/www/viticultwhisky/backend
chown -R nodeapp:nodeapp /var/www/viticultwhisky/frontend/build

# Restart PM2
pm2 restart whisky-backend
pm2 save

echo "✅ Backend restarted"

# Also update nginx to ensure proper IP forwarding
cat > /tmp/nginx-ip-fix.conf << 'NGINX_EOF'
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $server_name;
NGINX_EOF

# Check if these headers are already in nginx config
if ! grep -q "X-Real-IP" /etc/nginx/sites-available/viticultwhisky; then
    echo "⚠️  Please manually add the following headers to nginx config:"
    cat /tmp/nginx-ip-fix.conf
fi

EOF

echo "✅ Deployment complete!"
echo "📋 Next steps:"
echo "1. Clear browser cache"
echo "2. Test the contact form again"
echo "3. Check if IP addresses are now displayed in admin dashboard"