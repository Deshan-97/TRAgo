#!/bin/bash

# Simple TravelGo Database Setup Script

echo "🚀 Setting up TravelGo Database..."

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ Error: PostgreSQL is not installed"
    echo "Please install PostgreSQL first:"
    echo "  Ubuntu/Debian: sudo apt-get install postgresql postgresql-contrib"
    echo "  CentOS/RHEL: sudo yum install postgresql postgresql-server"
    echo "  macOS: brew install postgresql"
    exit 1
fi

# Database configuration
DB_NAME="travelgo"

echo "📝 Creating database '$DB_NAME'..."

# Create database using default postgres user
sudo -u postgres createdb $DB_NAME 2>/dev/null || {
    echo "Database '$DB_NAME' already exists or couldn't be created with sudo."
    echo "Trying with current user..."
    createdb $DB_NAME 2>/dev/null || {
        echo "⚠️  Database might already exist. Continuing..."
    }
}

# Import schema
echo "📊 Importing database schema..."
if [ -f "database/schema.sql" ]; then
    sudo -u postgres psql -d $DB_NAME -f database/schema.sql 2>/dev/null || {
        echo "Trying schema import with current user..."
        psql -d $DB_NAME -f database/schema.sql 2>/dev/null || {
            echo "⚠️  Schema import failed. You may need to run it manually:"
            echo "   psql -d $DB_NAME -f database/schema.sql"
        }
    }
else
    echo "❌ Error: database/schema.sql not found"
    exit 1
fi

echo "✅ Database setup complete!"
echo ""
echo "Database: $DB_NAME"
echo "User: postgres (default)"
echo ""
echo "You can now run 'npm start' to start the application."
