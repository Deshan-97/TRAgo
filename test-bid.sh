#!/bin/bash

# Test bid submission script

echo "🧪 Testing Bid Submission..."

# First, check if there are any active hire requests
echo "📋 Checking for active hire requests..."
HIRE_RESPONSE=$(curl -s http://localhost:3000/api/hire)
echo "Hire requests response: $HIRE_RESPONSE"

# Extract the first hire request ID (assuming JSON response)
HIRE_ID=$(echo "$HIRE_RESPONSE" | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)

if [ -z "$HIRE_ID" ]; then
    echo "❌ No active hire requests found. Please create one in the admin panel first."
    exit 1
fi

echo "✅ Found hire request with ID: $HIRE_ID"

# Test bid submission
echo "📝 Testing bid submission..."

# Create a temporary test file for photo upload
echo "test content" > /tmp/test_photo.txt

# Submit a test bid
curl -X POST http://localhost:3000/api/bid \
  -F "hire_request_id=$HIRE_ID" \
  -F "owner_name=Test Driver" \
  -F "vehicle_type=van" \
  -F "price_per_km_ac=100" \
  -F "price_per_km_non_ac=80" \
  -F "full_hire_price=5000" \
  -F "phone_number=0771234567" \
  -F "photo1=@/tmp/test_photo.txt" \
  -F "photo2=@/tmp/test_photo.txt"

echo ""
echo "🏁 Test completed!"

# Clean up
rm -f /tmp/test_photo.txt
