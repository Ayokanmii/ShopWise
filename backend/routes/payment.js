const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
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

router.post('/create-checkout-session', auth, async (req, res) => {
  const { products } = req.body;
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: products.map((item) => ({
        price_data: {
          currency: 'usd',
          product_data: { name: item.name },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/success`,
      cancel_url: `${process.env.FRONTEND_URL}/cart`,
    });
    res.json({ id: session.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/confirm', auth, async (req, res) => {
  const { products, total, delivery_option, delivery_cost } = req.body;
  try {
    const { rows: order } = await pool.query(
      'INSERT INTO orders (user_id, total, delivery_option, delivery_cost) VALUES ($1, $2, $3, $4) RETURNING *',
      [req.user.id, total, delivery_option, delivery_cost]
    );
    for (const item of products) {
      await pool.query(
        'INSERT INTO order_items (order_id, product_id, quantity) VALUES ($1, $2, $3)',
        [order[0].id, item.product_id, item.quantity]
      );
    }
    res.status(201).json(order[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;