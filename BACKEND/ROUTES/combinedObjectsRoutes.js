const express = require('express');
const router = express.Router();
const { mergeFinalEventInfo } = require('../CONTROLLERS/combinedObjects');

router.post('/final', mergeFinalEventInfo);

module.exports = router;