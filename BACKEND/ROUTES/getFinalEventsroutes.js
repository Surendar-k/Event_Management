// routes/eventRoutes.js

const express = require('express');
const router = express.Router();
const { getAllUpcomingEvents } = require('../CONTROLLERS/getFinalEvents');

router.get('/get-final-events', getAllUpcomingEvents);

module.exports = router;
