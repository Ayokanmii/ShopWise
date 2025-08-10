const express = require('express');
const authenticate = require('../middleware/auth');
const { Pool } = require('pg');
const router = express.Router();

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Placeholder checkout route
router.post('/checkout', authenticate, async (req, res) => {
  const { cart } = req.body;
  const userId = req.user.userId;

  if (!cart || !Array.isArray(cart) || cart.length === 0) {
    return res.status(400).json({ error: 'Cart is empty or invalid' });
  }

  try {
    // Calculate total
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Insert order into database
    const result = await pool.query(
      'INSERT INTO orders (user_id, total, status) VALUES ($1, $2, $3) RETURNING *',
      [userId, total, 'pending']
    );

    res.json({ message: 'Order placed successfully', order: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to process checkout' });
  }
});

module.exports = router;