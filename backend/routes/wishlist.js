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

router.post('/add', auth, async (req, res) => {
  const { product_id } = req.body;
  try {
    const { rows } = await pool.query(
      'SELECT * FROM wishlist WHERE user_id = $1 AND product_id = $2',
      [req.user.id, product_id]
    );
    if (rows.length > 0) return res.json({ msg: 'Product already in wishlist' });
    const { rows: newItem } = await pool.query(
      'INSERT INTO wishlist (user_id, product_id) VALUES ($1, $2) RETURNING *',
      [req.user.id, product_id]
    );
    res.json(newItem[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT w.*, p.name, p.price FROM wishlist w JOIN products p ON w.product_id = p.id WHERE w.user_id = $1',
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;