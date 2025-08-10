#!/bin/bash

# 🚀 Transcore Logistics Production Startup Script

echo "🚚 Starting Transcore Logistics..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  Warning: .env file not found!"
    echo "   Using default configuration..."
    echo "   For production, create a .env file with your settings"
fi

# Set production environment
export NODE_ENV=production

# Check if MongoDB connection string is set
if [ -z "$MONGODB_URI" ]; then
    echo "⚠️  Warning: MONGODB_URI not set!"
    echo "   Using default local MongoDB connection"
fi

# Start the application
echo "🌍 Starting server in production mode..."
echo "📊 Environment: $NODE_ENV"
echo "🔗 Server will be available at: http://localhost:${PORT:-3000}"
echo ""

# Start the server
exec node server.js
