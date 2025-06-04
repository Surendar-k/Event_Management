const mongoose = require('mongoose');

const hodInboxSchema = new mongoose.Schema({
  hodId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'hodId is required']
  },
  eventId: {
    type: String,
    required: [true, 'eventId is required']
  },
  department: {
    type: String,
    required: [true, 'department is required']
  },
  eventDetails: {
    type: mongoose.Schema.Types.Mixed,
    required: [true, 'eventDetails is required']
  },
  approved: {
    type: Boolean,
    default: false
  },
  approvedAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('HodInbox', hodInboxSchema);
