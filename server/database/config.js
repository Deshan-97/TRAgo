const { Pool } = require('pg');

// Database configuration for Render deployment
const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'travelgo',
    password: process.env.DB_PASSWORD || 'postgres',
    port: process.env.DB_PORT || 5432,
    // SSL configuration for Render
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    // Alternative: use DATABASE_URL if provided
    connectionString: process.env.DATABASE_URL
});

// Test database connection
pool.on('connect', () => {
    console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
    console.error('Database connection error:', err);
});

module.exports = pool;
