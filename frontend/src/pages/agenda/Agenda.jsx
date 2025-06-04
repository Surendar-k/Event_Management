import React, { useState, useEffect } from "react";
import "../agenda/agenda.css";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const Agenda = () => {
  const [objectives, setObjectives] = useState("");
  const [outcomes, setOutcomes] = useState("");
  const [brochure, setBrochure] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [newSession, setNewSession] = useState({
    date: "",
    time: { from: "", to: "" },
    topic: "",
    speaker: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [eventDates, setEventDates] = useState({ startDate: "", endDate: "" });

  // Fetch event dates from localStorage on mount
  useEffect(() => {
    const startDate = localStorage.getItem("eventStartDate");
    const endDate = localStorage.getItem("eventEndDate");

    if (startDate && endDate) {
      setEventDates({ startDate, endDate });
    } else {
      console.log("Event start/end dates not found in localStorage");
    }
  }, []);

  const handleBrochureUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 2 * 1024 * 1024 && file.type === "application/pdf") {
      setBrochure(file);
    } else {
      alert("Please upload a PDF file under 2MB.");
      e.target.value = null; // reset file input
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { date, time, topic, speaker } = newSession;

    // Validate session date inside event date range
    if (eventDates.startDate && eventDates.endDate) {
      const sessionDate = new Date(date);
      const startDate = new Date(eventDates.startDate);
      const endDate = new Date(eventDates.endDate);

      if (sessionDate < startDate || sessionDate > endDate) {
        alert(`Session date must be between ${eventDates.startDate} and ${eventDates.endDate}`);
        return;
      }
    }

    // Validate all fields filled
    if (date && time.from && time.to && topic && speaker) {
      if (editingId !== null) {
        const updatedSessions = sessions.map((session) =>
          session._id === editingId ? { ...newSession, _id: editingId } : session
        );
        setSessions(updatedSessions);
        setEditingId(null);
      } else {
        const newId = uuidv4();
        setSessions([...sessions, { ...newSession, _id: newId }]);
      }

      setNewSession({
        date: "",
        time: { from: "", to: "" },
        topic: "",
        speaker: "",
      });
    } else {
      alert("Please fill all fields.");
    }
  };

  const handleDelete = (_id) => {
    if (window.confirm("Are you sure you want to delete this session?")) {
      setSessions(sessions.filter((session) => session._id !== _id));
    }
  };

  const handleEdit = (_id) => {
    const sessionToEdit = sessions.find((session) => session._id === _id);
    if (sessionToEdit) {
      setNewSession({ ...sessionToEdit });
      setEditingId(_id);
    }
  };

  const formatTimeWithPeriod = (time) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    const period = +hours >= 12 ? "PM" : "AM";
    const adjustedHours = +hours % 12 || 12;
    return `${adjustedHours}:${minutes} ${period}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const postAgendaData = async () => {
    if (!objectives.trim() || !outcomes.trim()) {
      alert("Objectives and Outcomes cannot be empty.");
      return;
    }
    if (sessions.length === 0) {
      alert("Please add at least one session before submitting.");
      return;
    }

    const storedData = JSON.parse(localStorage.getItem("userData"));
    const userId = storedData?.user?._id;

    if (!userId) {
      alert("User ID not found in local storage");
      return;
    }

    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("objectives", objectives);
    formData.append("outcomes", outcomes);
    if (brochure) formData.append("brochure", brochure);

    // Map sessions to backend expected format
    const formattedSessions = sessions.map((s) => ({
      date: s.date,
      sessionTitleTopic: s.topic,
      speaker: s.speaker,
      fromTime: s.time.from,
      toTime: s.time.to,
    }));

    formData.append("sessions", JSON.stringify(formattedSessions));

    try {
      const response = await axios.post("http://localhost:1045/event/agenda", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Agenda submitted successfully!");
      console.log("Response:", response.data);
      // Optionally clear form and sessions
      setObjectives("");
      setOutcomes("");
      setBrochure(null);
      setSessions([]);
    } catch (error) {
      alert("Failed to submit agenda. Please try again.");
      
     console.error("Backend error:", JSON.stringify(error.response?.data, null, 2) || error.message);

    }
  };

  // Disable submit if any mandatory field is empty or no sessions
  const isSubmitDisabled = !objectives.trim() || !outcomes.trim() || sessions.length === 0;

  return (
    <div className="agenda-container">
      <label>Objectives of the Event (max 200 words):</label>
      <div className="form-group">
        <textarea
          value={objectives}
          onChange={(e) => setObjectives(e.target.value)}
          maxLength={200}
          placeholder="Enter objectives..."
          className="textarea"
        />
      </div>

      <label>Outcomes of the Event (max 200 words):</label>
      <div className="form-group">
        <textarea
          value={outcomes}
          onChange={(e) => setOutcomes(e.target.value)}
          maxLength={200}
          placeholder="Enter outcomes..."
          className="textarea"
        />
      </div>

      <label>Proposed Event - Brochure / Poster (PDF, max 2MB):</label>
      <div className="form-group inline-label choosefile">
        <input
          type="file"
          accept="application/pdf"
          onChange={handleBrochureUpload}
        />
        {brochure && (
          <button
            className="view-btn"
            onClick={() => window.open(URL.createObjectURL(brochure), "_blank")}
          >
            View
          </button>
        )}
      </div>

      <div className="session-details">
        <h3>Technical Session Details:</h3>

        {eventDates.startDate && eventDates.endDate && (
          <div className="event-dates-display">
            <p>
              <strong>Event Dates:</strong> {formatDate(eventDates.startDate)} to {formatDate(eventDates.endDate)}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="date"
              value={newSession.date}
              onChange={(e) => setNewSession({ ...newSession, date: e.target.value })}
              min={eventDates.startDate}
              max={eventDates.endDate}
              required
            />
            <div className="time-inputs">
              <input
                type="time"
                value={newSession.time.from}
                onChange={(e) =>
                  setNewSession({
                    ...newSession,
                    time: { ...newSession.time, from: e.target.value },
                  })
                }
                required
              />
              <span>to</span>
              <input
                type="time"
                value={newSession.time.to}
                onChange={(e) =>
                  setNewSession({
                    ...newSession,
                    time: { ...newSession.time, to: e.target.value },
                  })
                }
                required
              />
            </div>
            <input
              value={newSession.topic}
              onChange={(e) => setNewSession({ ...newSession, topic: e.target.value })}
              placeholder="Topic"
              required
            />
            <input
              value={newSession.speaker}
              onChange={(e) => setNewSession({ ...newSession, speaker: e.target.value })}
              placeholder="Speaker"
              className="speaker"
              required
            />
            <button type="submit" className="view-btn eighth-btn save">
              {editingId ? "Save Edit" : "Add Session"}
            </button>
          </div>
        </form>

        {sessions.length > 0 && (
          <table className="session-table">
            <thead>
              <tr>
                <th>S.No.</th>
                <th>Date</th>
                <th>Time Slot</th>
                <th>Session Title / Topic</th>
                <th>Name of the Speaker</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((session, index) => (
                <tr key={session._id}>
                  <td>{index + 1}</td>
                  <td>{formatDate(session.date)}</td>
                  <td>
                    {session.time.from && session.time.to
                      ? `${formatTimeWithPeriod(session.time.from)} to ${formatTimeWithPeriod(session.time.to)}`
                      : ""}
                  </td>
                  <td>{session.topic}</td>
                  <td>{session.speaker}</td>
                  <td>
                    <button className="view-btn edit-btn" onClick={() => handleEdit(session._id)}>
                      Edit
                    </button>
                    <button className="view-btn delete-btn" onClick={() => handleDelete(session._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <button
          className="view-btn submit-btn"
          onClick={postAgendaData}
          disabled={isSubmitDisabled}
          title={isSubmitDisabled ? "Fill all required fields and add sessions to enable submit" : ""}
        >
          Submit Agenda
        </button>
      </div>
    </div>
  );
};

export default Agenda;
