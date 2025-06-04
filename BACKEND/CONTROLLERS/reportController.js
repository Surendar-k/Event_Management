const Checklist = require("../MODELS/checklist.model");
const Event = require("../MODELS/eventInfo.model");
const mongoose = require("mongoose");

// Generate a report — example: get count of all events
exports.generateReport = async (req, res) => {
  try {
    const totalEvents = await Event.countDocuments();
    const totalChecklists = await Checklist.countDocuments();

    // You can customize this report logic as needed
    res.status(200).json({
      message: "Report generated successfully",
      totalEvents,
      totalChecklists,
    });
  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get all approved events for authenticated user or role
exports.getApprovedEvents = async (req, res) => {
  try {
    // For example, let's say 'approved' is a field in Event collection
    // You might filter by department or user as needed, here just approved true events
    
    const approvedEvents = await Event.find({ approved: true });

    if (!approvedEvents.length) {
      return res.status(404).json({ message: "No approved events found" });
    }

    res.status(200).json({ approvedEvents });
  } catch (error) {
    console.error("Error fetching approved events:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
