#!/bin/bash

# TravelGo Quick Start Script

echo "🚀 TravelGo Quick Start"
echo "======================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ Error: PostgreSQL is not installed"
    echo "Please install PostgreSQL first"
    exit 1
fi

echo "✅ Prerequisites check passed"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check if database exists
if ! psql -lqt | cut -d \| -f 1 | grep -qw travelgo; then
    echo "🗄️  Setting up database..."
    echo "Please run: ./setup-database.sh"
    echo "Then come back and run this script again"
    exit 1
fi

echo "✅ Database found"

# Start the application
echo "🌐 Starting TravelGo server..."
echo ""
echo "📍 Access points:"
echo "   Landing Page: http://localhost:3000"
echo "   Admin Panel:  http://localhost:3000/admin"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm start
