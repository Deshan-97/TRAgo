#!/bin/bash

# TravelGo Database Setup Script

echo "Setting up TravelGo Database..."

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "Error: PostgreSQL is not installed or not in PATH"
    echo "Please install PostgreSQL first:"
    echo "  Ubuntu/Debian: sudo apt-get install postgresql postgresql-contrib"
    echo "  CentOS/RHEL: sudo yum install postgresql postgresql-server"
    echo "  macOS: brew install postgresql"
    exit 1
fi

# Database configuration
DB_NAME="travelgo"
DB_USER="travelgo_user"
DB_PASSWORD="travelgo123"

echo "Creating database and user..."

# Create database and user
sudo -u postgres psql << EOF
-- Create database
DROP DATABASE IF EXISTS $DB_NAME;
CREATE DATABASE $DB_NAME;

-- Create user
DROP USER IF EXISTS $DB_USER;
CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;

-- Connect to the database and grant schema privileges
\c $DB_NAME
GRANT ALL ON SCHEMA public TO $DB_USER;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO $DB_USER;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO $DB_USER;

-- Exit
\q
EOF

if [ $? -eq 0 ]; then
    echo "Database and user created successfully!"
else
    echo "Error creating database and user. Trying with default postgres user..."
    
    # Alternative method using default postgres user
    createdb $DB_NAME
    psql -d $DB_NAME -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';"
    psql -d $DB_NAME -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"
fi

# Import schema
echo "Importing database schema..."
psql -d $DB_NAME -f database/schema.sql

if [ $? -eq 0 ]; then
    echo "Schema imported successfully!"
else
    echo "Error importing schema. Please check database/schema.sql"
    exit 1
fi

echo ""
echo "Database setup complete!"
echo "Database: $DB_NAME"
echo "User: $DB_USER"
echo "Password: $DB_PASSWORD"
echo ""
echo "Update your server/database/config.js with these credentials:"
echo "  user: '$DB_USER'"
echo "  database: '$DB_NAME'"
echo "  password: '$DB_PASSWORD'"
echo ""
echo "You can now run 'npm install' and 'npm start' to start the application."
