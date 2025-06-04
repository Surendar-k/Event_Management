const mongoose = require('mongoose');

const finalEventInfoSchema = new mongoose.Schema({
  eventId: {
    type: String,
    required: true,
    unique: true
  },

  eventInfo: {
    type: Object,
    required: true
  },

  infraAndTech: {
    type: Object
  },

  foodAndTravel: {
    meals: [Object],
    refreshments: [Object],
    travels: [Object]
  },

  agenda: {
    type: [Object]
  },

  checklist: {
    type: [Object]
  },

  financialPlanning: {
    type: Object
  }

}, { timestamps: true });

module.exports = mongoose.model('combined_Object', finalEventInfoSchema);
