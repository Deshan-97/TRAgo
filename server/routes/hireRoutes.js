const express = require('express');
const router = express.Router();
const pool = require('../database/config');

// Get all active hire requests
router.get('/', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM hire_requests ORDER BY created_at DESC'
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching hire requests:', error);
        res.status(500).json({ error: 'Failed to fetch hire requests' });
    }
});

// Get specific hire request
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            'SELECT * FROM hire_requests WHERE id = $1',
            [id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Hire request not found' });
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching hire request:', error);
        res.status(500).json({ error: 'Failed to fetch hire request' });
    }
});

// Create new hire request
router.post('/', async (req, res) => {
    try {
        console.log('Received hire request data:', req.body);
        
        const {
            pickup_location,
            dropoff_location,
            pickup_date,
            hire_type,
            vehicle_type,
            passengers,
            ac_preference,
            duration_days,
            additional_data
        } = req.body;

        // Validate required fields
        if (!pickup_location || !dropoff_location || !pickup_date || !hire_type || 
            !vehicle_type || !passengers || !ac_preference || !duration_days) {
            console.log('Missing required fields');
            return res.status(400).json({ error: 'All required fields must be provided' });
        }

        // Validate pickup date
        const pickupDate = new Date(pickup_date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (pickupDate < today) {
            return res.status(400).json({ error: 'Pickup date cannot be in the past' });
        }

        console.log('Inserting into database...');
        
        const result = await pool.query(
            `INSERT INTO hire_requests 
             (pickup_location, dropoff_location, pickup_date, hire_type, vehicle_type, 
              passengers, ac_preference, duration_days, additional_data, is_active) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, TRUE) 
             RETURNING *`,
            [pickup_location, dropoff_location, pickup_date, hire_type, vehicle_type, 
             passengers, ac_preference, duration_days, additional_data || '']
        );

        console.log('Database insert successful:', result.rows[0]);
        res.status(201).json(result.rows[0]);
        
    } catch (error) {
        console.error('Error creating hire request:', error);
        res.status(500).json({ 
            error: 'Failed to create hire request',
            details: error.message
        });
    }
});

// Get bids for a specific hire request
router.get('/:id/bids', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            'SELECT * FROM bid_submissions WHERE hire_request_id = $1 ORDER BY submitted_at DESC',
            [id]
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching bids:', error);
        res.status(500).json({ error: 'Failed to fetch bids' });
    }
});

// Delete hire request (Admin)
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            'UPDATE hire_requests SET is_active = FALSE WHERE id = $1 RETURNING *',
            [id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Hire request not found' });
        }
        
        res.json({ message: 'Hire request deactivated successfully' });
    } catch (error) {
        console.error('Error deactivating hire request:', error);
        res.status(500).json({ error: 'Failed to deactivate hire request' });
    }
});

module.exports = router;
