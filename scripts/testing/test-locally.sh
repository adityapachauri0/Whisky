#!/bin/bash

echo "🚀 Starting Whisky Platform Test Environment"
echo "=========================================="

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Start backend server
echo -e "\n${YELLOW}Starting backend server...${NC}"
cd backend
npm start > backend.log 2>&1 &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"

# Wait for backend to start
echo "Waiting for backend to start..."
sleep 5

# Check if backend is running
if curl -s http://localhost:5001/api/health > /dev/null; then
    echo -e "${GREEN}✅ Backend is running${NC}"
else
    echo -e "${RED}❌ Backend failed to start${NC}"
    cat backend.log
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

# Start frontend server
echo -e "\n${YELLOW}Starting frontend server...${NC}"
cd ../frontend
npm start > frontend.log 2>&1 &
FRONTEND_PID=$!
echo "Frontend PID: $FRONTEND_PID"

# Wait for frontend to start
echo "Waiting for frontend to start..."
sleep 10

# Check if frontend is running
if curl -s http://localhost:3000 > /dev/null; then
    echo -e "${GREEN}✅ Frontend is running${NC}"
else
    echo -e "${RED}❌ Frontend failed to start${NC}"
    cat frontend.log
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 1
fi

# Run tests
echo -e "\n${YELLOW}Running test suite...${NC}"
cd ..
node run-all-tests.js

# Capture test exit code
TEST_EXIT_CODE=$?

# Cleanup
echo -e "\n${YELLOW}Stopping servers...${NC}"
kill $BACKEND_PID 2>/dev/null
kill $FRONTEND_PID 2>/dev/null

# Wait for processes to stop
sleep 2

echo -e "\n${GREEN}Test environment stopped${NC}"

# Exit with test exit code
exit $TEST_EXIT_CODE