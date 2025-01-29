const Match = require('../models/Match');
const User = require('../models/User');

// Leave a match
exports.leaveMatch = async (req, res) => {
  const { username } = req.body;

  try {
    // Find the user and update their status
    const user = await User.findOne({ discordName: username });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Update user status to idle
    user.status = 'idle';
    await user.save();

    // Remove the user from the match (if applicable)
    const match = await Match.findOne({
      $or: [{ player1: user._id }, { player2: user._id }],
    });

    if (match) {
      await Match.findByIdAndDelete(match._id);
    }

    res.json({ message: 'You have left the game. You can join the queue again.' });
  } catch (error) {
    console.error('Error leaving match:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};