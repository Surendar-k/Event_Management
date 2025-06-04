const mongoose = require('mongoose');

const remarkedEventSchema = new mongoose.Schema({
  eventId: {
    type: String,
    required: true
  },
  userId: { // Creator of the event
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rejectedBy: {
    type: String, // e.g., "HoD", "Dean", "Principal", "Director"
    required: true
  },
  remarks: {
    type: String,
    required: true
  },
  fullEventData: {
    type: Object, // Holds the complete finalEventInfo object
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Remarked_Event', remarkedEventSchema);
