import { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import './Inbox.css';

const eventList = [
  {
    id: 1,
    title: 'Tech Summit 2025',
    eventOrganizingInstitution: 'Engineering & Technology',
    department: 'CSE',
    eventStartDate: '2025-07-01',
    eventEndDate: '2025-07-02',
    eventNature: 'Seminar',
    venueType: 'Offline',
    eventScope: 'National',
    fundingSource: 'Management',
    eventStartTime: '10:00',
    eventEndTime: '15:00',
    venue: 'Auditorium',
    intendedAudience: 'Both',
    leadCoOrdinator: 'Dr. Alice',
    facultyCoOrdinator: 'Prof. Bob',
    name_Of_The_Speaker: 'Mr. John Doe',
    designation: 'CTO',
    affiliated_Organization: 'Tech Corp',
    contactNumber: '1234567890',
    email: 'john@techcorp.com',
    estimated_Student_Participation: '150',
    estimated_Faculty_Participation: '30',
    total_Expected_Attendence: '180',
    guest_Accomodation: 'Yes',
    guest_Transportation: 'No',
    guest_Food: 'Yes'
  },
  {
    id: 2,
    title: 'Innovation Fest',
    eventOrganizingInstitution: 'SSEI',
    department: 'AI & DS',
    eventStartDate: '2026-08-15',
    eventEndDate: '2026-08-16',
    eventNature: 'Conference',
    venueType: 'Online',
    eventScope: 'International',
    fundingSource: 'Sponsorship',
    eventStartTime: '09:00',
    eventEndTime: '17:00',
    venue: 'Zoom',
    intendedAudience: 'Faculty',
    leadCoOrdinator: 'Dr. Eva',
    facultyCoOrdinator: 'Prof. Max',
    name_Of_The_Speaker: 'Dr. Alan Turing',
    designation: 'AI Researcher',
    affiliated_Organization: 'DeepMind',
    contactNumber: '9876543210',
    email: 'alan@deepmind.com',
    estimated_Student_Participation: '200',
    estimated_Faculty_Participation: '50',
    total_Expected_Attendence: '250',
    guest_Accomodation: 'No',
    guest_Transportation: 'No',
    guest_Food: 'No'
  },
  {
    id: 3,
    title: 'Med Festa',
    eventOrganizingInstitution: 'Nurseing',
    department: 'IT',
    eventStartDate: '2025-12-01',
    eventEndDate: '2025-12-02',
    eventNature: 'Workshop',
    venueType: 'Offline',
    eventScope: 'Regional',
    fundingSource: 'Government',
    eventStartTime: '10:00',
    eventEndTime: '16:00',
    venue: 'Lab 3',
    intendedAudience: 'Students',
    leadCoOrdinator: 'Dr. Smith',
    facultyCoOrdinator: 'Prof. Diana',
    name_Of_The_Speaker: 'Ms. Jane Roe',
    designation: 'Security Engineer',
    affiliated_Organization: 'CyberSafe',
    contactNumber: '1122334455',
    email: 'jane@cybersafe.com',
    estimated_Student_Participation: '100',
    estimated_Faculty_Participation: '10',
    total_Expected_Attendence: '110',
    guest_Accomodation: 'Yes',
    guest_Transportation: 'Yes',
    guest_Food: 'Yes'
  },
  
];

export default function Inbox() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [approvedEvents, setApprovedEvents] = useState(new Set());

  const handleApprove = (e, id) => {
    e.stopPropagation();
    setApprovedEvents(prev => new Set(prev).add(id));
    alert('✅ Event Approved!');
  };

  // Generate PDF for selected event
  const generatePDF = () => {
    if (!selectedEvent) return;
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text(selectedEvent.title, 14, 22);

    const tableColumn = ["Field", "Value"];
    const tableRows = [];

    Object.entries(selectedEvent).forEach(([key, value]) => {
      const formattedKey = key
        .replace(/([A-Z])/g, ' $1')
        .replace(/_/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase());
      tableRows.push([formattedKey, String(value)]);
    });

    autoTable(doc, {
      startY: 30,
      head: [tableColumn],
      body: tableRows,
      theme: 'grid',
      styles: { fontSize: 10 },
      headStyles: { fillColor: [22, 160, 133] },
    });

    doc.save(`${selectedEvent.title.replace(/\s+/g, '_')}.pdf`);
  };

  // Generate Excel for selected event
  const generateExcel = () => {
    if (!selectedEvent) return;

    // Create worksheet data from event object
    const wsData = [["Field", "Value"]];
    Object.entries(selectedEvent).forEach(([key, value]) => {
      const formattedKey = key
        .replace(/([A-Z])/g, ' $1')
        .replace(/_/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase());
      wsData.push([formattedKey, value]);
    });

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Event Details");

    XLSX.writeFile(wb, `${selectedEvent.title.replace(/\s+/g, '_')}.xlsx`);
  };

  return (
    <>
      <h1 className="page-title">📩 Inbox - Event Submissions</h1>
      <div className="inbox-container">
        {eventList.map(event => {
          const isApproved = approvedEvents.has(event.id);

          return (
            <div
              key={event.id}
              className="card"
              onClick={() => setSelectedEvent(event)}
            >
              <div className="card-title">{event.title}</div>
              <div className="card-row">Institution: {event.eventOrganizingInstitution}</div>
              <div className="card-row">Department: {event.department}</div>
              <div className="card-row">Date: {event.eventStartDate} to {event.eventEndDate}</div>
              <div className="card-row">Type: {event.eventNature}</div>
              <div className="card-buttons">
                <button
                  className={`btn-approve ${isApproved ? 'disabled' : ''}`}
                  onClick={(e) => !isApproved && handleApprove(e, event.id)}
                  disabled={isApproved}
                >
                  {isApproved ? 'Approved' : 'Approve'}
                </button>
                <button
                  className="btn-review"
                  onClick={(e) => {
                    e.stopPropagation();
                    const msg = prompt('Enter your review message:');
                    if (msg) alert(`📨 Review sent: ${msg}`);
                  }}
                >
                  Review
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {selectedEvent && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-btn" onClick={() => setSelectedEvent(null)}>&times;</span>
            <h2>📋 Event Details</h2>

            <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
              <button className="btn-export" onClick={generatePDF}>Download PDF</button>
              <button className="btn-export" onClick={generateExcel}>Download Excel</button>
            </div>

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
    </>
  );
}
