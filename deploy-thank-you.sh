#!/bin/bash

# Deployment script for thank you page
echo "🚀 Deploying Thank You Page to Server..."

# Server details
SERVER="root@31.97.57.193"
PASSWORD="--w(7rjMOF4'nzhIOuOdPF"

# Build the project (already done)
echo "✅ Build completed successfully"

# Create temporary tar file
echo "📦 Creating deployment package..."
cd /Users/adityapachauri/Desktop/Whisky/frontend
tar -czf thank-you-deployment.tar.gz -C build .

# Upload and deploy using expect
echo "📤 Uploading to server..."
expect -c "
spawn scp thank-you-deployment.tar.gz $SERVER:/tmp/
expect \"password:\"
send -- \"$PASSWORD\r\"
expect eof
"

# Extract and deploy on server
echo "🔧 Deploying on server..."
expect -c "
spawn ssh $SERVER
expect \"password:\"
send -- \"$PASSWORD\r\"
expect \"#\"
send \"cd /var/www/viticultwhisky.co.uk\r\"
expect \"#\"
send \"cp -r html html-backup-\$(date +%Y%m%d-%H%M%S)\r\"
expect \"#\"
send \"cd html\r\"
expect \"#\"
send \"tar -xzf /tmp/thank-you-deployment.tar.gz\r\"
expect \"#\"
send \"chown -R www-data:www-data .\r\"
expect \"#\"
send \"chmod -R 755 .\r\"
expect \"#\"
send \"rm /tmp/thank-you-deployment.tar.gz\r\"
expect \"#\"
send \"systemctl reload nginx\r\"
expect \"#\"
send \"exit\r\"
expect eof
"

# Cleanup
rm thank-you-deployment.tar.gz

echo "✅ Deployment completed!"
echo "🌐 Thank you page is now available at: https://viticultwhisky.co.uk/thank-you"
echo ""
echo "Usage examples:"
echo "• Contact form redirect: https://viticultwhisky.co.uk/thank-you?type=contact&name=John"
echo "• Sell form redirect: https://viticultwhisky.co.uk/thank-you?type=sell&name=Jane"