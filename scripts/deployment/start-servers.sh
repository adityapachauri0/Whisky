#!/bin/bash

# Start backend server
echo "Starting backend server..."
cd /Users/adityapachauri/Desktop/Whisky/backend
npm run dev &
BACKEND_PID=$!
echo "Backend server started with PID: $BACKEND_PID"

# Wait a bit for backend to start
sleep 3

# Start frontend server
echo "Starting frontend server..."
cd /Users/adityapachauri/Desktop/Whisky/frontend
PORT=3001 npm start &
FRONTEND_PID=$!
echo "Frontend server started with PID: $FRONTEND_PID"

echo "Both servers are starting..."
echo "Backend: http://localhost:5001"
echo "Frontend: http://localhost:3001"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for Ctrl+C
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait