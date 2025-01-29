const express = require('express');
const router = express.Router();

// Report match result
router.post('/result', (req, res) => {
  const { matchId, winner, loser } = req.body;

  if (!matchId || !winner || !loser) {
    return res.status(400).json({ message: 'Match ID, Winner, and Loser are required.' });
  }

  res.json({ message: 'Match result recorded successfully!' });
});

module.exports = router;
