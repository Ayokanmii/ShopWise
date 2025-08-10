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

router.post('/apply', auth, async (req, res) => {
  const { code } = req.body;
  try {
    const { rows } = await pool.query('SELECT * FROM coupons WHERE code = $1 AND expires_at > NOW()', [code]);
    if (rows.length === 0) return res.status(400).json({ msg: 'Invalid or expired coupon' });
    res.json({ discount: rows[0].discount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;