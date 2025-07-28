#!/bin/bash

echo "Starting services for Whisky platform..."

# Start MongoDB
echo "Checking MongoDB status..."
if command -v mongod &> /dev/null; then
    if pgrep mongod > /dev/null; then
        echo "✓ MongoDB is already running"
    else
        echo "Starting MongoDB..."
        # For macOS with Homebrew
        if command -v brew &> /dev/null; then
            brew services start mongodb-community
            echo "✓ MongoDB started via brew services"
        else
            # Manual start
            mongod --dbpath /usr/local/var/mongodb --logpath /usr/local/var/log/mongodb/mongo.log --fork
            echo "✓ MongoDB started manually"
        fi
    fi
else
    echo "⚠️  MongoDB is not installed. The app will work with limited functionality."
    echo "To install MongoDB on macOS: brew install mongodb-community"
fi

# Start backend
echo ""
echo "Starting backend server..."
cd backend
npm start &
BACKEND_PID=$!
echo "✓ Backend started (PID: $BACKEND_PID)"

# Wait for backend to be ready
echo "Waiting for backend to be ready..."
sleep 5

# Start frontend
echo ""
echo "Starting frontend server..."
cd ../frontend
npm start &
FRONTEND_PID=$!
echo "✓ Frontend started (PID: $FRONTEND_PID)"

echo ""
echo "Services started successfully!"
echo "Backend: http://localhost:5001"
echo "Frontend: http://localhost:3000"
echo ""
echo "Admin credentials:"
echo "Email: admin@viticultwhisky.co.uk"
echo "Password: SecureAdmin123!"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait and handle shutdown
trap "echo 'Stopping services...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT TERM
wait