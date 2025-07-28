#!/bin/bash
# Test API endpoints

echo "🧪 Testing API Endpoints..."
echo "========================"

# Function to test endpoint
test_endpoint() {
    local name=$1
    local method=$2
    local url=$3
    local data=$4
    
    echo -n "Testing $name... "
    
    if [ -z "$data" ]; then
        response=$(curl -s -o /dev/null -w "%{http_code}" -X $method "$url")
    else
        response=$(curl -s -o /dev/null -w "%{http_code}" -X $method "$url" \
            -H "Content-Type: application/json" \
            -d "$data")
    fi
    
    if [ "$response" = "200" ] || [ "$response" = "201" ]; then
        echo "✅ OK ($response)"
    else
        echo "❌ Failed ($response)"
    fi
}

# Test health
test_endpoint "Health Check" "GET" "https://viticultwhisky.co.uk/api/health"

# Test CORS preflight
echo -n "Testing CORS... "
cors_headers=$(curl -s -I -X OPTIONS https://viticultwhisky.co.uk/api/admin/login \
    -H "Origin: https://viticultwhisky.co.uk" \
    -H "Access-Control-Request-Method: POST" \
    2>/dev/null | grep -i "access-control" | wc -l)
if [ "$cors_headers" -gt 0 ]; then
    echo "✅ OK (Headers present)"
else
    echo "❌ Failed (No CORS headers)"
fi

# Test admin login
test_endpoint "Admin Login" "POST" "https://viticultwhisky.co.uk/api/admin/login" \
    '{"email":"admin@viticultwhisky.co.uk","password":"admin123"}'

echo ""
echo "Test complete!"
