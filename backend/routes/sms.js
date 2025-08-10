const express = require('express');
const router = express.Router();

router.post('/send', (req, res) => {
  res.json({ message: 'SMS functionality disabled' });
});

module.exports = router;