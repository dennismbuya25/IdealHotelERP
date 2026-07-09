const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../config/database.cjs');
const { authenticateToken } = require('../middleware/auth.cjs');

const router = express.Router();

const defaultPermissionProfiles = {
  admin: ['Full Access', 'User Management', 'System Settings', 'Financial Reports'],
  manager: ['Dashboard', 'Bookings', 'Staff Management', 'Reports'],
  receptionist: ['Dashboard', 'Bookings', 'Guest Management', 'Front Desk'],
  housekeeping: ['Room Management', 'Housekeeping Tasks'],
  restaurant: ['Restaurant & KOT', 'Orders', 'Kitchen View'],
  hr: ['HR', 'Payroll', 'Rota Management', 'Staff Profiles'],
  guest: ['View Bookings', 'Book Rooms', 'Request Meals'],
};

const parseDate = (value) => (value ? new Date(value) : undefined);

const ensureBusinessTables = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS invoices (
      id TEXT PRIMARY KEY,
      booking_id TEXT,
      guest_name TEXT,
      items JSONB DEFAULT '[]'::JSONB,
      subtotal NUMERIC DEFAULT 0,
      tax NUMERIC DEFAULT 0,
      discount NUMERIC DEFAULT 0,
      total NUMERIC DEFAULT 0,
      payment_method TEXT,
      payment_status TEXT,
      issue_date TIMESTAMPTZ,
      due_date TIMESTAMPTZ
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS expenses (
      id TEXT PRIMARY KEY,
      description TEXT,
      category TEXT,
      amount NUMERIC DEFAULT 0,
      payment_method TEXT,
      date TIMESTAMPTZ,
      notes TEXT
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS integrations (
      id TEXT PRIMARY KEY,
      name TEXT,
      type TEXT,
      status TEXT,
      description TEXT,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

router.get('/', async (req, res) => {
  try {
    await ensureBusinessTables();

    const [roomsResult, bookingsResult, guestsResult, staffResult, inventoryResult, kitchenOrdersResult, usersResult, activityLogsResult, invoicesResult, expensesResult, integrationsResult] = await Promise.all([
      pool.query('SELECT id, number, type, status, price, floor, amenities, last_cleaned, assigned_cleaner, created_at, updated_at FROM rooms ORDER BY number'),
      pool.query(`
        SELECT 
          b.id,
          b.check_in,
          b.check_out,
          b.status,
          b.total_amount,
          b.payment_status,
          b.booking_source,
          b.special_requests,
          b.created_at,
          b.updated_at,
          b.room_id,
          g.name AS guest_name,
          g.phone AS guest_phone,
          g.address AS guest_address
        FROM bookings b
        LEFT JOIN guests g ON g.id = b.guest_id
        ORDER BY b.check_in DESC
      `),
      pool.query('SELECT id, name, email, phone, id_type, id_number, address, preferences, loyalty_points, total_stays, last_visit, notes, created_at, updated_at FROM guests ORDER BY name'),
      pool.query('SELECT id, name, email, phone, department, position, salary, join_date, shift, is_active, created_at, updated_at FROM staff ORDER BY name'),
      pool.query('SELECT id, name, category, current_stock, min_stock, max_stock, unit, unit_price, supplier, last_updated, created_at FROM inventory_items ORDER BY name'),
      pool.query('SELECT id, order_number, room_number, table_number, order_type, total_amount, status, order_time, estimated_time, waiter_name, created_at, updated_at FROM kitchen_orders ORDER BY order_time DESC'),
      pool.query('SELECT id, username, name, role, is_active, created_at, updated_at FROM users ORDER BY created_at DESC'),
      pool.query(`
        SELECT 
          al.id,
          al.action,
          al.details,
          COALESCE(u.name, 'System') AS actor,
          al.created_at AS timestamp
        FROM activity_logs al
        LEFT JOIN users u ON u.id = al.user_id
        ORDER BY al.created_at DESC
        LIMIT 25
      `),
      pool.query('SELECT id, booking_id, guest_name, items, subtotal, tax, discount, total, payment_method, payment_status, issue_date, due_date FROM invoices ORDER BY issue_date DESC'),
      pool.query('SELECT id, description, category, amount, payment_method, date, notes FROM expenses ORDER BY date DESC'),
      pool.query('SELECT id, name, type, status, description, created_at FROM integrations ORDER BY created_at DESC'),
    ]);

    const response = {
      rooms: roomsResult.rows.map((room) => ({ ...room, lastCleaned: parseDate(room.last_cleaned), createdAt: parseDate(room.created_at), updatedAt: parseDate(room.updated_at) })),
      bookings: bookingsResult.rows.map((booking) => ({
        id: booking.id,
        guestName: booking.guest_name || 'Guest',
        guestEmail: '',
        guestPhone: booking.guest_phone || '',
        roomId: booking.room_id || '',
        checkIn: parseDate(booking.check_in),
        checkOut: parseDate(booking.check_out),
        status: booking.status,
        totalAmount: Number(booking.total_amount || 0),
        paymentStatus: booking.payment_status || 'pending',
        bookingSource: booking.booking_source || 'walk-in',
        specialRequests: booking.special_requests || '',
      })),
      guests: guestsResult.rows.map((guest) => ({
        id: guest.id,
        name: guest.name,
        email: guest.email || '',
        phone: guest.phone || '',
        idType: guest.id_type || 'passport',
        idNumber: guest.id_number || '',
        address: guest.address || '',
        preferences: guest.preferences || [],
        loyaltyPoints: Number(guest.loyalty_points || 0),
        totalStays: Number(guest.total_stays || 0),
        lastVisit: parseDate(guest.last_visit),
        notes: guest.notes || '',
      })),
      staff: staffResult.rows.map((member) => ({
        id: member.id,
        name: member.name,
        email: member.email || '',
        phone: member.phone || '',
        department: member.department,
        position: member.position,
        salary: Number(member.salary || 0),
        joinDate: parseDate(member.join_date),
        shift: member.shift || 'morning',
        isActive: member.is_active,
        attendance: [],
      })),
      inventoryItems: inventoryResult.rows.map((item) => ({
        id: item.id,
        name: item.name,
        category: item.category,
        currentStock: Number(item.current_stock || 0),
        minStock: Number(item.min_stock || 0),
        maxStock: Number(item.max_stock || 0),
        unit: item.unit,
        lastUpdated: parseDate(item.last_updated),
        supplier: item.supplier || '',
        unitPrice: Number(item.unit_price || 0),
      })),
      kitchenOrders: kitchenOrdersResult.rows.map((order) => ({
        id: order.id,
        orderNumber: order.order_number,
        roomNumber: order.room_number || undefined,
        tableNumber: order.table_number || undefined,
        orderType: order.order_type,
        items: [],
        totalAmount: Number(order.total_amount || 0),
        status: order.status,
        orderTime: parseDate(order.order_time),
        estimatedTime: Number(order.estimated_time || 0),
        waiterName: order.waiter_name || undefined,
      })),
      users: usersResult.rows.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.username,
        role: user.role,
        isActive: user.is_active,
      })),
      auditLogs: activityLogsResult.rows.map((log) => ({
        id: log.id,
        action: log.action,
        details: log.details ? (typeof log.details === 'string' ? log.details : JSON.stringify(log.details)) : '',
        actor: log.actor || 'System',
        timestamp: parseDate(log.timestamp),
      })),
      invoices: invoicesResult.rows.map((invoice) => ({
        id: invoice.id,
        bookingId: invoice.booking_id || '',
        guestName: invoice.guest_name || 'Guest',
        items: invoice.items || [],
        subtotal: Number(invoice.subtotal || 0),
        tax: Number(invoice.tax || 0),
        discount: Number(invoice.discount || 0),
        total: Number(invoice.total || 0),
        paymentMethod: invoice.payment_method || 'cash',
        paymentStatus: invoice.payment_status || 'pending',
        issueDate: parseDate(invoice.issue_date),
        dueDate: parseDate(invoice.due_date),
      })),
      expenses: expensesResult.rows.map((expense) => ({
        id: expense.id,
        description: expense.description || 'Expense',
        category: expense.category || 'other',
        amount: Number(expense.amount || 0),
        paymentMethod: expense.payment_method || 'cash',
        date: parseDate(expense.date),
        notes: expense.notes || '',
      })),
      integrations: integrationsResult.rows.map((integration) => ({
        id: integration.id,
        name: integration.name,
        type: integration.type,
        status: integration.status || 'pending',
        description: integration.description || '',
      })),
      permissionProfiles: defaultPermissionProfiles,
    };

    res.json(response);
  } catch (error) {
    console.error('Get app data error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', authenticateToken, async (req, res) => {
  try {
    await ensureBusinessTables();
    const { entity, action, payload } = req.body;

    switch (entity) {
      case 'room': {
        if (action === 'create') {
          const { number, type, price, floor, amenities } = payload;
          const result = await pool.query(
            'INSERT INTO rooms (number, type, price, floor, amenities) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [number, type, price, floor, amenities || []]
          );
          return res.status(201).json({ record: result.rows[0] });
        }
        if (action === 'update') {
          const { id, ...rest } = payload;
          const result = await pool.query(
            'UPDATE rooms SET status = COALESCE($1, status), assigned_cleaner = COALESCE($2, assigned_cleaner), last_cleaned = COALESCE($3, last_cleaned), updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *',
            [rest.status, rest.assignedCleaner, rest.lastCleaned, id]
          );
          return res.json({ record: result.rows[0] });
        }
        if (action === 'delete') {
          await pool.query('DELETE FROM rooms WHERE id = $1', [payload.id]);
          return res.json({ success: true });
        }
        break;
      }
      case 'booking': {
        if (action === 'create') {
          const guestResult = await pool.query(
            'INSERT INTO guests (name, email, phone, id_type, id_number, address, preferences, loyalty_points, total_stays, last_visit, notes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id',
            [payload.guestName, payload.guestEmail || '', payload.guestPhone || '', 'passport', '', '', [], 0, 0, null, payload.specialRequests || '']
          );
          const result = await pool.query(
            'INSERT INTO bookings (guest_id, room_id, check_in, check_out, status, total_amount, payment_status, booking_source, special_requests) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
            [guestResult.rows[0].id, payload.roomId, payload.checkIn, payload.checkOut, payload.status, payload.totalAmount, payload.paymentStatus, payload.bookingSource, payload.specialRequests || '']
          );
          return res.status(201).json({ record: result.rows[0] });
        }
        if (action === 'update') {
          const { id, ...rest } = payload;
          const result = await pool.query(
            'UPDATE bookings SET status = COALESCE($1, status), payment_status = COALESCE($2, payment_status), updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
            [rest.status, rest.paymentStatus, id]
          );
          return res.json({ record: result.rows[0] });
        }
        if (action === 'delete') {
          await pool.query('DELETE FROM bookings WHERE id = $1', [payload.id]);
          return res.json({ success: true });
        }
        break;
      }
      case 'guest': {
        if (action === 'create') {
          const result = await pool.query(
            'INSERT INTO guests (name, email, phone, id_type, id_number, address, preferences, loyalty_points, total_stays, last_visit, notes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *',
            [payload.name, payload.email || '', payload.phone || '', payload.idType || 'passport', payload.idNumber || '', payload.address || '', payload.preferences || [], payload.loyaltyPoints || 0, payload.totalStays || 0, payload.lastVisit || null, payload.notes || '']
          );
          return res.status(201).json({ record: result.rows[0] });
        }
        if (action === 'update') {
          const { id, ...rest } = payload;
          const result = await pool.query(
            'UPDATE guests SET name = COALESCE($1, name), email = COALESCE($2, email), phone = COALESCE($3, phone), notes = COALESCE($4, notes), updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *',
            [rest.name, rest.email, rest.phone, rest.notes, id]
          );
          return res.json({ record: result.rows[0] });
        }
        if (action === 'delete') {
          await pool.query('DELETE FROM guests WHERE id = $1', [payload.id]);
          return res.json({ success: true });
        }
        break;
      }
      case 'staff': {
        if (action === 'create') {
          const result = await pool.query(
            'INSERT INTO staff (name, email, phone, department, position, salary, join_date, shift, is_active) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
            [payload.name, payload.email || '', payload.phone || '', payload.department, payload.position, payload.salary, payload.joinDate, payload.shift || 'morning', payload.isActive !== false]
          );
          return res.status(201).json({ record: result.rows[0] });
        }
        if (action === 'update') {
          const { id, ...rest } = payload;
          const result = await pool.query(
            'UPDATE staff SET name = COALESCE($1, name), email = COALESCE($2, email), phone = COALESCE($3, phone), position = COALESCE($4, position), salary = COALESCE($5, salary), is_active = COALESCE($6, is_active), updated_at = CURRENT_TIMESTAMP WHERE id = $7 RETURNING *',
            [rest.name, rest.email, rest.phone, rest.position, rest.salary, rest.isActive, id]
          );
          return res.json({ record: result.rows[0] });
        }
        if (action === 'delete') {
          await pool.query('DELETE FROM staff WHERE id = $1', [payload.id]);
          return res.json({ success: true });
        }
        break;
      }
      case 'inventoryItem': {
        if (action === 'create') {
          const result = await pool.query(
            'INSERT INTO inventory_items (name, category, current_stock, min_stock, max_stock, unit, unit_price, supplier, last_updated) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
            [payload.name, payload.category, payload.currentStock, payload.minStock, payload.maxStock, payload.unit, payload.unitPrice, payload.supplier || '', new Date()]
          );
          return res.status(201).json({ record: result.rows[0] });
        }
        if (action === 'update') {
          const { id, ...rest } = payload;
          const result = await pool.query(
            'UPDATE inventory_items SET current_stock = COALESCE($1, current_stock), min_stock = COALESCE($2, min_stock), max_stock = COALESCE($3, max_stock), unit_price = COALESCE($4, unit_price), supplier = COALESCE($5, supplier), last_updated = CURRENT_TIMESTAMP WHERE id = $6 RETURNING *',
            [rest.currentStock, rest.minStock, rest.maxStock, rest.unitPrice, rest.supplier, id]
          );
          return res.json({ record: result.rows[0] });
        }
        if (action === 'delete') {
          await pool.query('DELETE FROM inventory_items WHERE id = $1', [payload.id]);
          return res.json({ success: true });
        }
        break;
      }
      case 'kitchenOrder': {
        if (action === 'create') {
          const result = await pool.query(
            'INSERT INTO kitchen_orders (order_number, room_number, table_number, order_type, total_amount, status, order_time, estimated_time, waiter_name) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
            [payload.orderNumber, payload.roomNumber || null, payload.tableNumber || null, payload.orderType, payload.totalAmount, payload.status, payload.orderTime, payload.estimatedTime, payload.waiterName || null]
          );
          return res.status(201).json({ record: result.rows[0] });
        }
        if (action === 'update') {
          const { id, ...rest } = payload;
          const result = await pool.query(
            'UPDATE kitchen_orders SET status = COALESCE($1, status), updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
            [rest.status, id]
          );
          return res.json({ record: result.rows[0] });
        }
        if (action === 'delete') {
          await pool.query('DELETE FROM kitchen_orders WHERE id = $1', [payload.id]);
          return res.json({ success: true });
        }
        break;
      }
      case 'user': {
        if (action === 'create') {
          const passwordHash = await bcrypt.hash(payload.password || 'Welcome123!', 10);
          const result = await pool.query(
            'INSERT INTO users (username, password_hash, name, role) VALUES ($1, $2, $3, $4) RETURNING id, username, name, role, is_active',
            [payload.username || payload.email, passwordHash, payload.name, payload.role]
          );
          return res.status(201).json({ record: result.rows[0] });
        }
        if (action === 'update') {
          const { id, ...rest } = payload;
          const result = await pool.query(
            'UPDATE users SET name = COALESCE($1, name), role = COALESCE($2, role), is_active = COALESCE($3, is_active), updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING id, username, name, role, is_active',
            [rest.name, rest.role, rest.isActive, id]
          );
          return res.json({ record: result.rows[0] });
        }
        break;
      }
      case 'invoice': {
        if (action === 'create') {
          const result = await pool.query(
            'INSERT INTO invoices (id, booking_id, guest_name, items, subtotal, tax, discount, total, payment_method, payment_status, issue_date, due_date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *',
            [payload.id, payload.bookingId || '', payload.guestName || 'Guest', JSON.stringify(payload.items || []), payload.subtotal || 0, payload.tax || 0, payload.discount || 0, payload.total || 0, payload.paymentMethod || 'cash', payload.paymentStatus || 'pending', payload.issueDate || new Date(), payload.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)]
          );
          return res.status(201).json({ record: result.rows[0] });
        }
        break;
      }
      case 'expense': {
        if (action === 'create') {
          const result = await pool.query(
            'INSERT INTO expenses (id, description, category, amount, payment_method, date, notes) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [payload.id, payload.description, payload.category, payload.amount || 0, payload.paymentMethod || 'cash', payload.date || new Date(), payload.notes || '']
          );
          return res.status(201).json({ record: result.rows[0] });
        }
        break;
      }
      case 'integration': {
        if (action === 'create') {
          const result = await pool.query(
            'INSERT INTO integrations (id, name, type, status, description) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [payload.id, payload.name, payload.type, payload.status || 'pending', payload.description || '']
          );
          return res.status(201).json({ record: result.rows[0] });
        }
        break;
      }
      case 'auditLog': {
        if (action === 'create') {
          const result = await pool.query(
            'INSERT INTO activity_logs (user_id, action, details, ip_address) VALUES ($1, $2, $3, $4) RETURNING *',
            [req.user?.id || null, payload.action, payload.details, req.ip || '127.0.0.1']
          );
          return res.status(201).json({ record: result.rows[0] });
        }
        break;
      }
      default:
        return res.status(400).json({ error: 'Unsupported entity' });
    }

    return res.status(400).json({ error: 'Unsupported action' });
  } catch (error) {
    console.error('App data mutation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
