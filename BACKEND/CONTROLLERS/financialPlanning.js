const FinancialPlan = require('../MODELS/financialPlanning.model');
const Event = require('../MODELS/financialPlanning.model');
const mongoose = require('mongoose');

exports.createFinancialPlan = async (req, res) => {
  try {
    const { userId, eventId, fundingSources, estimatedBudget } = req.body;

    // Validate userId
    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid userId format' });
    }

    // Validate eventId
    if (!eventId) {
      return res.status(400).json({ message: 'eventId is required' });
    }
    if (!/^EVT-\d{8}-[A-Za-z0-9]{5}$/.test(eventId)) {
      return res.status(400).json({ message: 'Invalid eventId format. Must be EVT-YYYYMMDD-XXXXX' });
    }

     console.log("Submitting financial plan for user:", userId, "and event:", eventId);

    // Verify event exists and is associated with the user
    // const event = await Event.findOne({ eventId, userId: new mongoose.Types.ObjectId(userId) });
    // if (!event) {
    //   return res.status(404).json({ message: 'No event found for this user and eventId' });
    // }

    // Parse fundingSources if it's a string
    let parsedFundingSources = fundingSources;
    if (typeof fundingSources === 'string') {
      try {
        parsedFundingSources = JSON.parse(fundingSources);
      } catch (parseError) {
        return res.status(400).json({ message: 'Invalid fundingSources format' });
      }
    }

    // Parse estimatedBudget if it's a string
    let parsedEstimatedBudget = estimatedBudget;
    if (typeof estimatedBudget === 'string') {
      try {
        parsedEstimatedBudget = JSON.parse(estimatedBudget);
      } catch (parseError) {
        return res.status(400).json({ message: 'Invalid estimatedBudget format' });
      }
    }

    const newFinancialPlan = new FinancialPlan({
      userId: new mongoose.Types.ObjectId(userId),
      eventId,
      fundingSources: parsedFundingSources,
      estimatedBudget: parsedEstimatedBudget
    });

    const savedFinancialPlan = await newFinancialPlan.save();

    res.status(201).json(savedFinancialPlan);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Function to get all financial plans
exports.getAllFinancialPlans = async (req, res) => {
  try {
    const financialPlans = await FinancialPlan.find();
    if (!financialPlans || financialPlans.length === 0) {
      return res.status(404).json({ message: 'No financial plans found' });
    }

    res.status(200).json(financialPlans);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Function to get funding sources by financial plan ID
exports.getFundingSources = async (req, res) => {
  try {
    const { userId, planId } = req.body;

    // Validate userId
    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid userId format' });
    }

    // Validate planId
    if (!planId) {
      return res.status(400).json({ message: 'planId is required' });
    }
    if (!mongoose.Types.ObjectId.isValid(planId)) {
      return res.status(400).json({ message: 'Invalid planId format' });
    }

    // Find the financial plan using planId and userId
    const financialPlan = await FinancialPlan.findOne({ _id: new mongoose.Types.ObjectId(planId), userId: new mongoose.Types.ObjectId(userId) });

    if (!financialPlan) {
      return res.status(404).json({ message: 'No financial plan found for this user with the provided ID' });
    }

    res.status(200).json(financialPlan.fundingSources);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Function to get estimated budget by financial plan ID
exports.getEstimatedBudget = async (req, res) => {
  try {
    const { userId, planId } = req.body;

    // Validate userId
    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid userId format' });
    }

    // Validate planId
    if (!planId) {
      return res.status(400).json({ message: 'planId is required' });
    }
    if (!mongoose.Types.ObjectId.isValid(planId)) {
      return res.status(400).json({ message: 'Invalid planId format' });
    }

    // Find the financial plan using planId and userId
    const financialPlan = await FinancialPlan.findOne({ _id: new mongoose.Types.ObjectId(planId), userId: new mongoose.Types.ObjectId(userId) });

    if (!financialPlan) {
      return res.status(404).json({ message: 'No financial plan found for this user with the provided ID' });
    }

    res.status(200).json(financialPlan.estimatedBudget);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Function to get financial plan by eventId
exports.getFinancialPlanByEventId = async (req, res) => {
  try {
    const { eventId } = req.body;

    // Validate eventId
    if (!eventId) {
      return res.status(400).json({ message: 'eventId is required' });
    }
    if (!/^EVT-\d{8}-[A-Za-z0-9]{5}$/.test(eventId)) {
      return res.status(400).json({ message: 'Invalid eventId format. Must be EVT-YYYYMMDD-XXXXX' });
    }

    // Find the financial plan using eventId
    const financialPlan = await FinancialPlan.findOne({ eventId });

    if (!financialPlan) {
      return res.status(404).json({ message: 'No financial plan found for this event' });
    }

    res.status(200).json(financialPlan);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};