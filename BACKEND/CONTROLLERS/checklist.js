const Checklist = require('../MODELS/checklist.model');
const Event = require('../MODELS/eventInfo.model');
const mongoose = require('mongoose');

exports.createChecklist = async (req, res) => {
  try {
    const { userId, tasks } = req.body;

    if (!userId) return res.status(400).json({ message: 'userId is required' });
    if (!mongoose.Types.ObjectId.isValid(userId)) return res.status(400).json({ message: 'Invalid userId format' });

    const event = await Event.findOne({ userId: new mongoose.Types.ObjectId(userId) });
    if (!event) return res.status(404).json({ message: 'No event found for this user' });

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
    res.status(400).json({ message: error.message });
  }
};

exports.getChecklistByBody = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ message: 'userId is required' });
    if (!mongoose.Types.ObjectId.isValid(userId)) return res.status(400).json({ message: 'Invalid userId format' });

    const event = await Event.findOne({ userId: new mongoose.Types.ObjectId(userId) });
    if (!event) return res.status(404).json({ message: 'No event found for this user' });

    const checklist = await Checklist.findOne({ eventId: event.eventId });
    if (!checklist) return res.status(404).json({ message: 'No checklist found for this event' });

    res.status(200).json(checklist);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getChecklist = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) return res.status(400).json({ message: 'userId is required' });
    if (!mongoose.Types.ObjectId.isValid(userId)) return res.status(400).json({ message: 'Invalid userId format' });

    const event = await Event.findOne({ userId: new mongoose.Types.ObjectId(userId) });
    if (!event) return res.status(404).json({ message: 'No event found for this user' });

    const checklist = await Checklist.findOne({ eventId: event.eventId });
    if (!checklist) return res.status(404).json({ message: 'No checklist found for this event' });

    res.status(200).json(checklist);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllChecklists = async (req, res) => {
  try {
    const checklists = await Checklist.find({});
    res.status(200).json(checklists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
