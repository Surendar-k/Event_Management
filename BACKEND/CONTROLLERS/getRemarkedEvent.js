    const mongoose = require('mongoose');
    const RemarkedEvent = require('../MODELS/remarkedEvent.model');

    const getUserRemarkedEvents = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.params.userId);
        const remarkedEvents = await RemarkedEvent.find({ userId: userId }).lean();

        if (!remarkedEvents.length) {
        return res.status(404).json({ message: 'No remarked events found for this user.' });
        }

        res.status(200).json(remarkedEvents);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    };

    module.exports = {
    getRejectedEventsByUser: getUserRemarkedEvents
};
