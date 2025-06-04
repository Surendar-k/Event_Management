const express = require("express");
const router = express.Router();
const agendaController = require("../CONTROLLERS/agenda.js");

// Correct method
router.post("/agenda", agendaController.createAgenda);

// (Optional) Add other routes like get, put, delete here
// router.get('/agenda/:eventId', agendaController.getAgenda);

module.exports = router;
