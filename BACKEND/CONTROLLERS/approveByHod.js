const HodInbox = require('../MODELS/combinedObject.model');
const PrincipalInbox = require('../MODELS/principalInbox.model');

const approveByHod = async (req, res) => {
  const { eventId, principalId } = req.body;

  if (!eventId || !principalId) {
    return res.status(400).json({ message: 'eventId and principalId are required' });
  }

  try {
    const hodEntry = await HodInbox.findOne({ eventId });
    console.log('HOD Entry found:', hodEntry);

    if (!hodEntry) {
      return res.status(404).json({ message: 'Event not found in HOD inbox' });
    }

    if (hodEntry.approved) {
      return res.status(400).json({ message: 'Event is already approved by HOD' });
    }

    // Mark as approved in HOD inbox
    hodEntry.approved = true;
    hodEntry.approvedAt = new Date();
    await hodEntry.save();

    // Forward to PrincipalInbox
    const alreadyExists = await PrincipalInbox.findOne({ eventId });
    if (!alreadyExists) {
      const principalEntry = new PrincipalInbox({
        principalId,
        eventId,
        department: hodEntry.department,
        eventDetails: hodEntry.eventDetails
      });

      await principalEntry.save();
    }

    return res.status(200).json({
      message: 'Event approved by HOD and forwarded to Principal',
      hodInbox: hodEntry
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports =  approveByHod ;
