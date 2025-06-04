const PrincipalInbox = require('../MODELS/principalInbox.model');
const CsoInbox = require('../MODELS/csoInbox.model');

const approveByPrincipal = async (req, res) => {
  const { eventId, csoId } = req.body;

  if (!eventId || !csoId) {
    return res.status(400).json({ message: 'eventId and csoId are required' });
  }

  try {
    const principalEntry = await PrincipalInbox.findOne({ eventId });

    if (!principalEntry) {
      return res.status(404).json({ message: 'Event not found in Principal inbox' });
    }

    if (principalEntry.approved) {
      return res.status(400).json({ message: 'Event is already approved by Principal' });
    }

    // Mark as approved in Principal inbox
    principalEntry.approved = true;
    principalEntry.approvedAt = new Date();
    await principalEntry.save();

    // Forward to CsoInbox if not already exists
    const alreadyExists = await CsoInbox.findOne({ eventId });
    if (!alreadyExists) {
      const csoEntry = new CsoInbox({
        csoId,
        eventId,
        department: principalEntry.department,
        eventDetails: principalEntry.eventDetails
      });

      await csoEntry.save();
    }

    return res.status(200).json({
      message: 'Event approved by Principal and forwarded to CSO',
      principalInbox: principalEntry
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = approveByPrincipal;
