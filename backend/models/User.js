const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  discordId: { type: String, required: true, unique: true },
  discordName: { type: String, required: true },
  epicGamesName: { type: String, default: null },
  wins: { type: Number, default: 0 },
  losses: { type: Number, default: 0 },
  lastEpicUpdate: { type: Date, default: null },
  status: { type: String, enum: ['idle', 'inQueue', 'inGame'], default: 'idle' }, // New field
});

module.exports = mongoose.model('User', userSchema);