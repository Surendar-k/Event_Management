const express = require("express");
const router = express.Router();
const checklistController = require("../CONTROLLERS/checklist");

// Create a new checklist
router.post("/checklist", checklistController.createChecklist);

// Get checklist by userId from URL param
router.get("/events/checklist/user/:userId", checklistController.getChecklist);

// Get checklist by userId from request body (optional)
router.post("/events/checklist/user", checklistController.getChecklistByBody);

// Get all checklists
router.get("/events/checklist", checklistController.getAllChecklists);

module.exports = router;
