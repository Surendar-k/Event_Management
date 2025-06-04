const express = require('express');
const router = express.Router();
const agendaController = require('../CONTROLLERS/agenda');

// Route to create a new agenda (Multer middleware applied in controller)
router.post('/agenda', agendaController.createAgenda);

module.exports = router;