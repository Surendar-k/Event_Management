const express = require('express');
const router = express.Router();

const approveByHod = require('../CONTROLLERS/approveByHod');

router.post('/approveByHod', approveByHod);

module.exports = router;