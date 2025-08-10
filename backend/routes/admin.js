const express = require('express');
const { Pool } = require('pg');
const auth = require('../middleware/auth');
const router = express.Router();

const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Admin access required' });
  }
  next();
};

router.use(auth, isAdmin);

router.post('/products', async (req, res) => {
  const { name, description, price, category, stock, image } = req.body;
  try {
    const { rows } = await pool.query(
      'INSERT INTO products (name, description, price, category, stock, image) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, description, price, category, stock, image]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/products/:id', async (req, res) => {
  const { name, description, price, category, stock, image } = req.body;
  try {
    const { rows } = await pool.query(
      'UPDATE products SET name = $1, description = $2, price = $3, category = $4, stock = $5, image = $6 WHERE id = $7 RETURNING *',
      [name, description, price, category, stock, image, req.params.id]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/products/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM products WHERE id = $1', [req.params.id]);
    res.json({ msg: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/orders', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT o.*, u.name, array_agg(json_build_object(' +
      "'product_id', oi.product_id, 'quantity', oi.quantity, 'name', p.name)) as products " +
      'FROM orders o ' +
      'JOIN users u ON o.user_id = u.id ' +
      'LEFT JOIN order_items oi ON o.id = oi.order_id ' +
      'LEFT JOIN products p ON oi.product_id = p.id ' +
      'GROUP BY o.id, u.name'
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;