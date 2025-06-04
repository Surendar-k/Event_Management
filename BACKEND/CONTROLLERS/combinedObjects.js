const Agenda = require('../MODELS/agenda.model');
const EventInfo = require('../MODELS/eventInfo.model');
const Checklist = require('../MODELS/checklist.model');
const FinancialPlanning = require('../MODELS/financialPlanning.model');
const CombinedObjects = require('../MODELS/combinedObject.model');
const InfraAndTech = require('../MODELS/infraAndTech.model');
const EventArrangement = require('../MODELS/foodAndTravel.model');
// const HodInbox = require('../MODELS/hodInbox.model');
// const PrincipalInbox = require('../MODELS/principalInbox.model');
// const CsoInbox = require('../MODELS/csoInbox.model');
// const UpcomingEvent = require('../MODELS/upcomingEvents.model');
const User = require('../MODELS/login.model');

const approveEventByCso = async (req, res) => {
  try {
    const { eventId, csoId } = req.body;
    // Verify the CSO
    const cso = await User.findById(csoId);
    if (!cso || cso.role !== 'CSO') {
      return res.status(403).json({ message: 'Invalid CSO ID or user is not a CSO' });
    }

    // Find the event in csoInbox
    const csoInboxEntry = await CsoInbox.findOne({ eventId, csoId });
    if (!csoInboxEntry) {
      return res.status(404).json({ message: 'Event not found in CSO inbox' });
    }

    // Update the csoApprovalStatus in combined_object
    const event = await CombinedObjects.findOne({ eventId });
    if (!event) {
      return res.status(404).json({ message: 'Event not found in combined_object' });
    }
    event.csoApprovalStatus = 'Approved';
    await event.save();

    // Check if the event is already in upcomingEvent to avoid duplicates
    const existingUpcomingEvent = await UpcomingEvent.findOne({ eventId });
    if (existingUpcomingEvent) {
      return res.status(400).json({ message: 'Event already forwarded to upcomingEvent collection' });
    }

    // Move the event to upcomingEvent
    const upcomingEventEntry = new UpcomingEvent({
      eventId,
      department: csoInboxEntry.department,
      eventDetails: csoInboxEntry.eventDetails
    });
    await upcomingEventEntry.save();

    res.status(200).json({
      message: 'Event approved by CSO and moved to upcomingEvent collection',
      hodApprovalStatus: event.hodApprovalStatus,
      principalApprovalStatus: event.principalApprovalStatus,
      csoApprovalStatus: event.csoApprovalStatus
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error approving event', error: err.message });
  }
};

const approveEventByPrincipal = async (req, res) => {
  try {
    const { eventId, principalId } = req.body;

    const principal = await User.findById(principalId);
    if (!principal || principal.role !== 'Principal') {
      return res.status(403).json({ message: 'Invalid Principal ID or user is not a Principal' });
    }

    const principalInboxEntry = await PrincipalInbox.findOne({ eventId, principalId });
    if (!principalInboxEntry) {
      return res.status(404).json({ message: 'Event not found in Principal inbox' });
    }

    const event = await CombinedObjects.findOne({ eventId });
    if (!event) {
      return res.status(404).json({ message: 'Event not found in combined_object' });
    }
    event.principalApprovalStatus = 'Approved';
    event.csoApprovalStatus = 'Pending'; // Initialize CSO approval status
    await event.save();

    const cso = await User.findOne({ role: 'CSO' });
    if (!cso) {
      return res.status(404).json({ message: 'No CSO found' });
    }

    const existingCsoEntry = await CsoInbox.findOne({ eventId });
    if (existingCsoEntry) {
      return res.status(400).json({ message: 'Event already forwarded to CSO inbox' });
    }

    const csoInboxEntry = new CsoInbox({
      csoId: cso._id,
      eventId,
      department: principalInboxEntry.department,
      eventDetails: principalInboxEntry.eventDetails
    });
    await csoInboxEntry.save();

    res.status(200).json({
      message: 'Event approved by Principal and forwarded to CSO inbox',
      csoId: cso._id,
      hodApprovalStatus: event.hodApprovalStatus,
      principalApprovalStatus: event.principalApprovalStatus,
      csoApprovalStatus: event.csoApprovalStatus
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error approving event', error: err.message });
  }
};

const approveEventByHod = async (req, res) => {
  try {
    const { eventId, hodId } = req.body;

    const hod = await User.findById(hodId);
    if (!hod || hod.role !== 'HOD') {
      return res.status(403).json({ message: 'Invalid HOD ID or user is not an HOD' });
    }

    const hodInboxEntry = await HodInbox.findOne({ eventId, hodId });
    if (!hodInboxEntry) {
      return res.status(404).json({ message: 'Event not found in HOD inbox' });
    }

    const event = await CombinedObjects.findOne({ eventId });
    if (!event) {
      return res.status(404).json({ message: 'Event not found in combined_object' });
    }
    event.hodApprovalStatus = 'Approved';
    await event.save();

    const principal = await User.findOne({ role: 'Principal' });
    if (!principal) {
      return res.status(404).json({ message: 'No Principal found' });
    }

    const existingPrincipalEntry = await PrincipalInbox.findOne({ eventId });
    if (existingPrincipalEntry) {
      return res.status(400).json({ message: 'Event already forwarded to Principal inbox' });
    }

    const principalInboxEntry = new PrincipalInbox({
      principalId: principal._id,
      eventId,
      department: hodInboxEntry.department,
      eventDetails: hodInboxEntry.eventDetails
    });
    await principalInboxEntry.save();

    res.status(200).json({
      message: 'Event approved by HOD and forwarded to Principal inbox',
      principalId: principal._id,
      hodApprovalStatus: event.hodApprovalStatus,
      principalApprovalStatus: event.principalApprovalStatus
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error approving event', error: err.message });
  }
};

const mergeFinalEventInfo = async (req, res) => {
  try {
    const { eventId } = req.body;

    const eventInfo = await EventInfo.findOne({ eventId });
    const infraAndTech = await InfraAndTech.findOne({ eventId });

   const arrangements = await EventArrangement.find({ eventId });

    // Flatten arrays across all matching documents
    const meals = arrangements.flatMap(a => a.meals || []);
    const refreshments = arrangements.flatMap(a => a.refreshments || []);
    const travels = arrangements.flatMap(a => a.travels || []);
    const agenda = await Agenda.find({ eventId });
    console.log('Agenda:', agenda); // Debugging line to check agenda data
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
      res.status(200).json(finalInfo);
    }

//     const hod = await User.findOne({ department: eventInfo.department, role: 'HOD' });
//     if (!hod) {
//       return res.status(404).json({ message: `No HOD found for department: ${eventInfo.department}` });
//     }

//     const existingEntry = await HodInbox.findOne({ hodId: hod._id, eventId });
//     if (!existingEntry) {
//       const hodInboxEntry = new HodInbox({
//         hodId: hod._id,
//         eventId,
//         department: eventInfo.department,
//         eventDetails: mergedData
//       });
//       await hodInboxEntry.save();
//     }

//     res.status(201).json({
//       message: existingEntry
//         ? 'Event updated in combined_objects, already forwarded to HOD inbox'
//         : 'Final event info created and forwarded to HOD inbox',
//       data: finalInfo,
//       hodId: hod._id
//     });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error merging event info', error: err.message });
  }
 };


const forwardAllEventsToHod = async (req, res) => {
  try {
    const events = await CombinedObjects.find();
    if (!events || events.length === 0) {
      return res.status(404).json({ message: 'No events found in combined_objects' });
    }

    let forwardedCount = 0;
    const errors = [];

    for (const event of events) {
      const { eventId, department, eventInfo, infraAndTech, foodAndTravel, agenda, checklist, financialPlanning } = event;

      if (!department) {
        errors.push({ eventId, message: 'Department not specified for this event' });
        continue;
      }

      const hod = await User.findOne({ department, role: 'HOD' });
      if (!hod) {
        errors.push({ eventId, message: `No HOD found for department: ${department}` });
        continue;
      }

      const existingEntry = await HodInbox.findOne({ hodId: hod._id, eventId });
      if (existingEntry) {
        errors.push({ eventId, message: 'Event already forwarded to this HOD' });
        continue;
      }

      const eventDetails = {
        eventId,
        eventInfo,
        infraAndTech,
        foodAndTravel,
        agenda,
        checklist,
        financialPlanning,
        department
      };

      const hodInboxEntry = new HodInbox({
        hodId: hod._id,
        eventId,
        department,
        eventDetails
      });
      await hodInboxEntry.save();

      await CombinedObjects.updateOne(
        { eventId },
        { $set: { hodApprovalStatus: 'Pending' } }
      );

      forwardedCount++;
    }

    res.status(200).json({
      message: `Successfully forwarded ${forwardedCount} event(s) to HOD inbox`,
      forwardedCount,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error forwarding events to HOD inbox', error: err.message });
  }
};

module.exports = { approveEventByCso, approveEventByPrincipal, approveEventByHod, mergeFinalEventInfo, forwardAllEventsToHod };