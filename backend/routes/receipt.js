const express = require('express');
const PDFDocument = require('pdfkit');
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

router.get('/generate/:orderId', auth, async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM orders WHERE id = $1 AND user_id = $2', [req.params.orderId, req.user.id]);
    if (rows.length === 0) return res.status(404).json({ msg: 'Order not found' });
    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=receipt-${req.params.orderId}.pdf`);
    doc.pipe(res);
    doc.fontSize(20).text('Trendify Receipt', { align: 'center' });
    doc.fontSize(14).text(`Order ID: ${req.params.orderId}`, { align: 'left' });
    doc.text(`Total: $${rows[0].total}`);
    doc.text(`Status: ${rows[0].status}`);
    doc.text(`Delivery: ${rows[0].delivery_option} ($${rows[0].delivery_cost})`);
    doc.end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;