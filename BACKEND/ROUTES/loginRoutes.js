const express = require('express');
const router = express.Router();
const { loginUser } = require('../CONTROLLERS/login');

// POST /api/auth/login
router.post('/login', loginUser);

module.exports = router;
