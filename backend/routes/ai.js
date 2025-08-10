const express = require('express');
const axios = require('axios');
const authenticate = require('../middleware/auth');
const router = express.Router();

router.post('/recommend', authenticate, async (req, res) => {
  const { prompt } = req.body;
  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    res.json({ message: response.data.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch recommendation' });
  }
});

module.exports = router;