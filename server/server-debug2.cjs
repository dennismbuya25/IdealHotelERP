const express = require('express');
const cors = require('cors');
const path = require('path');
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

// Test route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

console.log('Loading all routes...');
app.use('/api/auth', require('./routes/auth.cjs'));
console.log('Auth route loaded');

app.use('/api/users', require('./routes/users.cjs'));
console.log('Users route loaded');

app.use('/api/dashboard', require('./routes/dashboard.cjs'));
console.log('Dashboard route loaded');

app.use('/api/rooms', require('./routes/rooms.cjs'));
console.log('Rooms route loaded');

console.log('All routes loaded successfully');

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

console.log('Listening on port', PORT);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
