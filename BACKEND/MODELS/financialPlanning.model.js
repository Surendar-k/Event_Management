const mongoose = require('mongoose');

// Default funding sources
const defaultFundingSources = [
  { particulars: "MANAGEMENT FUNDING", amount: 0, remarks: "" },
  { particulars: "DEPARTMENT FUNDING", amount: 0, remarks: "" },
  { particulars: "PARTICIPANT CONTRIBUTION / REGISTRATION FEES", amount: 0, remarks: "" },
  { particulars: "INDUSTRY / COMPANIES FUNDING", amount: 0, remarks: "" },
  { particulars: "GOVERNMENT GRANTS", amount: 0, remarks: "" },
  { particulars: "ALUMNI FUNDING", amount: 0, remarks: "" },
  { particulars: "PROFESSIONAL SOCIETIES / STUDENT CHAPTERS", amount: 0, remarks: "" },
  { particulars: "TECH CLUBS / INNOVATION CELLS", amount: 0, remarks: "" },
  { particulars: "EVENT COLLABORATIONS", amount: 0, remarks: "" },
  { particulars: "OTHERS", amount: 0, remarks: "" }
];

// Default estimated budget
const defaultEstimatedBudget = [
  { particulars: "RESOURCE PERSON HONORARIUM", amount: 0, remarks: "" },
  { particulars: "TRAVEL ALLOWANCE", amount: 0, remarks: "" },
  { particulars: "BANNERS / FLEX / BACKDROP", amount: 0, remarks: "" },
  { particulars: "PRINTING - CERTIFICATES, BROCHURES, POSTERS", amount: 0, remarks: "" },
  { particulars: "CEREMONIAL ARRANGEMENTS / MEMENTOS / GIFTS", amount: 0, remarks: "" },
  { particulars: "TECHNICAL ARRANGEMENTS", amount: 0, remarks: "" },
  { particulars: "STATIONERY & EVENT MATERIALS", amount: 0, remarks: "" },
  { particulars: "ACCOMMODATION & HOSPITALITY", amount: 0, remarks: "" },
  { particulars: "FOOD & REFRESHMENTS", amount: 0, remarks: "" },
  { particulars: "LOGISTICS & VENUE", amount: 0, remarks: "" },
  { particulars: "PHOTOGRAPHY / VIDEOGRAPHY", amount: 0, remarks: "" },
  { particulars: "DIGITAL PROMOTION & MEDIA", amount: 0, remarks: "" },
  { particulars: "MISCELLANEOUS / CONTINGENCY", amount: 0, remarks: "" }
];

// Define the funding source schema
const fundingSourceSchema = new mongoose.Schema({
  particulars: { type: String, required: true },
  amount: { type: Number, required: true },
  remarks: { type: String }
});

// Define the estimated budget schema
const estimatedBudgetSchema = new mongoose.Schema({
  particulars: { type: String, required: true },
  amount: { type: Number, required: true },
  remarks: { type: String }
});



// Define the financial plan schema
const financialPlanSchema = new mongoose.Schema({
eventId: { type: String, unique: true, required: true },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  fundingSources: {
    type: [fundingSourceSchema],
    default: defaultFundingSources
  },
  estimatedBudget: {
    type: [estimatedBudgetSchema],
    default: defaultEstimatedBudget
  }
});

module.exports = mongoose.model('FinancialPlan', financialPlanSchema);