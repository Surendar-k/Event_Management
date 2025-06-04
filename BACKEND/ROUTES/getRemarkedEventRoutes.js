const express = require('express');
const router = express.Router();

const {
  getRejectedEventsByUser
} = require('../CONTROLLERS/getRemarkedEvent');

// Get remarked events for the logged-in user
router.get('/rejected-events/:userId', getRejectedEventsByUser);

module.exports = router;
