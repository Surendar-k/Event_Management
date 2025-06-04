const Checklist = require('../MODELS/checklist.model');
const Event = require('../MODELS/eventInfo.model');
const mongoose = require('mongoose');

exports.createChecklist = async (req, res) => {
  try {
    const { userId, tasks } = req.body;

    // Validate userId
    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }

    // Ensure userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid userId format' });
    }

    // Fetch the eventId from EventInfo collection based on userId
    const event = await Event.findOne({ userId: new mongoose.Types.ObjectId(userId) });
    if (!event) {
      return res.status(404).json({ message: 'No event found for this user' });
    }

    // Validate tasks
    // if (!tasks || !Array.isArray(tasks)) {
    //   return res.status(400).json({ message: 'tasks must be an array' });
    // }

   const checklist = new Checklist({
  userId: new mongoose.Types.ObjectId(userId),
  eventId: event.eventId,
  tasks: tasks.map(task => ({
    taskName: task.taskName,
    required: task.required || "NO",
    inCharge: task.inCharge || '',
    dueDate: task.dueDate || ''
  }))
});


    const savedChecklist = await checklist.save();

    res.status(201).json({ message: 'Checklist created successfully', checklist: savedChecklist });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

// Get checklist for a specific user
exports.getChecklist = async (req, res) => {
  try {
    const { userId } = req.body;

    // Validate userId
    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }

    // Ensure userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid userId format' });
    }

    // Fetch the eventId from EventInfo collection based on userId
    const event = await Event.findOne({ userId: new mongoose.Types.ObjectId(userId) });
    if (!event) {
      return res.status(404).json({ message: 'No event found for this user' });
    }

    // Find the checklist using the eventId
    const checklist = await Checklist.findOne({ eventId: event.eventId });

    if (!checklist) {
      return res.status(404).json({ message: 'No checklist found for this event' });
    }

    res.status(200).json(checklist);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.mergeFinalEventInfo = async (req, res) => {
  try {
    const { eventId } = req.body;

    const eventInfo = await EventInfo.findOne({ eventId });
    const infraAndTech = await InfraAndTech.findOne({ eventId });

    const meals = await MealArrangement.find({ eventId });
    const refreshments = await RefreshmentArrangement.find({ eventId });
    const travels = await TravelArrangement.find({ eventId });

    const agenda = await Agenda.find({ eventId });
    const checklist = await Checklist.find({ eventId });
    const financialPlanning = await FinancialPlanning.findOne({ eventId });

    if (!eventInfo) {
      return res.status(404).json({ message: 'Event Info not found for this eventId' });
    }

    const mergedData = {
      eventId,
      eventInfo,
      infraAndTech,
      foodAndTravel: {
        meals,
        refreshments,
        travels
      },
      agenda,
      checklist,
      financialPlanning,
      department: eventInfo.department,
      hodApprovalStatus: 'Pending',
      principalApprovalStatus: 'Pending',
      csoApprovalStatus: 'Pending'
    };

    const existingEvent = await CombinedObjects.findOne({ eventId });
    let finalInfo;
    if (existingEvent) {
      finalInfo = await CombinedObjects.findOneAndUpdate(
        { eventId },
        mergedData,
        { new: true }
      );
    } else {
      finalInfo = new CombinedObjects(mergedData);
      await finalInfo.save();
    }

    const hod = await User.findOne({ department: eventInfo.department, role: 'HOD' });
    if (!hod) {
      return res.status(404).json({ message: `No HOD found for department: ${eventInfo.department}` });
    }

    const existingEntry = await HodInbox.findOne({ hodId: hod._id, eventId });
    if (!existingEntry) {
      const hodInboxEntry = new HodInbox({
        hodId: hod._id,
        eventId,
        department: eventInfo.department,
        eventDetails: mergedData
      });
      await hodInboxEntry.save();
    }

    res.status(201).json({
      message: existingEntry
        ? 'Event updated in combined_objects, already forwarded to HOD inbox'
        : 'Final event info created and forwarded to HOD inbox',
      data: finalInfo,
      hodId: hod._id
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error merging event info', error: err.message });
  }
};