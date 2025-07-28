#!/bin/bash

# Test Runner Script for ViticultWhisky

echo "🧪 Running ViticultWhisky Test Suite"
echo "===================================="
echo ""

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is not running. Starting MongoDB..."
    # Try to start MongoDB (adjust command based on your system)
    if command -v brew &> /dev/null; then
        brew services start mongodb-community
    else
        sudo systemctl start mongod 2>/dev/null || sudo service mongod start 2>/dev/null
    fi
    sleep 2
fi

# Set test environment
export NODE_ENV=test

# Run tests
cd backend

echo "📝 Running Authentication Tests..."
npm run test:auth

echo ""
echo "🔒 Running Security Tests..."
npx jest tests/security.test.js

echo ""
echo "📊 Running Full Test Suite with Coverage..."
npm run test:coverage

echo ""
echo "✅ Test Summary:"
echo "=================="

# Check coverage
if [ -f coverage/lcov-report/index.html ]; then
    echo "📈 Coverage report generated: backend/coverage/lcov-report/index.html"
    
    # Extract coverage summary
    if [ -f coverage/coverage-summary.json ]; then
        echo ""
        echo "Coverage Summary:"
        node -e "
        const coverage = require('./coverage/coverage-summary.json');
        const total = coverage.total;
        console.log('  Lines:', total.lines.pct + '%');
        console.log('  Functions:', total.functions.pct + '%');
        console.log('  Branches:', total.branches.pct + '%');
        "
    fi
fi

echo ""
echo "🎯 Production Readiness Checklist:"
echo "[ ] All tests passing"
echo "[ ] Coverage > 70%"
echo "[ ] No security vulnerabilities"
echo "[ ] Authentication tests passing"
echo "[ ] Rate limiting working"
echo "[ ] Input validation working"

# Return to root directory
cd ..

echo ""
echo "✨ Tests complete!"