const express = require('express');
const Tournament = require('../models/Tournament');
const authenticate = require('../middlewares/authenticate');
const router = express.Router();
const cron = require('node-cron');

// Host a tournament
router.post('/host', authenticate, async (req, res) => {
  const { title, description, type, imageUrl, startTime, endTime } = req.body;

  if (!title || !description || !type || !startTime || !endTime) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const tournament = new Tournament({
      title,
      description,
      type,
      imageUrl,
      startTime,
      endTime,
      status: 'active',
    });

    await tournament.save();
    res.status(201).json({ message: 'Tournament hosted successfully!' });
  } catch (error) {
    console.error('Error hosting tournament:', error.message);
    res.status(500).json({ message: 'Failed to host tournament' });
  }
});

// Get active tournaments (Current Tournaments)
router.get('/cups', async (req, res) => {
  try {
    const tournaments = await Tournament.find({ status: 'active' });
    res.json(tournaments);
  } catch (error) {
    console.error('Error fetching active tournaments:', error.message);
    res.status(500).json({ message: 'Failed to fetch active tournaments' });
  }
});

// Get past tournaments
router.get('/past', async (req, res) => {
  try {
    const tournaments = await Tournament.find({ status: 'completed' });
    res.json(tournaments);
  } catch (error) {
    console.error('Error fetching past tournaments:', error.message);
    res.status(500).json({ message: 'Failed to fetch past tournaments' });
  }
});

// Cancel a tournament
router.post('/cancel', authenticate, async (req, res) => {
  const { tournamentId } = req.body;

  if (!tournamentId) {
    return res.status(400).json({ message: 'Tournament ID is required' });
  }

  try {
    const tournament = await Tournament.findById(tournamentId);

    if (!tournament) {
      return res.status(404).json({ message: 'Tournament not found' });
    }

    tournament.status = 'canceled';
    await tournament.save();

    res.json({ message: 'Tournament canceled successfully!' });
  } catch (error) {
    console.error('Error canceling tournament:', error.message);
    res.status(500).json({ message: 'Failed to cancel tournament' });
  }
});

// Delete a past tournament
router.delete('/delete/:id', authenticate, async (req, res) => {
  const { id } = req.params;

  try {
    const tournament = await Tournament.findById(id);

    if (!tournament) {
      return res.status(404).json({ message: 'Tournament not found' });
    }

    await Tournament.deleteOne({ _id: id });
    res.json({ message: 'Tournament deleted successfully!' });
  } catch (error) {
    console.error('Error deleting tournament:', error.message);
    res.status(500).json({ message: 'Failed to delete tournament' });
  }
});

// Automatically move completed tournaments to "completed" status
cron.schedule('*/1 * * * *', async () => {
  try {
    const now = new Date();
    const tournaments = await Tournament.find({ status: 'active' });

    for (const tournament of tournaments) {
      if (new Date(tournament.endTime) < now) {
        tournament.status = 'completed';
        await tournament.save();
        console.log(`Tournament "${tournament.title}" moved to completed.`);
      }
    }
  } catch (error) {
    console.error('Error updating tournament statuses:', error.message);
  }
});

module.exports = router;
