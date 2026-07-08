const express = require('express');
const pool = require('../config/database.cjs');
const { authenticateToken, requireRole } = require('../middleware/auth.cjs');

const router = express.Router();

// Get all rooms
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM rooms 
      ORDER BY number
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Get rooms error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new room
router.post('/', authenticateToken, requireRole(['admin', 'manager']), async (req, res) => {
  try {
    const { number, type, price, floor, amenities } = req.body;

    if (!number || !type || !price || !floor) {
      return res.status(400).json({ error: 'Required fields missing' });
    }

    const result = await pool.query(`
      INSERT INTO rooms (number, type, price, floor, amenities)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [number, type, price, floor, amenities || []]);

    // Log activity
    await pool.query(
      'INSERT INTO activity_logs (user_id, action, entity_type, entity_id, details) VALUES ($1, $2, $3, $4, $5)',
      [req.user.id, 'create_room', 'room', result.rows[0].id, JSON.stringify({ number, type })]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create room error:', error);
    if (error.code === '23505') { // Unique violation
      res.status(400).json({ error: 'Room number already exists' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// Update room
router.put('/:id', authenticateToken, requireRole(['admin', 'manager', 'housekeeping']), async (req, res) => {
  try {
    const { id } = req.params;
    const { status, assigned_cleaner, last_cleaned } = req.body;

    const result = await pool.query(`
      UPDATE rooms 
      SET status = COALESCE($1, status),
          assigned_cleaner = COALESCE($2, assigned_cleaner),
          last_cleaned = COALESCE($3, last_cleaned),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
      RETURNING *
    `, [status, assigned_cleaner, last_cleaned, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Room not found' });
    }

    // Log activity
    await pool.query(
      'INSERT INTO activity_logs (user_id, action, entity_type, entity_id, details) VALUES ($1, $2, $3, $4, $5)',
      [req.user.id, 'update_room', 'room', id, JSON.stringify({ status, assigned_cleaner })]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update room error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete room
router.delete('/:id', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { id } = req.params;

    // Check if room has active bookings
    const activeBookings = await pool.query(
      'SELECT id FROM bookings WHERE room_id = $1 AND status IN ($2, $3)',
      [id, 'confirmed', 'checked-in']
    );

    if (activeBookings.rows.length > 0) {
      return res.status(400).json({ error: 'Cannot delete room with active bookings' });
    }

    const result = await pool.query(
      'DELETE FROM rooms WHERE id = $1 RETURNING number',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Room not found' });
    }

    // Log activity
    await pool.query(
      'INSERT INTO activity_logs (user_id, action, entity_type, entity_id, details) VALUES ($1, $2, $3, $4, $5)',
      [req.user.id, 'delete_room', 'room', id, JSON.stringify({ number: result.rows[0].number })]
    );

    res.json({ message: 'Room deleted successfully' });
  } catch (error) {
    console.error('Delete room error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;