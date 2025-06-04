const InfraAndTech = require('../MODELS/infraAndTech.model');
const EventInfo = require('../MODELS/eventInfo.model'); // import EventInfo model

const createInfraAndTech = async (req, res) => {
  try {
    const { userId, ...infraData } = req.body;

    // Find event by userId
    const event = await EventInfo.findOne({ userId });

    if (!event) {
      return res.status(404).json({ message: 'Event not found for the given userId' });
    }

    // Create new InfraAndTech with eventId
    const newInfra = new InfraAndTech({
      ...infraData,
      userId,
      eventId: event.eventId // assuming eveId is the eventId
    });

    const savedInfra = await newInfra.save();
    console.log(savedInfra);
    res.status(201).json(savedInfra);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { createInfraAndTech };
