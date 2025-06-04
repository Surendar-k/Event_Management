const express = require('express');
const router = express.Router();
const checklistController = require('../CONTROLLERS/checklist');

// Create a new checklist
router.post('/checklist', checklistController.createChecklist);

module.exports = router;