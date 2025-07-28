#!/bin/bash

echo "🚀 Deploying JavaScript updates only..."

# SSH into VPS and update the JS files directly
ssh root@31.97.57.193 << 'EOF'
cd /var/www/viticultwhisky/frontend

# Find and remove the old main JS file
echo "🔍 Finding old main.js file..."
OLD_MAIN=$(find build/static/js -name "main.*.js" -type f | head -1)
if [ -n "$OLD_MAIN" ]; then
    echo "📦 Backing up old main.js..."
    cp "$OLD_MAIN" "$OLD_MAIN.backup"
fi

# The issue is the old build doesn't have our changes
# We need to manually fix the double /api issue in production

# Create a temporary fix
echo "🔧 Creating production fix..."
cat > /tmp/fix-api.js << 'FIXJS'
// Find all occurrences of /api/api and replace with /api
if (window.location.hostname === 'viticultwhisky.co.uk' || window.location.hostname === 'www.viticultwhisky.co.uk') {
  console.log('API Configuration:', {
    hostname: window.location.hostname,
    apiUrl: 'https://viticultwhisky.co.uk/api',
    fix: 'Applied'
  });
  
  // Override fetch to fix double /api
  const originalFetch = window.fetch;
  window.fetch = function(url, options) {
    if (typeof url === 'string' && url.includes('/api/api/')) {
      url = url.replace('/api/api/', '/api/');
      console.log('Fixed API URL:', url);
    }
    return originalFetch.call(this, url, options);
  };
  
  // Override XMLHttpRequest for axios
  const originalOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(method, url) {
    if (typeof url === 'string' && url.includes('/api/api/')) {
      url = url.replace('/api/api/', '/api/');
      console.log('Fixed API URL (XHR):', url);
    }
    return originalOpen.apply(this, arguments);
  };
}
FIXJS

# Inject the fix into index.html
echo "💉 Injecting fix into index.html..."
cp build/index.html build/index.html.backup
sed -i '/<\/head>/i <script>'$(cat /tmp/fix-api.js | sed 's/[[\.*^$()+?{|]/\\&/g' | tr '\n' ' ')'</script>' build/index.html

# Set permissions
chown nodeapp:nodeapp build/index.html

echo "✅ Fix applied!"

# Restart nginx to clear any cache
systemctl restart nginx

EOF

echo "✅ Deployment complete!"
echo "⚠️  Clear your browser cache and try again!"