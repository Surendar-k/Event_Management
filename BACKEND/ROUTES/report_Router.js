const express = require("express");
const router = express.Router();

const {
  generateReport,
  getApprovedEvents,
} = require("../CONTROLLERS/reportController");

const authMiddleware = require("../MIDDLEWARE/authMiddleware");

// Public report endpoint
router.get("/report", generateReport);

// Protected approved events endpoint
router.get("/approved", authMiddleware, getApprovedEvents);

module.exports = router;
