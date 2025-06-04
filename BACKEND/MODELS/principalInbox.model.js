const mongoose = require('mongoose');

const principalInboxSchema = new mongoose.Schema({
  principalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'principalId is required']
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
});

module.exports = mongoose.model('PrincipalInbox', principalInboxSchema);