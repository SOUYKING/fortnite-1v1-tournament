const mongoose = require('mongoose');

const tournamentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, required: true },
  imageUrl: { type: String },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  status: { type: String, default: 'active' }, // 'active', 'canceled', 'completed'
});

module.exports = mongoose.model('Tournament', tournamentSchema);
