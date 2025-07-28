#!/bin/bash

echo "🔧 Applying production API fix..."

# Create the fix script
cat > /tmp/api-fix.html << 'EOF'
<script>
// Production API Fix - Remove double /api
(function() {
  if (window.location.hostname === 'viticultwhisky.co.uk' || window.location.hostname === 'www.viticultwhisky.co.uk') {
    console.log('Applying API fix for production...');
    
    // Store original methods
    const originalFetch = window.fetch;
    const originalXHROpen = XMLHttpRequest.prototype.open;
    
    // Override fetch
    window.fetch = function(url, options) {
      if (typeof url === 'string' && url.includes('/api/api/')) {
        url = url.replace('/api/api/', '/api/auth/');
        console.log('Fixed fetch URL:', url);
      }
      return originalFetch.call(this, url, options);
    };
    
    // Override XMLHttpRequest (for axios)
    XMLHttpRequest.prototype.open = function(method, url) {
      if (typeof url === 'string' && url.includes('/api/api/')) {
        url = url.replace('/api/api/', '/api/auth/');
        console.log('Fixed XHR URL:', url);
      }
      return originalXHROpen.apply(this, arguments);
    };
    
    console.log('API fix applied successfully');
  }
})();
</script>
EOF

# Apply to VPS
scp /tmp/api-fix.html root@31.97.57.193:/tmp/
ssh root@31.97.57.193 << 'SSHEOF'
cd /var/www/viticultwhisky/frontend/build

# Backup index.html
cp index.html index.html.backup-$(date +%Y%m%d-%H%M%S)

# Insert the fix before </head>
sed -i '/<\/head>/i \    <!-- API Fix Start -->' index.html
sed -i '/<\/head>/r /tmp/api-fix.html' index.html
sed -i '/<\/head>/i \    <!-- API Fix End -->' index.html

# Set permissions
chown nodeapp:nodeapp index.html

# Clean up
rm /tmp/api-fix.html

echo "✅ API fix applied to production!"
SSHEOF

echo "✅ Done! Clear browser cache and try again."