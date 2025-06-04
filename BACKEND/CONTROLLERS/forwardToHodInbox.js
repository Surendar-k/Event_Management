const CombinedObjects = require('../MODELS/combinedObject.model');
const HodInbox = require('../MODELS/hodInbox.model');

const forwardToHod = async (req, res) => {
  const { eventId, hodId } = req.body;

  if (!eventId || !hodId) {
    return res.status(400).json({ message: 'Event ID and HOD ID are required' });
  }

  try {
    const event = await CombinedObjects.findOne({ eventId });
    console.log('Event found:', event);

    if (!event) {
      return res.status(404).json({ message: 'Event not found in CombinedObjects' });
    }

    // Update original event status
    event.status = 'Forwarded to HOD';
    event.forwardedTo = event.forwardedTo || [];
    if (!event.forwardedTo.includes('HOD')) {
      event.forwardedTo.push('HOD');
    }
    event.forwardedAtHod = new Date();
    await event.save();

    // Save to HodInbox
    const existing = await HodInbox.findOne({ eventId });
    if (!existing) {
      const hodInboxEntry = new HodInbox({
        hodId,
        eventId,
        department: event.department,
        eventDetails: event,
      });
      await hodInboxEntry.save();
    }

    return res.status(200).json({
      message: 'Event forwarded successfully to HOD and saved in HodInbox',
      event,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { forwardToHod };
