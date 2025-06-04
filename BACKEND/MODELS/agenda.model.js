const mongoose = require('mongoose');

// Define the session schema
const sessionSchema = new mongoose.Schema({
  date: { type: String, required: true },
  fromTime: { type: String, required: true }, // Replaced timeSlot with fromTime
  toTime: { type: String, required: true },   // Added toTime
  sessionTitleTopic: { type: String, required: true },
  speaker: { type: String, required: true }
});

const agendaSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'userId is required']
  },
  eventId: {
    type: String, // Store the eventId as a string since EventInfo's eventId is a string
    required: [true, 'eventId is required']
  },
  objectives: { type: String, required: true },
  outcomes: { type: String, required: true },
  sessions: [sessionSchema],
  brochure: { type: String } // Store the file path of the uploaded brochure/poster
});

module.exports = mongoose.model('Agenda', agendaSchema);