const express = require('express');
const router = express.Router();

const userStatus = {}; // Track user status { username: 'inQueue' or 'inGame' }

// Check user matchmaking status
router.get('/status', (req, res) => {
  const { username } = req.query;
  if (!username) {
    return res.status(400).json({ message: 'Username is required.' });
  }

  const status = userStatus[username] || 'idle';
  res.json({ status });
});

module.exports = router;
