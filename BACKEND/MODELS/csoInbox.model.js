const mongoose = require('mongoose');

const csoInboxSchema = new mongoose.Schema({
  csoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'csoId is required']
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
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { collection: 'csoInbox' });

module.exports = mongoose.model('CsoInbox', csoInboxSchema);