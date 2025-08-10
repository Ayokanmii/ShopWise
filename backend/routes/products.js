const express = require('express');
const { Pool } = require('pg');
const authenticate = require('../middleware/auth');
const router = express.Router();

console.log('Products DB Config:', {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: String(process.env.DB_PASSWORD),
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 5432,
});

pool.connect((err, client, release) => {
  if (err) {
    console.error('Products Pool connection error:', err.message, err.stack);
    return;
  }
  console.log('Products database connected successfully');
  release();
});

// GET all products (public access)
router.get('/products', async (req, res) => {
  try {
    console.log('Fetching products');
    const result = await pool.query('SELECT * FROM "products" ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('Products error:', err.code, err.message, err.stack);
    if (err.code === '42P01') {
      res.status(500).json({ error: 'Database table "products" not found' });
    } else {
      res.status(500).json({ error: 'Server error fetching products', details: err.message, code: err.code });
    }
  }
});

// GET single product by ID (public access)
router.get('/products/:id', async (req, res) => {
  const { id } = req.params;
  if (!Number.isInteger(Number(id))) {
    return res.status(400).json({ error: 'Invalid product ID' });
  }
  try {
    console.log(`Fetching product with ID: ${id}`);
    const result = await pool.query('SELECT * FROM "products" WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Product error:', err.code, err.message, err.stack);
    if (err.code === '42P01') {
      res.status(500).json({ error: 'Database table "products" not found' });
    } else {
      res.status(500).json({ error: 'Server error fetching product', details: err.message, code: err.code });
    }
  }
});

// ADD new product (authenticated)
router.post('/products', authenticate, async (req, res) => {
  const { name, description, price, category, image, stock } = req.body;
  if (!name || typeof price !== 'number' || price <= 0 || typeof stock !== 'number' || !Number.isInteger(stock) || stock < 0) {
    return res.status(400).json({ error: 'Name, valid price, and valid stock are required' });
  }
  try {
    console.log('Adding product:', { name, price, category, stock });
    const result = await pool.query(
      'INSERT INTO "products" (name, description, price, category, image, stock) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, description, price, category, image, stock]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Add product error:', err.code, err.message, err.stack);
    if (err.code === '42P01') {
      res.status(500).json({ error: 'Database table "products" not found' });
    } else {
      res.status(500).json({ error: 'Server error adding product', details: err.message, code: err.code });
    }
  }
});

// UPDATE product (authenticated)
router.put('/products/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  const { name, description, price, category, image, stock } = req.body;
  if (!Number.isInteger(Number(id))) {
    return res.status(400).json({ error: 'Invalid product ID' });
  }
  if (!name || typeof price !== 'number' || price <= 0 || typeof stock !== 'number' || !Number.isInteger(stock) || stock < 0) {
    return res.status(400).json({ error: 'Name, valid price, and valid stock are required' });
  }
  try {
    console.log(`Updating product ID: ${id}`);
    const result = await pool.query(
      `UPDATE "products" SET 
         name = $1, 
         description = $2, 
         price = $3, 
         category = $4, 
         image = $5, 
         stock = $6
       WHERE id = $7 RETURNING *`,
      [name, description, price, category, image, stock, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Update product error:', err.code, err.message, err.stack);
    if (err.code === '42P01') {
      res.status(500).json({ error: 'Database table "products" not found' });
    } else {
      res.status(500).json({ error: 'Server error updating product', details: err.message, code: err.code });
    }
  }
});

// DELETE product (authenticated)
router.delete('/products/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  if (!Number.isInteger(Number(id))) {
    return res.status(400).json({ error: 'Invalid product ID' });
  }
  try {
    console.log(`Deleting product ID: ${id}`);
    const result = await pool.query('DELETE FROM "products" WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error('Delete product error:', err.code, err.message, err.stack);
    if (err.code === '42P01') {
      res.status(500).json({ error: 'Database table "products" not found' });
    } else {
      res.status(500).json({ error: 'Server error deleting product', details: err.message, code: err.code });
    }
  }
});

module.exports = router;