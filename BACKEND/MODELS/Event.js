const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: String,
  date: Date,
  venue: String,
  type: String,
  department: String,
  approved: Boolean,
  agendaOverview: String,
  finalBudget: Number,
  speakers: [String],
  participants: [String],
  travelSchedule: String,
  approvalComments: String,
});

module.exports = mongoose.model("Event", eventSchema);
