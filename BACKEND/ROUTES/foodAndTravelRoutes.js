const express = require('express');
const router = express.Router();
const arrangementController = require('../CONTROLLERS/foodAndtravel');

// Route to create a new agenda (Multer middleware applied in controller)
router.post('/arrangements',arrangementController.foodAndTravel);

module.exports = router;