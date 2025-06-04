const express = require('express');
const router = express.Router();
const { viewByDepartment} = require('../CONTROLLERS/viewForHod');

// Route to forward all existing events to HOD inbox
router.post('/view-hod', viewByDepartment);

module.exports = router;