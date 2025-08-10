const express = require('express');
const nodemailer = require('nodemailer');
const auth = require('../middleware/auth');
const router = express.Router();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

router.post('/send', auth, async (req, res) => {
  const { to, subject, html } = req.body;
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    });
    res.json({ msg: 'Email sent' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;