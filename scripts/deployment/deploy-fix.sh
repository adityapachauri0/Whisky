#!/bin/bash
# Run this on VPS to apply all fixes

echo "🚀 Applying all fixes on VPS..."

# 1. Stop services
echo "Stopping services..."
pm2 stop all || true
sudo systemctl stop nginx || true

# 2. Pull latest code
git pull origin main

# 3. Install dependencies
cd backend && npm install --production
cd ../frontend && npm install && npm run build

# 4. Apply nginx config
sudo cp nginx-vps-config /etc/nginx/sites-available/viticultwhisky
sudo ln -sf /etc/nginx/sites-available/viticultwhisky /etc/nginx/sites-enabled/
sudo nginx -t

# 5. Start MongoDB if not running
sudo systemctl start mongod
sudo systemctl enable mongod

# 6. Clear PM2 and start fresh
pm2 delete all || true
cd backend
export NODE_ENV=production
pm2 start server.js --name backend --env production

# 7. Start nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# 8. Show status
pm2 list
pm2 logs backend --lines 10

echo "✅ All fixes applied!"
echo ""
echo "Test with:"
echo "  curl https://viticultwhisky.co.uk/api/health"
echo "  curl -X POST https://viticultwhisky.co.uk/api/admin/login \\"
echo "    -H 'Content-Type: application/json' \\"
echo "    -d '{\"email\":\"admin@viticultwhisky.co.uk\",\"password\":\"admin123\"}'"
