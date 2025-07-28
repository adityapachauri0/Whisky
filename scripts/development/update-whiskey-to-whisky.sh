#!/bin/bash

# Script to update all instances of "whiskey" to "whisky" in the project

echo "Starting update of 'whiskey' to 'whisky' throughout the project..."

# Update frontend files
echo "Updating frontend files..."
find frontend/src -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.js" -o -name "*.jsx" \) -exec sed -i '' 's/whiskey/whisky/g' {} \;
find frontend/src -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.js" -o -name "*.jsx" \) -exec sed -i '' 's/Whiskey/Whisky/g' {} \;
find frontend/src -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.js" -o -name "*.jsx" \) -exec sed -i '' 's/WHISKEY/WHISKY/g' {} \;

# Update CSS classes
echo "Updating CSS classes..."
find frontend/src -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.css" \) -exec sed -i '' 's/bg-whiskey/bg-whisky/g' {} \;
find frontend/src -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.css" \) -exec sed -i '' 's/text-whiskey/text-whisky/g' {} \;
find frontend/src -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.css" \) -exec sed -i '' 's/border-whiskey/border-whisky/g' {} \;
find frontend/src -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.css" \) -exec sed -i '' 's/from-whiskey/from-whisky/g' {} \;
find frontend/src -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.css" \) -exec sed -i '' 's/to-whiskey/to-whisky/g' {} \;
find frontend/src -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.css" \) -exec sed -i '' 's/gradient-whiskey/gradient-whisky/g' {} \;

# Update backend files
echo "Updating backend files..."
find backend -type f \( -name "*.js" -o -name "*.json" \) ! -path "*/node_modules/*" -exec sed -i '' 's/whiskey/whisky/g' {} \;
find backend -type f \( -name "*.js" -o -name "*.json" \) ! -path "*/node_modules/*" -exec sed -i '' 's/Whiskey/Whisky/g' {} \;
find backend -type f \( -name "*.js" -o -name "*.json" \) ! -path "*/node_modules/*" -exec sed -i '' 's/WHISKEY/WHISKY/g' {} \;

# Update documentation
echo "Updating documentation..."
find . -name "*.md" -maxdepth 2 -exec sed -i '' 's/whiskey/whisky/g' {} \;
find . -name "*.md" -maxdepth 2 -exec sed -i '' 's/Whiskey/Whisky/g' {} \;

# Update image file name if exists
if [ -f "frontend/public/whiskey-glass.jpg" ]; then
    mv frontend/public/whiskey-glass.jpg frontend/public/whisky-glass.jpg
fi

echo "Update complete! Please review the changes and test the application."
echo ""
echo "Important notes:"
echo "1. Update any external references (databases, APIs, etc.)"
echo "2. Update email domains from whiskeytradingco.com to whiskytradingco.com"
echo "3. Test all functionality thoroughly"
echo "4. Update any hardcoded URLs or API endpoints"