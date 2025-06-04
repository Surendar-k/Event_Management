// db.js
const mongoose = require('mongoose');
const { MongoClient } = require("mongodb");
require('dotenv').config();

const connectDB = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI; // <-- Make sure this is defined
    if (!MONGO_URI) {
      throw new Error('MONGO_URI is not defined in the environment variables.');
    }

    await mongoose.connect(MONGO_URI); // No need for useNewUrlParser or useUnifiedTopology
    console.log('✅ MongoDB Connected Successfully');
  } catch (error) {
    console.error('❌ MongoDB Connection Failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
