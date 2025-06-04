// src/pages/report_generation/ParticipantsInfo.jsx
import React from 'react';
import './participants.css';
import { FaFilePdf, FaFileExcel } from 'react-icons/fa';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // Explicit import for autoTable
import * as XLSX from 'xlsx';

const ParticipantsInfo = () => {
  const events = [
    {
      eventName: 'Tech Summit 2025',
      college: 'Engineering & Technology',
      eventDate: '2025-04-12',
      formLink: 'https://docs.google.com/forms/d/e/1FAIpQLSd5mvuazgz2kLD7BgvvuWbgFrfeXZrp-yEX3luNfNuaMSU0kA/viewform?usp=header',
      participants: [
        { name: 'John Doe', email: 'john@example.com', college: 'ABC College', phone: '9876543210' },
        { name: 'Jane Smith', email: 'jane@example.com', college: 'XYZ University', phone: '8765432109' },
      ],
    },
    {
      eventName: 'Innovation Fest',
      college: 'SSEI',
      eventDate: '2025-05-20',
      formLink: 'https://docs.google.com/forms/d/e/1FAIpQLSd5mvuazgz2kLD7BgvvuWbgFrfeXZrp-yEX3luNfNuaMSU0kA/viewform?usp=header',
      participants: [
        { name: 'Ravi Kumar', email: 'ravi@college.edu', college: 'Tech Institute', phone: '9988776655' },
        { name: 'Meena Das', email: 'meena@uni.edu', college: 'Delta University', phone: '9871234560' },
      ],
    },
    // ... other events ...
  ];

  const downloadPDF = (event) => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.text(`Participants - ${event.eventName}`, 14, 22);

    // Event Date & Organizer
    doc.setFontSize(12);
    doc.text(`Date: ${event.eventDate}`, 14, 32);
    doc.text(`Organizer: ${event.college}`, 14, 40);

    // Table columns and rows
    const tableColumn = ['Name', 'Email', 'College', 'Phone'];
    const tableRows = event.participants.map(p => [p.name, p.email, p.college, p.phone]);

    // AutoTable
    autoTable(doc, {
      startY: 50,
      head: [tableColumn],
      body: tableRows,
      theme: 'grid',
      headStyles: { fillColor: '#16a085' },
    });

    // Save PDF
    doc.save(`${event.eventName.replace(/\s+/g, '_').toLowerCase()}_participants.pdf`);
  };

  const downloadExcel = (event) => {
    const ws = XLSX.utils.json_to_sheet(event.participants);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, event.eventName);
    XLSX.writeFile(wb, `${event.eventName.replace(/\s+/g, '_').toLowerCase()}_participants.xlsx`);
  };

  return (
    <div className="participants-container">
      <div className="participants-header">
        <h2>Participants Information</h2>
      </div>

      {events.map((event, idx) => (
        <div key={idx} style={{ marginBottom: '40px' }}>
          <div className="participants-header">
            <h3>{event.eventName} - {event.college}</h3>
            <p><strong>Date:</strong> {event.eventDate}</p>
            <div className="participants-buttons">
              <button onClick={() => downloadPDF(event)} style={{ cursor: 'pointer' }}>
                <FaFilePdf /> PDF
              </button>
              <button onClick={() => downloadExcel(event)} style={{ cursor: 'pointer' }}>
                <FaFileExcel /> Excel
              </button>
            </div>
          </div>

       <p>
  Registration Link: <a href={event.formLink} target="_blank" rel="noopener noreferrer">Google Forms</a>
</p>


          <table className="participants-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>College</th>
                <th>Phone</th>
              </tr>
            </thead>
            <tbody>
              {event.participants.map((p, i) => (
                <tr key={i}>
                  <td>{p.name}</td>
                  <td>{p.email}</td>
                  <td>{p.college}</td>
                  <td>{p.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default ParticipantsInfo;
