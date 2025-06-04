const express = require('express');
const router = express.Router();
const { mergeFinalEventInfo , getMergedEventInfo} = require('../CONTROLLERS/viewDetails');

router.post('/view-details/:eventId', mergeFinalEventInfo);
router.get('/view-details/:eventId', getMergedEventInfo);

module.exports = router;
