const express = require('express');
const router = express.Router();

const {rejectEvent} = require('../CONTROLLERS/remarkedEvent');

// POST: Reject an event with remarks
router.post('/reject-event', rejectEvent);

module.exports = router;
