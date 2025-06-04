const FinalEvent = require('../MODELS/viewDetails.model');
const EventInfo = require('../MODELS/eventInfo.model');
const RemarkedEvent = require('../MODELS/remarkedEvent.model');

const rejectEvent = async (req, res) => {
  try {
    const { eventId, rejectedBy, remarks } = req.body;
    const finalEvent = await FinalEvent.findOne({ eventId });

    if (!finalEvent) {
      return res.status(404).json({ message: 'Final Event not found' });
    }

    const eventInfo = await EventInfo.findOne({ eventId });

    if (!eventInfo) {
      return res.status(404).json({ message: 'Original Event Info not found' });
    }

    const creatorId = eventInfo.userId;

    const remarked = new RemarkedEvent({
      eventId,
      rejectedBy,
      userId: creatorId,
      remarks,
      fullEventData: finalEvent.toObject()
    });

    await remarked.save();

    finalEvent.status = 'rejected';
    await finalEvent.save();

    res.status(200).json({ message: 'Full event rejected and moved to creator inbox' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { rejectEvent };