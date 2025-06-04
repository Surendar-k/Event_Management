const UpcomingEvent = require('../MODELS/upcomingEvent.model');

const getAllUpcomingEvents = async (req, res) => {
  try {
    const events = await UpcomingEvent.find({});
    
    if (!events.length) {
      return res.status(404).json({ message: 'No upcoming events found' });
    }

    return res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    return res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = { getAllUpcomingEvents };