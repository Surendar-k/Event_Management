const express = require('express');
const router = express.Router();
const { viewforPrincipal} = require('../CONTROLLERS/viewForPrincipal');

// Route to forward all existing events to HOD inbox
router.post('/view-principal', viewforPrincipal);

module.exports = router;