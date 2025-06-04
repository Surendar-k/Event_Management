const mongoose = require('mongoose');

const infraAndTech = new mongoose.Schema({
  eventId: { type: String},
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  microphoneType: {
    type: String,
    required: true,
  },
  speakers: {
    type: String,
    required: true,
  },
  airConditioning: {
    type: String,
    required: true,
  },
  number_of_units: {
    type: String,
    
  },
  additional_ventilation: {
    type: String,
    required: true,
  },
  projector_screen: {
    type: String,
    required: true,
  },
  whiteBoard: {
    type: String,
    required: true,
  },
  additional_writing_material: {
    type: String,
    required: true,
  },
  photography: {
    type: String,
    required: true,
  },
  videography: {
    type: String,
    required: true,
  },
  professional_lighting: {
    type: String,
    required: true,
  },
  live_streaming: {
    type: String,
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('InfraAndTech', infraAndTech);
