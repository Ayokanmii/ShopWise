const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const router = express.Router();

console.log('DB Config:', {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'postgres',
  password: String(process.env.DB_PASSWORD) || 'Ayokanmi1.',
  database: process.env.DB_NAME || 'ecommerce',
  port: process.env.DB_PORT || 5432,
});

pool.connect((err, client, release) => {
  if (err) {
    console.error('Pool connection error:', err.message, err.stack);
    return;
  }
  console.log('Database connected successfully');
  release();
});

// Register
router.post('/register', async (req, res) => {
  const { email, password, name } = req.body;
  console.log('Register request:', { email, name, password: '***' });
  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Email, password, and name are required' });
  }
  if (!email.includes('@')) {
    return res.status(400).json({ error: 'Invalid email format' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }
  try {
    await pool.query('BEGIN');
    const checkResult = await pool.query('SELECT * FROM "users" WHERE email = $1', [email]);
    if (checkResult.rows.length > 0) {
      await pool.query('ROLLBACK');
      return res.status(400).json({ error: 'Email already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO "users" (email, password, name) VALUES ($1, $2, $3) RETURNING id',
      [email, hashedPassword, name]
    );
    const token = jwt.sign({ userId: result.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    await pool.query('COMMIT');
    res.status(201).json({ message: 'User registered successfully', token });
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error('Registration error:', err.code, err.message, err.stack);
    if (err.code === '23505') {
      return res.status(400).json({ error: 'Email already exists' });
    }
    if (err.code === '42P01') {
      return res.status(500).json({ error: 'Database table "users" not found' });
    }
    res.status(500).json({ error: 'Server error during registration', details: err.message, code: err.code });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('Login request:', { email, password: '***' });
  try {
    const result = await pool.query('SELECT * FROM "users" WHERE email = $1', [email]);
    const user = result.rows[0];
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({ token });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Forgot Password
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const result = await pool.query('SELECT * FROM "users" WHERE email = $1', [email]);
    const user = result.rows[0];
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'Password reset link sent to email (Twilio disabled)' });
  } catch (err) {
    console.error('Forgot password error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Reset Password
router.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query('UPDATE "users" SET password = $1 WHERE id = $2', [hashedPassword, decoded.userId]);
    res.json({ message: 'Password reset successfully' });
  } catch (err) {
    console.error('Reset password error:', err.message);
    res.status(400).json({ error: 'Invalid or expired token' });
  }
});

module.exports = router;