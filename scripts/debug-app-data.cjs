const pool = require('../server/config/database.cjs');

const queries = [
  {
    name: 'rooms',
    sql: 'SELECT id, number, type, status, price, floor, amenities, last_cleaned, assigned_cleaner, created_at, updated_at FROM rooms ORDER BY number LIMIT 1',
  },
  {
    name: 'bookings',
    sql: "SELECT b.id, b.check_in, b.check_out, b.status, b.total_amount, b.payment_status, b.booking_source, b.special_requests, b.created_at, b.updated_at, b.room_id, g.name AS guest_name, g.phone AS guest_phone, g.address AS guest_address FROM bookings b LEFT JOIN guests g ON g.id = b.guest_id ORDER BY b.check_in DESC LIMIT 1",
  },
  {
    name: 'guests',
    sql: 'SELECT id, name, email, phone, id_type, id_number, address, preferences, loyalty_points, total_stays, last_visit, notes, created_at, updated_at FROM guests ORDER BY name LIMIT 1',
  },
  {
    name: 'staff',
    sql: 'SELECT id, name, email, phone, department, position, salary, join_date, shift, is_active, created_at, updated_at FROM staff ORDER BY name LIMIT 1',
  },
  {
    name: 'inventory_items',
    sql: 'SELECT id, name, category, current_stock, min_stock, max_stock, unit, unit_price, supplier, last_updated, created_at FROM inventory_items ORDER BY name LIMIT 1',
  },
  {
    name: 'kitchen_orders',
    sql: 'SELECT id, order_number, room_number, table_number, order_type, total_amount, status, order_time, estimated_time, waiter_name, created_at, updated_at FROM kitchen_orders ORDER BY order_time DESC LIMIT 1',
  },
  {
    name: 'users',
    sql: 'SELECT id, username, name, role, is_active, created_at, updated_at FROM users ORDER BY created_at DESC LIMIT 1',
  },
  {
    name: 'activity_logs',
    sql: "SELECT al.id, al.action, al.details, COALESCE(u.name, 'System') AS actor, al.created_at AS timestamp FROM activity_logs al LEFT JOIN users u ON u.id = al.user_id ORDER BY al.created_at DESC LIMIT 1",
  },
  {
    name: 'invoices',
    sql: 'SELECT id, booking_id, guest_name, items, subtotal, tax, discount, total, payment_method, payment_status, issue_date, due_date FROM invoices ORDER BY issue_date DESC LIMIT 1',
  },
  {
    name: 'expenses',
    sql: 'SELECT id, description, category, amount, payment_method, date, notes FROM expenses ORDER BY date DESC LIMIT 1',
  },
  {
    name: 'integrations',
    sql: 'SELECT id, name, type, status, description, created_at FROM integrations ORDER BY created_at DESC LIMIT 1',
  },
  {
    name: 'communications',
    sql: 'SELECT id, type, subject, recipient, body, status, category, created_at, updated_at FROM communications ORDER BY created_at DESC LIMIT 1',
  },
];

(async () => {
  for (const query of queries) {
    try {
      const result = await pool.query(query.sql);
      console.log(`${query.name}: OK (${result.rowCount} rows)`);
    } catch (error) {
      console.error(`${query.name}: ERROR`, error.message);
      process.exit(1);
    }
  }
  process.exit(0);
})();
