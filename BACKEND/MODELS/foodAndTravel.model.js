const mongoose = require('mongoose');

// 🥗 Subdocument Schema for Individual Meal
const mealSchema = new mongoose.Schema({
  date: String,
  time: String,
  mealType: String,
  category: String,
  menu: String,
  persons: String,
  servedAt: String,
  specialNotes: String
}, { _id: false });

// ☕ Subdocument Schema for Individual Refreshment
const refreshmentSchema = new mongoose.Schema({
  date: String,
  time: String,
  session: String,
  category: String,
  items: String,
  persons: String,
  servedAt: String,
  specialNotes: String
}, { _id: false });

// 🚗 Subdocument Schema for Individual Travel Entry
const travelSchema = new mongoose.Schema({
  category: String,
  model_of_travel: String,
  date: String,
  time: String,
  pickup_location: String,
  drop_location: String,
  remarks: String
}, { _id: false });

// 📦 Parent Document Schema for Arrangements (per Event/User)
const eventArrangementSchema = new mongoose.Schema({
  eventId: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  meals: [mealSchema],
  refreshments: [refreshmentSchema],
  travels: [travelSchema]
}, { timestamps: true });

module.exports = mongoose.model('Event_Arrangement', eventArrangementSchema);
