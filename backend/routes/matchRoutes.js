const express = require('express');
const matchController = require('../controllers/matchController');
const authenticate = require('../middleware/authenticate');
const router = express.Router();

// Leave a match
router.post('/leave', authenticate, matchController.leaveMatch);

module.exports = router;
// Get the current game for a user
router.get('/current', authenticate, matchController.getCurrentGame);