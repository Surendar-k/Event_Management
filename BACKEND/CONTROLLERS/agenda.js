const Agenda = require('../MODELS/agenda.model');
const Event = require('../MODELS/eventInfo.model');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises; // For file deletion

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Store files in the uploads/ directory
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Unique filename
  }
});

// File filter to accept only PDFs
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};

// Multer upload configuration
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 } // 2MB limit
}).single('brochure'); // The field name matches the form ("brochure")

// POST: Create a new agenda
exports.createAgenda = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {
      const { userId, objectives, outcomes, sessions } = req.body;

      // Validate userId
      if (!userId) {
        return res.status(400).json({ message: 'userId is required' });
      }

      // Ensure userId is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid userId format' });
      }

      // Fetch the eventId from EventInfo collection based on userId
      const event = await Event.findOne({ userId: new mongoose.Types.ObjectId(userId) });
      if (!event) {
        return res.status(404).json({ message: 'No event found for this user' });
      }

      // Parse sessions if it's a string (e.g., from form-data)
      let parsedSessions = sessions;
      if (typeof sessions === 'string') {
        try {
          parsedSessions = JSON.parse(sessions);
        } catch (parseError) {
          return res.status(400).json({ message: 'Invalid sessions format' });
        }
      }

      // Validate that each session has fromTime and toTime
      if (parsedSessions) {
        for (const session of parsedSessions) {
          if (!session.fromTime || !session.toTime) {
            return res.status(400).json({ message: 'Each session must have fromTime and toTime' });
          }
        }
      }

      const newAgenda = new Agenda({
        userId: new mongoose.Types.ObjectId(userId),
        eventId: event.eventId,
        objectives,
        outcomes,
        numberOfSessions: parsedSessions ? parsedSessions.length : 0,
        sessions: parsedSessions || [],
        brochure: req.file ? req.file.path : undefined
      });

      const savedAgenda = await newAgenda.save();
      res.status(201).json(savedAgenda);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
};