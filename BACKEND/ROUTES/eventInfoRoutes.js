const express = require('express');
const router = express.Router();
const { createEvent } = require('../CONTROLLERS/eventInfo');

// POST /api/events - Create a new event
router.post('/event-Info', createEvent);

module.exports = router;
