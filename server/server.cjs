const express = require('express');
const cors = require('cors');
const path = require('path');
const pool = require('./config/database.cjs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../dist')));

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  console.log('Request headers:', req.headers);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Request body:', req.body);
  }
  next();
});

// Test database connection and create admin user if needed
async function initializeDatabase() {
  try {
    // Test connection
    await pool.query('SELECT NOW()');
    console.log('✅ Database connected successfully');
    
    // Check if admin user exists
    const adminCheck = await pool.query('SELECT id FROM users WHERE username = $1', ['admin']);
    
    if (adminCheck.rows.length === 0) {
      console.log('Creating default admin user...');
      const bcrypt = require('bcryptjs');
      const passwordHash = await bcrypt.hash('myGod', 10);
      
      await pool.query(
        'INSERT INTO users (username, password_hash, name, role) VALUES ($1, $2, $3, $4)',
        ['admin', passwordHash, 'System Administrator', 'admin']
      );
      console.log('✅ Default admin user created (username: admin, password: myGod)');
    } else {
      console.log('✅ Admin user already exists');
    }
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    console.log('Please ensure PostgreSQL is running and the database exists');
  }
}

// Routes
try {
  const authRoutes = require('./routes/auth.cjs');
  const usersRoutes = require('./routes/users.cjs');
  const dashboardRoutes = require('./routes/dashboard.cjs');
  const roomsRoutes = require('./routes/rooms.cjs');
  const appDataRoutes = require('./routes/app-data.cjs');

  app.use('/api/auth', authRoutes);
  app.use('/api/users', usersRoutes);
  app.use('/api/dashboard', dashboardRoutes);
  app.use('/api/rooms', roomsRoutes);
  app.use('/api/app-data', appDataRoutes);
} catch (error) {
  console.error('Error loading routes:', error);
  process.exit(1);
}

// Serve React app - must be after API routes
app.use((req, res, next) => {
  // Only serve index.html for non-API routes
  if (!req.path.startsWith('/api')) {
    return res.sendFile(path.join(__dirname, '../dist/index.html'), (err) => {
      if (err) {
        // Fallback: try sending from root
        res.sendFile(path.join(__dirname, '../index.html'));
      }
    });
  }
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`API available at: http://localhost:${PORT}/api`);
  initializeDatabase();
});