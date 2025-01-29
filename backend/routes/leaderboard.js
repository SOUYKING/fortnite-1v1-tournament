const express = require("express");
const User = require("../models/User");

const router = express.Router();

router.get('/:id/leaderboard', async (req, res) => {
  const { id } = req.params;

  try {
    const tournament = await Tournament.findById(id).populate('leaderboard'); // Make sure 'leaderboard' is populated
    if (!tournament) return res.status(404).json({ message: 'Tournament not found.' });

    res.json(tournament.leaderboard || []); // Return empty array if no leaderboard
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ message: 'Error fetching leaderboard.' });
  }
});
