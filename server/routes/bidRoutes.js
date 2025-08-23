const express = require('express');
const router = express.Router();
const pool = require('../database/config');

// Submit a bid
router.post('/', (req, res) => {
    console.log('Bid submission request received');
    
    const upload = req.upload.fields([
        { name: 'photo1', maxCount: 1 },
        { name: 'photo2', maxCount: 1 }
    ]);

    upload(req, res, async (err) => {
        if (err) {
            console.error('Upload error:', err);
            return res.status(400).json({ error: err.message });
        }

        try {
            console.log('Request body:', req.body);
            console.log('Uploaded files:', req.files);
            
            const {
                hire_request_id,
                owner_name,
                vehicle_type,
                price_per_km_ac,
                price_per_km_non_ac,
                full_hire_price,
                phone_number
            } = req.body;

            // Validate required fields
            if (!hire_request_id || !owner_name || !vehicle_type || 
                !price_per_km_ac || !price_per_km_non_ac || !full_hire_price || !phone_number) {
                console.log('Missing required fields');
                return res.status(400).json({ error: 'All required fields must be provided' });
            }

            // Check if hire request exists
            console.log('Checking hire request:', hire_request_id);
            const hireCheck = await pool.query(
                'SELECT id FROM hire_requests WHERE id = $1 AND is_active = TRUE',
                [hire_request_id]
            );

            if (hireCheck.rows.length === 0) {
                console.log('Hire request not found or inactive');
                return res.status(404).json({ error: 'Hire request not found or inactive' });
            }

            // Get uploaded file paths
            const photo1_path = req.files && req.files.photo1 ? 
                `/uploads/${req.files.photo1[0].filename}` : null;
            const photo2_path = req.files && req.files.photo2 ? 
                `/uploads/${req.files.photo2[0].filename}` : null;

            console.log('Photo paths:', { photo1_path, photo2_path });

            // Validate numeric fields
            const acPrice = parseFloat(price_per_km_ac);
            const nonAcPrice = parseFloat(price_per_km_non_ac);
            const fullPrice = parseFloat(full_hire_price);

            if (isNaN(acPrice) || isNaN(nonAcPrice) || isNaN(fullPrice)) {
                return res.status(400).json({ error: 'Prices must be valid numbers' });
            }

            if (acPrice < 0 || nonAcPrice < 0 || fullPrice < 0) {
                return res.status(400).json({ error: 'Prices cannot be negative' });
            }

            console.log('Inserting bid into database...');

            // Insert bid
            const result = await pool.query(
                `INSERT INTO bid_submissions 
                 (hire_request_id, owner_name, vehicle_type, price_per_km_ac, 
                  price_per_km_non_ac, full_hire_price, photo1_path, photo2_path, phone_number) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
                 RETURNING *`,
                [hire_request_id, owner_name, vehicle_type, acPrice, 
                 nonAcPrice, fullPrice, photo1_path, photo2_path, phone_number]
            );

            console.log('Bid inserted successfully:', result.rows[0]);

            res.status(201).json({
                message: 'Bid submitted successfully',
                bid: result.rows[0]
            });

        } catch (error) {
            console.error('Error submitting bid:', error);
            res.status(500).json({ error: 'Failed to submit bid' });
        }
    });
});

// Get all bids (Admin)
router.get('/', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT b.*, h.pickup_location, h.dropoff_location, h.hire_type
            FROM bid_submissions b
            JOIN hire_requests h ON b.hire_request_id = h.id
            ORDER BY b.submitted_at DESC
        `);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching bids:', error);
        res.status(500).json({ error: 'Failed to fetch bids' });
    }
});

// Get bid by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            `SELECT b.*, h.pickup_location, h.dropoff_location, h.hire_type
             FROM bid_submissions b
             JOIN hire_requests h ON b.hire_request_id = h.id
             WHERE b.id = $1`,
            [id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Bid not found' });
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching bid:', error);
        res.status(500).json({ error: 'Failed to fetch bid' });
    }
});

// Delete bid (Admin)
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            'DELETE FROM bid_submissions WHERE id = $1 RETURNING *',
            [id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Bid not found' });
        }
        
        res.json({ message: 'Bid deleted successfully' });
    } catch (error) {
        console.error('Error deleting bid:', error);
        res.status(500).json({ error: 'Failed to delete bid' });
    }
});

module.exports = router;
