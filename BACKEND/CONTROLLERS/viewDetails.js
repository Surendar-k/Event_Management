const Agenda = require('../MODELS/agenda.model');
const { MealArrangement, RefreshmentArrangement, TravelArrangement } = require('../MODELS/foodAndTravel.model');
const EventInfo = require('../MODELS/eventInfo.model');
const InfraAndTech = require('../MODELS/infraAndTech.model');
const Checklist = require('../MODELS/checklist.model');
const FinancialPlanning = require('../MODELS/financialPlanning.model');
const combineObject = require('../MODELS/viewDetails.model');



const mergeFinalEventInfo = async (req, res) => {
  try {
    const { eventId } = req.params;

    // Fetch data from each collection
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

    // Construct final object
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
      financialPlanning
    };

    // Save to FinalEventInfo collection
    const finalInfo = new combineObject(mergedData);
    await finalInfo.save();

    res.status(201).json({ message: 'Final event info created successfully', data: finalInfo });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error merging event info', error: err.message });
  }
};

const getMergedEventInfo = async (req, res) => {
  try {
    const { eventId } = req.params;

    // Fetch merged data from FinalEventInfo collection
    const mergedData = await combineObject.findOne({ eventId });

    if (!mergedData) {
      return res.status(404).json({ message: 'Merged event info not found for this eventId' });
    }

    res.status(200).json(mergedData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching merged event info', error: err.message });
  }
};

module.exports = { mergeFinalEventInfo, getMergedEventInfo };
