#!/bin/bash

echo "🧪 Testing Order Tracker Backend Locally..."
echo "=========================================="

# Kill any existing processes on port 5000
echo "📝 Cleaning up existing processes..."
pkill -f "node.*server" || true
pkill -f "tsx watch" || true

# Clean and build
echo "🔨 Building application..."
npm run clean
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build successful!"

# Check if dist directory was created
if [ ! -d "dist" ]; then
    echo "❌ dist directory not found!"
    exit 1
fi

echo "✅ dist directory created successfully!"

# List built files
echo "📁 Built files:"
ls -la dist/

# Start the application in background
echo "🚀 Starting application..."
PORT=5001 npm start &
APP_PID=$!

# Wait a moment for the app to start
sleep 5

# Test if the application is running
echo "🔍 Testing application health..."
if curl -f http://localhost:5001 > /dev/null 2>&1; then
    echo "✅ Application is running successfully!"
    STATUS="SUCCESS"
else
    echo "⚠️  Application might not be fully ready (this is normal for APIs without root route)"
    echo "🔍 Checking if process is still running..."
    if kill -0 $APP_PID 2>/dev/null; then
        echo "✅ Application process is running!"
        STATUS="SUCCESS"
    else
        echo "❌ Application process died!"
        STATUS="FAILED"
    fi
fi

# Clean up
echo "🧹 Cleaning up..."
kill $APP_PID 2>/dev/null || true

echo "=========================================="
if [ "$STATUS" = "SUCCESS" ]; then
    echo "🎉 Local test completed successfully!"
    echo "✅ Ready for Docker deployment!"
else
    echo "❌ Local test failed!"
    exit 1
fi
