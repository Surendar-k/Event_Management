const express = require('express');
const router = express.Router();
const { createInfraAndTech } = require('../CONTROLLERS/infraAndTech');

// POST - Create infrastructure and tech arrangement
router.post('/infra-tech', createInfraAndTech);

module.exports = router;
