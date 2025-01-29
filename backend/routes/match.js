const express = require('express');
const Match = require('../models/Match');
const authenticate = require('../middlewares/authenticate');
const router = express.Router();

// Get match history
router.get('/history', authenticate, async (req, res) => {
  try {
    const matches = await Match.find({
      $or: [{ player1: req.user._id }, { player2: req.user._id }],
    }).populate('player1 player2');

    res.json(matches);
  } catch (error) {
    console.error('Error fetching match history:', error);
    res.status(500).json({ message: 'Failed to fetch match history' });
  }
});

// Report match result
router.post('/result', authenticate, async (req, res) => {
  const { matchId, winner } = req.body;

  if (!matchId || !winner) {
    return res.status(400).json({ message: 'Match ID and winner are required.' });
  }

  try {
    const match = await Match.findById(matchId);
    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }

    match.result = winner;
    await match.save();

    res.json({ message: 'Match result recorded successfully!' });
  } catch (error) {
    console.error('Error reporting match result:', error);
    res.status(500).json({ message: 'Failed to report match result' });
  }
});

module.exports = router;
