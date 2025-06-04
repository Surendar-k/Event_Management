const express = require('express');
const router = express.Router();
const { getHodDepartmentEvents } = require('../CONTROLLERS/forwardToHod');

// Route to forward all existing events to HOD inbox
router.post('/forward-all-to-hod', getHodDepartmentEvents);

module.exports = router;