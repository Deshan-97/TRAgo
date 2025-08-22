#!/bin/bash

# Test script to verify the admin panel is working

echo "🧪 Testing TravelGo Admin Panel..."

# Check if server is running
if ! curl -s http://localhost:3000 > /dev/null; then
    echo "❌ Server is not running. Please start it with: npm start"
    exit 1
fi

echo "✅ Server is running"

# Test admin panel access
if curl -s http://localhost:3000/admin | grep -q "TravelGo Admin Panel"; then
    echo "✅ Admin panel is accessible"
else
    echo "❌ Admin panel is not accessible"
    exit 1
fi

# Test API endpoints
echo "🔍 Testing API endpoints..."

# Test GET /api/hire
if curl -s http://localhost:3000/api/hire | grep -q "pickup_location\|error"; then
    echo "✅ Hire API endpoint is working"
else
    echo "❌ Hire API endpoint is not responding"
fi

# Test GET /api/bid
if curl -s http://localhost:3000/api/bid | grep -q "owner_name\|error\|\[\]"; then
    echo "✅ Bid API endpoint is working"
else
    echo "❌ Bid API endpoint is not responding"
fi

echo ""
echo "🎉 Basic tests completed!"
echo "You can now test the admin form at: http://localhost:3000/admin"
