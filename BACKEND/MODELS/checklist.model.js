const mongoose = require('mongoose');

// Define default task list (cleaned and unique)
const defaultTasks = [
  { taskName: "Event Agenda", required: "NO", inCharge: "", dueDate: "" },
  { taskName: "Guest Invitations & Confirmation", required: "NO", inCharge: "", dueDate: "" },
  { taskName: "Participant Notification & Communication", required: "NO", inCharge: "", dueDate: "" },
  { taskName: "Newspaper Engagement (Event Column)", required: "NO", inCharge: "", dueDate: "" },
  { taskName: "Flex Banner Design & Installation", required: "NO", inCharge: "", dueDate: "" },
  { taskName: "Website & Social Media Pre-Event Updates", required: "NO", inCharge: "", dueDate: "" },
  { taskName: "Signage & Directional Boards Placement", required: "NO", inCharge: "", dueDate: "" },
  { taskName: "Hall Setup & Technical Requirements", required: "NO", inCharge: "", dueDate: "" },
  { taskName: "Floral Arrangements, Mementos, Shawl, Return Gifts", required: "NO", inCharge: "", dueDate: "" },
  { taskName: "Reception Desk & Welcome Setup", required: "NO", inCharge: "", dueDate: "" },
  { taskName: "Tree Plantation Ceremony", required: "NO", inCharge: "", dueDate: "" },
  { taskName: "Guest Reception At Campus", required: "NO", inCharge: "", dueDate: "" },
  { taskName: "Lift Coordinator Assigned", required: "NO", inCharge: "", dueDate: "" },
  { taskName: "Guest Book Signing & 2-Min Video Byte", required: "NO", inCharge: "", dueDate: "" },
  { taskName: "Photography & Videography Coverage", required: "NO", inCharge: "", dueDate: "" },
  { taskName: "Event Report Preparation & Submission", required: "NO", inCharge: "", dueDate: "" },
  { taskName: "Website and Social Media Post-Event Updates", required: "NO", inCharge: "", dueDate: "" },
  { taskName: "Certificate for Guest & Participants / Feedback From The Participants", required: "NO", inCharge: "", dueDate: "" },
];

// Define the task schema
const taskSchema = new mongoose.Schema({
  taskName: { type: String, required: true },
  required: {
    type: String,
    enum: ["yes", "no"],
    default: "no"
  },
  inCharge: { type: String, default: "" },
  dueDate: { type: String, default: "" }
});

// Define the checklist schema
const checklistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  eventId: {
    type: String,
    required: [true, 'eventId is required']
  },
  tasks: {
    type: [taskSchema],
    default: defaultTasks
  }
});

module.exports = mongoose.model('Checklist', checklistSchema);
