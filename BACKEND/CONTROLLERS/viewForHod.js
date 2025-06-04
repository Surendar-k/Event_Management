const hodInboxDb = require('../MODELS/combinedObject.model');

const viewByDepartment = async (req, res) => {
  const { department } = req.body;

  try {
    console.log('Department:', department);
    // Find events with matching department
    const events = await hodInboxDb.find({ department });
    console.log('Events found:', events);

    if (!events.length) {
      return res.status(404).json({ message: 'No events found for the department' });
    }

    return res.status(200).json({
      message: `Events found for department: ${department}`,
      events
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { viewByDepartment };
