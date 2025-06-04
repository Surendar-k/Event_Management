const express = require('express');
const router = express.Router();

const approveByCso = require('../CONTROLLERS/approveByCso');

router.post('/approveByCso', approveByCso);

module.exports = router;