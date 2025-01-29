const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const connectDB = require('./utils/db');

// Import routes
const authRoutes = require('./routes/auth');
const accountRoutes = require('./routes/account');
const tournamentRoutes = require('./routes/tournament');
const matchmakingRoutes = require('./routes/matchmaking');
const matchRoutes = require('./routes/match');

// Initialize app and server
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
connectDB();

// Routes
app.use('/auth', authRoutes);
app.use('/account', accountRoutes);
app.use('/tournament', tournamentRoutes);
app.use('/matchmaking', matchmakingRoutes);
app.use('/match', matchRoutes);

// Matchmaking logic
let queue = [];
const matches = {}; // Active matches { matchId: { player1, player2 } }
const userStatus = {}; // Track user status { username: 'inGame' or 'inQueue' }

io.on('connection', (socket) => {
  console.log(`✅ User connected: ${socket.id}`);

  // Join queue
  socket.on('joinQueue', ({ username, discordId, epicName, tournamentId }) => {
    if (!username || !tournamentId) {
      socket.emit('error', { message: 'Username and Tournament ID are required to join the queue.' });
      return;
    }

    // Check if user is already in a game
    if (userStatus[username] === 'inGame') {
      socket.emit('alreadyInGame', { message: 'You are already in a game.' });
      return;
    }

    if (userStatus[username] === 'inQueue') {
      socket.emit('alreadyInQueue', { message: 'You are already in the queue.' });
      return;
    }

    // Add player to queue
    const avatarUrl = discordId
      ? `https://cdn.discordapp.com/avatars/${discordId}/${discordId}.png`
      : '/default-avatar.png';

    const player = { id: socket.id, username, epicName, avatarUrl, tournamentId };
    queue.push(player);
    userStatus[username] = 'inQueue';

    console.log(`Player added to queue: ${username} for tournament: ${tournamentId}`);
    socket.emit('waiting', { message: 'You are in the queue. Waiting for another player...' });

    // Check for a match
    const tournamentQueue = queue.filter((p) => p.tournamentId === tournamentId);
    if (tournamentQueue.length >= 2) {
      const [player1, player2] = tournamentQueue.splice(0, 2);
      const matchId = `${player1.id}-${player2.id}`;
      matches[matchId] = { player1, player2 };

      userStatus[player1.username] = 'inGame';
      userStatus[player2.username] = 'inGame';

      io.to(player1.id).emit('matchFound', { matchId, self: player1, opponent: player2 });
      io.to(player2.id).emit('matchFound', { matchId, self: player2, opponent: player1 });

      console.log(`✅ Match created: ${player1.epicName} vs ${player2.epicName}`);
    }
  });

  // Leave match
  socket.on('leaveMatch', ({ username }) => {
    if (userStatus[username] === 'inGame') {
      delete userStatus[username];
      console.log(`${username} left the game and can requeue.`);
    }
  });

  socket.on('disconnect', () => {
    console.log(`🔴 User disconnected: ${socket.id}`);
    const playerIndex = queue.findIndex((p) => p.id === socket.id);
    if (playerIndex !== -1) {
      const username = queue[playerIndex].username;
      delete userStatus[username];
      queue.splice(playerIndex, 1);
    }
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
