const Event = require('../MODELS/eventInfo.model');
const User = require('../MODELS/login.model');

// Generate a unique event ID (e.g., EVT-20250505-XYZ123)
const generateEventId = async () => {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomPart = Math.random().toString(36).substring(2, 7).toUpperCase();
  const eventId = `EVT-${datePart}-${randomPart}`;

  // Ensure uniqueness by checking DB
  const exists = await Event.findOne({ eventId });
  if (exists) return generateEventId(); // Retry if collision
  return eventId;
};

const createEvent = async (req, res) => {
  try {
    const { userId, ...eventData } = req.body;

    // Validate userId
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Generate unique eventId
    const eventId = await generateEventId();

    // Create and save event
    const newEvent = new Event({
      eventId,
      ...eventData,
      userId: user._id
    });

    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { createEvent };
