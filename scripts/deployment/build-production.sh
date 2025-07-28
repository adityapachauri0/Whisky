#!/bin/bash
# Production build script with console.log removal

echo "🏗️  Building for production..."

# Remove console.logs
node remove-console-logs.js

# Build frontend
cd frontend
npm run build

# The build process will use NODE_ENV=production which activates our logger

echo "✅ Production build complete!"
