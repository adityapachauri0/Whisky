#!/bin/bash

echo "Starting MongoDB..."

# Try to start MongoDB
if command -v mongod &> /dev/null; then
    # Check if MongoDB is already running
    if pgrep mongod > /dev/null; then
        echo "MongoDB is already running"
    else
        # Start MongoDB in background
        mongod --dbpath /usr/local/var/mongodb --logpath /usr/local/var/log/mongodb/mongo.log --fork
        echo "MongoDB started"
    fi
else
    echo "MongoDB is not installed. The app will work with limited functionality."
    echo "To install MongoDB on macOS: brew install mongodb-community"
fi