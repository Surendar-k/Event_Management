const csoInboxDb = require('../MODELS/csoInbox.model');

const viewforCso = async (req, res) => {
  const { csoId } = req.body;

  try {
    const events = await csoInboxDb.find({ csoId });

    if (!events.length) {
      return res.status(404).json({ message: 'No events found for cso' });
    }

    return res.status(200).json({
      message: `Events found for cso: ${csoId}`,
      events
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { viewforCso };
