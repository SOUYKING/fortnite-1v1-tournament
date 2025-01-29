const express = require('express');
const User = require('../models/User');
const authenticate = require('../middlewares/authenticate');
const router = express.Router();

// Get user account info
router.get('/', authenticate, async (req, res) => {
  try {
    let user = await User.findOne({ discordId: req.user.discordId });

    // If user doesn't exist, create a new record
    if (!user) {
      user = await User.create({
        discordId: req.user.discordId,
        discordName: req.user.discordName,
        epicGamesName: null,
        wins: 0,
        losses: 0,
      });
    }

    res.json({
      discordId: user.discordId,
      discordName: user.discordName,
      epicGamesName: user.epicGamesName || 'Not Set',
      wins: user.wins,
      losses: user.losses,
    });
  } catch (error) {
    console.error('Error fetching user account:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update Epic Games Name
router.post('/update', authenticate, async (req, res) => {
  const { epicGamesName } = req.body;

  if (!epicGamesName) {
    return res.status(400).json({ message: 'Epic Games Name is required' });
  }

  try {
    const user = await User.findOne({ discordId: req.user.discordId });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the user updated their Epic Games name within the past week
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // 1 week ago

    if (user.lastEpicUpdate && user.lastEpicUpdate > oneWeekAgo) {
      const timeRemaining = Math.ceil(
        (user.lastEpicUpdate.getTime() + 7 * 24 * 60 * 60 * 1000 - now.getTime()) / (24 * 60 * 60 * 1000)
      );
      return res.status(403).json({
        message: `You can only change your Epic Games name once every 7 days. Try again in ${timeRemaining} day(s).`,
      });
    }

    // Update Epic Games Name and lastEpicUpdate timestamp
    user.epicGamesName = epicGamesName;
    user.lastEpicUpdate = now;
    await user.save();

    res.json({ message: 'Epic Games Name updated successfully!' });
  } catch (error) {
    console.error('Error updating Epic Games Name:', error.message);
    res.status(500).json({ message: 'Failed to update Epic Games Name' });
  }
});


module.exports = router;
