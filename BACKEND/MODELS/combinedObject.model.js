const mongoose = require('mongoose');

const finalEventInfoSchema = new mongoose.Schema({
  eventId: {
    type: String,
    required: [true, 'eventId is required'],
    unique: true
  },
  eventInfo: {
    type: Object,
    required: [true, 'eventInfo is required']
  },
  infraAndTech: {
    type: Object,
    default: null
  },
  foodAndTravel: {
    meals: { type: [Object], default: [] },
    refreshments: { type: [Object], default: [] },
    travels: { type: [Object], default: [] }
  },
  agenda: {
    type: [Object],
    default: []
  },
  checklist: {
    type: [Object],
    default: []
  },
  financialPlanning: {
    type: Object,
    default: null
  },
  department: {
    type: String,
    required: [true, 'department is required']
  },
  hodApprovalStatus: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  principalApprovalStatus: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  csoApprovalStatus: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  }
}, { timestamps: true, collection: 'combined_objects' });

module.exports = mongoose.model('CombinedObjects', finalEventInfoSchema);