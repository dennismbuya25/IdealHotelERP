const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database.cjs');
const { authenticateToken } = require('../middleware/auth.cjs');

const router = express.Router();

// Login
router.post('/login', async (req, res) => {
  try {
    console.log('Login route hit with body:', req.body);
    const { username, password } = req.body;

    console.log('Login attempt for username:', username);

    if (!username || !password) {
      console.log('Missing username or password');
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Get user from database
    const result = await pool.query(
      'SELECT id, username, password_hash, name, role, is_active FROM users WHERE username = $1 AND is_active = true',
      [username]
    );

    console.log('Database query result - found user:', result.rows.length > 0);

    if (result.rows.length === 0) {
      console.log('User not found or inactive');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];
    console.log('Found user:', { id: user.id, username: user.username, role: user.role });

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    console.log('Password verification result:', isValidPassword);
    
    if (!isValidPassword) {
      console.log('Invalid password for user:', username);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    console.log('JWT token generated successfully');

    // Log activity
    try {
      await pool.query(
        'INSERT INTO activity_logs (user_id, action, details, ip_address) VALUES ($1, $2, $3, $4)',
        [user.id, 'login', JSON.stringify({ username }), req.ip || '127.0.0.1']
      );
      console.log('Activity logged successfully');
    } catch (logError) {
      console.error('Activity log error:', logError);
      // Don't fail login if activity log fails
    }

    const responseData = {
      token,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
        isActive: user.is_active
      }
    };

    console.log('Sending login response:', responseData);
    res.json(responseData);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get current user
router.get('/me', authenticateToken, async (req, res) => {
  try {
    res.json({ user: req.user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Logout
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    // Log activity
    await pool.query(
      'INSERT INTO activity_logs (user_id, action, details, ip_address) VALUES ($1, $2, $3, $4)',
      [req.user.id, 'logout', JSON.stringify({ username: req.user.username }), req.ip]
    );

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;