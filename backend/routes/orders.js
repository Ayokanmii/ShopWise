const express = require('express');
const { Pool } = require('pg');
const authenticate = require('../middleware/auth');
const router = express.Router();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'postgres',
  password: String(process.env.DB_PASSWORD) || 'Ayokanmi1.',
  database: process.env.DB_NAME || 'ecommerce',
  port: process.env.DB_PORT || 5432,
});

// Get orders for authenticated user
router.get('/orders', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    console.log('Fetching orders for user:', userId);
    const result = await pool.query('SELECT * FROM "Order" WHERE user_id = $1 ORDER BY id ASC', [userId]);
    res.json(result.rows);
  } catch (err) {
    console.error('Orders error:', err.message);
    res.status(500).json({ error: 'Failed to fetch orders', details: err.message });
  }
});

// Get order items for a specific order
router.get('/orders/:id/items', authenticate, async (req, res) => {
  try {
    const orderId = req.params.id;
    const userId = req.user.id;
    console.log('Fetching items for order:', orderId, 'user:', userId);
    const result = await pool.query(
      'SELECT oi.id, oi.order_id, oi.product_id, oi.quantity, oi.price::float AS price, p.name FROM "OrderItem" oi JOIN "products" p ON oi.product_id = p.id JOIN "Order" o ON oi.order_id = o.id WHERE oi.order_id = $1 AND o.user_id = $2',
      [orderId, userId]
    );
    console.log('Order items result:', result.rows);
    res.json(result.rows.length ? result.rows : []);
  } catch (err) {
    console.error('Order items error:', err.message);
    res.status(500).json({ error: 'Failed to fetch order items', details: err.message });
  }
});

// Checkout
router.post('/checkout', authenticate, async (req, res) => {
  const { cartItems } = req.body;
  const userId = req.user.id;
  console.log('Checkout request:', { userId, cartItems });

  if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
    return res.status(400).json({ error: 'Invalid checkout data' });
  }

  try {
    await pool.query('BEGIN');
    const orderResult = await pool.query(
      'INSERT INTO "Order" (user_id, status) VALUES ($1, $2) RETURNING id',
      [userId, 'pending']
    );
    const orderId = orderResult.rows[0].id;

    for (const item of cartItems) {
      const productResult = await pool.query('SELECT price, stock, name FROM "products" WHERE id = $1', [item.id]);
      if (productResult.rows.length === 0) {
        await pool.query('ROLLBACK');
        return res.status(404).json({ error: `Product ID ${item.id} not found` });
      }
      const { price, stock } = productResult.rows[0];
      if (stock < item.quantity) {
        await pool.query('ROLLBACK');
        return res.status(400).json({ error: `Insufficient stock for product ID ${item.id}` });
      }
      await pool.query(
        'INSERT INTO "OrderItem" (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
        [orderId, item.id, item.quantity, Number(price)]
      );
      await pool.query('UPDATE "products" SET stock = stock - $1 WHERE id = $2', [item.quantity, item.id]);
    }

    await pool.query('COMMIT');
    res.status(201).json({ message: 'Checkout successful', orderId });
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error('Checkout error:', err.message);
    res.status(500).json({ error: 'Checkout failed', details: err.message });
  }
});

module.exports = router;