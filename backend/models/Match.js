const mongoose = require("mongoose");

const MatchSchema = new mongoose.Schema({
  player1: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  player2: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  result: { type: String, enum: ["Player1", "Player2", "Draw"], default: "Draw" },
  tournamentId: { type: mongoose.Schema.Types.ObjectId, ref: "Tournament", required: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Match", MatchSchema);
