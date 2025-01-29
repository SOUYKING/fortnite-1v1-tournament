const express = require('express');
const router = express.Router();

const userStatus = {}; // Track user status { username: 'inQueue' or 'inGame' }

// Check if a user is in a queue or match
router.get('/status', (req, res) => {
  const { username } = req.query;
  if (!username) {
    return res.status(400).json({ message: 'Username is required.' });
  }

  const status = userStatus[username] || 'idle';
  res.json({ status });
});

// Join matchmaking queue
router.post('/join', (req, res) => {
  const { username, discordId, epicName, tournamentId } = req.body;

  if (!username || !tournamentId) {
    return res.status(400).json({ message: 'Username and Tournament ID are required.' });
  }

  if (userStatus[username] === 'inGame') {
    return res.status(403).json({ message: 'You are already in a game.' });
  }
  
  if (userStatus[username] === 'inQueue') {
    return res.status(403).json({ message: 'You are already in the queue.' });
  }

  userStatus[username] = 'inQueue';

  res.json({ message: 'Joined the queue successfully.' });
});

// Mark user as in-game
router.post('/start-match', (req, res) => {
  const { username } = req.body;
  if (!username) {
    return res.status(400).json({ message: 'Username is required.' });
  }
  userStatus[username] = 'inGame';
  res.json({ message: 'User is now in a match.' });
});

// Mark user as not in a game (when they leave)
router.post('/leave-match', (req, res) => {
  const { username } = req.body;
  if (!username) {
    return res.status(400).json({ message: 'Username is required.' });
  }
  delete userStatus[username];
  res.json({ message: 'User left the match.' });
});

module.exports = router;
