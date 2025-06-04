const CombinedObjects = require('../MODELS/combinedObject.model');

const getHodDepartmentEvents = async (req, res) => {
  const { designation, department } = req.body;

  // if (designation !== 'HOD') {
  //   return res.status(403).json({ message: 'Access denied: only HODs can view this data' });
  // }

  if (!department) {
    return res.status(400).json({ message: 'Department is required' });
  }

  try {
    const events = await CombinedObjects.find({ department });

    if (!events.length) {
      return res.status(404).json({ message: 'No events found for your department' });
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

module.exports = { getHodDepartmentEvents };
