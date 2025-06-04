const express = require('express');
const router = express.Router();
const financialPlanningController = require('../CONTROLLERS/financialPlanning');

// Route to create a new financial plan
router.post('/financial-planning', financialPlanningController.createFinancialPlan);

module.exports = router;