const express = require('express');
const axios = require('axios');
const router = express.Router();

const retryRequest = async (url, data, config, retries = 3, delay = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await axios.post(url, data, config);
    } catch (err) {
      if (i === retries - 1) throw err;
      console.log(`Retrying request (${i + 1}/${retries})...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

router.post('/recommend', async (req, res) => {
  const { prompt } = req.body;
  console.log('AI recommendation request:', { prompt });

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  if (!process.env.OPENROUTER_API_KEY) {
    console.error('OPENROUTER_API_KEY is not set in environment variables');
    return res.status(500).json({ error: 'Server configuration error: Missing OpenRouter API key' });
  }

  try {
    const response = await retryRequest(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'meta-llama/llama-3.1-8b-instruct',
        messages: [{ role: 'user', content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 60000,
      }
    );
    console.log('AI response:', JSON.stringify(response.data, null, 2));
    const recommendation = response.data.choices[0].message.content || 'No suggestions received';
    console.log('Extracted recommendation:', recommendation);
    res.json({ recommendation });
  } catch (err) {
    console.error('AI recommendation error:', err.response?.data || err.message);
    if (err.code === 'ECONNRESET' || err.code === 'ETIMEDOUT') {
      res.status(503).json({ error: 'Network error with AI service, please try again' });
    } else {
      res.status(500).json({ error: 'Could not get recommendation', details: err.response?.data?.error || err.message });
    }
  }
});

module.exports = router;