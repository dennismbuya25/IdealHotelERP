const express = require('express');
const pool = require('../config/database.cjs');
const { authenticateToken } = require('../middleware/auth.cjs');

const router = express.Router();

// Get dashboard statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    // Get room statistics
    const roomStats = await pool.query(`
      SELECT 
        COUNT(*) as total_rooms,
        COUNT(*) FILTER (WHERE status = 'occupied') as occupied_rooms,
        COUNT(*) FILTER (WHERE status = 'available') as available_rooms,
        ROUND(
          (COUNT(*) FILTER (WHERE status = 'occupied')::DECIMAL / COUNT(*)) * 100, 1
        ) as occupancy_rate
      FROM rooms
    `);

    // Get today's bookings
    const todayBookings = await pool.query(`
      SELECT COUNT(*) as today_bookings
      FROM bookings 
      WHERE DATE(created_at) = CURRENT_DATE
    `);

    // Get check-ins and check-outs for today
    const todayChecks = await pool.query(`
      SELECT 
        COUNT(*) FILTER (WHERE check_in = CURRENT_DATE) as check_ins_today,
        COUNT(*) FILTER (WHERE check_out = CURRENT_DATE) as check_outs_today
      FROM bookings
    `);

    // Get revenue (last 30 days)
    const revenue = await pool.query(`
      SELECT COALESCE(SUM(total_amount), 0) as total_revenue
      FROM invoices 
      WHERE payment_status = 'paid' 
      AND created_at >= CURRENT_DATE - INTERVAL '30 days'
    `);

    // Get average customer satisfaction
    const satisfaction = await pool.query(`
      SELECT COALESCE(AVG(rating), 0) as customer_satisfaction
      FROM feedback 
      WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
    `);

    const stats = {
      totalRooms: parseInt(roomStats.rows[0].total_rooms),
      occupiedRooms: parseInt(roomStats.rows[0].occupied_rooms),
      availableRooms: parseInt(roomStats.rows[0].available_rooms),
      occupancyRate: parseFloat(roomStats.rows[0].occupancy_rate) || 0,
      totalRevenue: parseFloat(revenue.rows[0].total_revenue) || 0,
      todayBookings: parseInt(todayBookings.rows[0].today_bookings),
      checkInsToday: parseInt(todayChecks.rows[0].check_ins_today),
      checkOutsToday: parseInt(todayChecks.rows[0].check_outs_today),
      customerSatisfaction: parseFloat(satisfaction.rows[0].customer_satisfaction) || 0
    };

    res.json(stats);
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get recent activity
router.get('/activity', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        al.action,
        al.details,
        al.created_at,
        u.name as user_name
      FROM activity_logs al
      LEFT JOIN users u ON al.user_id = u.id
      ORDER BY al.created_at DESC
      LIMIT 10
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('Dashboard activity error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;