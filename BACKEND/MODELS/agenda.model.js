const mongoose = require('mongoose');

// Define the session schema
const sessionSchema = new mongoose.Schema({
  date: { type: String, required: true },
  fromTime: { type: String, required: true }, // start time of session
  toTime: { type: String, required: true },   // end time of session
  sessionTitleTopic: { type: String, required: true },
  speaker: { type: String, required: true }
}, { _id: false }); // Disable _id for subdocuments if you want (optional)

// Define the agenda schema
const agendaSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'userId is required']
  },
  eventId: {
    type: String, // eventId from EventInfo model
    required: [true, 'eventId is required']
  },
  objectives: { type: String, required: true },
  outcomes: { type: String, required: true },
  numberOfSessions: { type: Number, default: 0 }, // optional but useful
  sessions: [sessionSchema],
  brochure: { type: String } // file path for brochure (uploaded PDF)
}, {
  timestamps: true // adds createdAt and updatedAt automatically
});

module.exports = mongoose.model('Agenda', agendaSchema);
