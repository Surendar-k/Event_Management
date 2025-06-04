const PrincipalInboxDb = require('../MODELS/principalInbox.model');

const viewforPrincipal = async (req, res) => {
  const { principalId } = req.body;

  try {
    const events = await PrincipalInboxDb.find({ principalId});

    if (!events.length) {
      return res.status(404).json({ message: 'No events found for principal' });
    }

    return res.status(200).json({
      message: `Events found for principal: ${principalId}`,
      events
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { viewforPrincipal };
