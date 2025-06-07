// src/pages/report_generation/DraftEvents.jsx
import React, { useState } from 'react';
import './report.css';
import { FaEdit, FaTrash, FaPaperPlane } from 'react-icons/fa';

const draftEventsData = [
  {
    id: '1',
    title: 'Tech Summit 2025',
    creator: 'John Doe',
    lastEdited: '2025-07-28',
    status: 'Draft',
    institution: 'Engineering & Technology',
    department: 'CSE',
    startDate: '2025-07-01',
    endDate: '2025-07-02',
    nature: 'Seminar',
    venueType: 'Offline',
    scope: 'National',
    funding: 'Management',
    startTime: '10:00',
    endTime: '15:00',
    venue: 'Auditorium',
    audience: 'Both',
    leadCoordinator: 'Dr. Alice',
    facultyCoordinator: 'Prof. Bob',
    speakerName: 'Mr. John Doe',
    designation: 'CTO',
    org: 'Tech Corp',
    contact: '1234567890',
    email: 'john@techcorp.com',
    studentCount: 150,
    facultyCount: 30,
    totalAttendance: 180,
    accommodation: 'Yes',
    transportation: 'No',
    food: 'Yes',
  },
  {
    id: '2',
    title: 'Green Tech Fest',
    creator: 'Jane Smith',
    lastEdited: '2025-07-26',
    status: 'In Progress',
    institution: 'Green Energy Institute',
    department: 'Environmental Science',
    startDate: '2025-08-10',
    endDate: '2025-08-12',
    nature: 'Conference',
    venueType: 'Online',
    scope: 'International',
    funding: 'Government',
    startTime: '09:00',
    endTime: '17:00',
    venue: 'Virtual Platform',
    audience: 'Students',
    leadCoordinator: 'Dr. Green',
    facultyCoordinator: 'Prof. Leaf',
    speakerName: 'Ms. Flora',
    designation: 'Researcher',
    org: 'Eco Org',
    contact: '9876543210',
    email: 'flora@eco.org',
    studentCount: 200,
    facultyCount: 40,
    totalAttendance: 240,
    accommodation: 'No',
    transportation: 'No',
    food: 'No',
  },
];

const DraftEvents = () => {
  const [draftEvents, setDraftEvents] = useState(draftEventsData);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [, setShowModal] = useState(false);

  const handleEdit = (id) => {
    console.log(`Edit event with ID: ${id}`);
    // navigate('/event');  // Uncomment if using react-router to navigate
  };

  const handleGetApproval = (id) => {
    alert('Sent for approval');
    setDraftEvents(prevEvents =>
      prevEvents.map(event =>
        event.id === id ? { ...event, status: 'Approval Requested' } : event
      )
    );
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this draft?');
    if (confirmDelete) {
      setDraftEvents(prevEvents => prevEvents.filter(event => event.id !== id));
    }
  };

  const handleViewDetails = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };



  return (
    <div className="report-container">
      <div className="report-header">
        <h2>Draft Events</h2>
        <p>Events in draft stage. You can edit, request approval, view details, or remove them.</p>
      </div>
      <table className="report-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Created By</th>
            <th>Last Edited</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {draftEvents.map(event => (
            <tr key={event.id}>
              <td>{event.title}</td>
              <td>{event.creator}</td>
              <td>{event.lastEdited}</td>
              <td>
                <span className={`status-badge ${event.status.toLowerCase().replace(/\s/g, '-')}`}>
                  {event.status}
                </span>
              </td>
              <td>
                <button onClick={() => handleEdit(event.id)}><FaEdit /> Edit</button>
                <button onClick={() => handleGetApproval(event.id)}><FaPaperPlane /> Get Approval</button>
                <button onClick={() => handleViewDetails(event)}>View</button>
                <button onClick={() => handleDelete(event.id)}><FaTrash /> Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for Event Details */}
      {selectedEvent && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-btn" onClick={() => setSelectedEvent(null)}>&times;</span>
            <h2>📋 Event Details</h2>

           

            <table>
              <tbody>
                {Object.entries(selectedEvent).map(([key, value]) => (
                  <tr key={key}>
                    <td style={{ fontWeight: 'bold', paddingRight: '12px' }}>
                      {key
                        .replace(/([A-Z])/g, ' $1')
                        .replace(/_/g, ' ')
                        .replace(/\b\w/g, c => c.toUpperCase())}
                    </td>
                    <td>{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};

export default DraftEvents;
