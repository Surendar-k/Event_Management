const express = require('express');
const router = express.Router();

const approveByPrincipal = require('../CONTROLLERS/approveByPrincipal');

router.post('/approveByPrincipal', approveByPrincipal);

module.exports = router;