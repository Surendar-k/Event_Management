const mongoose = require('mongoose');

const upcomingEventSchema = new mongoose.Schema({
  eventId: {
    type: String,
    required: [true, 'eventId is required'],
    unique: true
  },
  department: {
    type: String,
    required: [true, 'department is required']
  },
  eventDetails: {
    type: mongoose.Schema.Types.Mixed,
    required: [true, 'eventDetails is required']
  },
  approvedByCso: {
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
}, { collection: 'upcomingEvents' }); // <-- explicitly set collection name

module.exports = mongoose.model('upcomingEvent', upcomingEventSchema);
