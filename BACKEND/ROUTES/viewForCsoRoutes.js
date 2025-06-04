const express = require('express');
const router = express.Router();
const { viewforCso} = require('../CONTROLLERS/viewForCso');

// Route to forward all existing events to HOD inbox
router.post('/view-cso', viewforCso);

module.exports = router;