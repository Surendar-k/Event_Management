const CsoInbox = require('../MODELS/csoInbox.model');
const upcomingEvent = require('../MODELS/upcomingEvent.model');
const CombinedObjects = require('../MODELS/combinedObject.model');

const approveByCso = async (req, res) => {
  const { eventId, csoId } = req.body; // approverId is the user approving in CSO role

  if (!eventId || !csoId) {
    return res.status(400).json({ message: 'eventId and csoId are required' });
  }

  try {
    const csoEntry = await CsoInbox.findOne({ eventId });

    if (!csoEntry) {
      return res.status(404).json({ message: 'Event not found in CSO inbox' });
    }

    if (csoEntry.approved) {
      return res.status(400).json({ message: 'Event is already approved by CSO' });
    }

    // Mark as approved in CSO inbox
    csoEntry.approved = true;
    csoEntry.approvedAt = new Date();
    await csoEntry.save();

    // Create new event entry if not exists
    const alreadyExists = await upcomingEvent.findOne({ eventId });
    if (!alreadyExists) {
      const newUpcomingEvent = new upcomingEvent({
        eventId: csoEntry.eventId,
        department: csoEntry.department,
        eventDetails: csoEntry.eventDetails,
        approvedByCsoId: csoId,
        approvedAt: new Date(),
      });

      await newUpcomingEvent.save();
    }

    // Remove from CSO inbox
    await CsoInbox.deleteOne({ eventId });

    // Update combinedObjects status
    const event = await CombinedObjects.findOne({ eventId });
    if (event) {
      event.csoApproved = true;
      event.status = 'Approved by CSO and finalized';
      await event.save();
    }

    return res.status(200).json({
      message: 'Event approved by CSO and moved to Upcoming events collection',
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = approveByCso;
