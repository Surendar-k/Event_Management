// src/pages/report_generation/DailyReport.jsx
import React from 'react';
import './report.css';
import { FaFilePdf, FaFileExcel } from 'react-icons/fa';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

const dailyData = [
  {
    date: '2025-06-01',
    event: 'Tech Summit 2025',
    expenses: '₹40,000',
    participants: 2,
    organizerName: 'John Smith',
    organizerCollege: 'Engineering & Technology',
    organizerContact: 'contact@abccollege.edu',
  },
  {
    date: '2025-06-02',
    event: 'Innovation Fest',
    expenses: '₹15,000',
    participants: 1,
    organizerName: 'Jane Doe',
    organizerCollege: 'SSEI',
    organizerContact: 'info@xyzcollege.edu',
  },
];

const Report = () => {
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('Daily Report', 14, 22);

    const tableColumn = ['Date', 'Event', 'Organizer Name', 'Organizer College', 'Contact', 'Expenses', 'Participants'];
    const tableRows = dailyData.map(item => [
      item.date,
      item.event,
      item.organizerName,
      item.organizerCollege,
      item.organizerContact,
      item.expenses,
      item.participants,
    ]);

    autoTable(doc, {
      startY: 30,
      head: [tableColumn],
      body: tableRows,
      theme: 'striped',
      headStyles: { fillColor: '#2980b9' },
    });

    doc.save('daily_report.pdf');
  };

  const downloadExcel = () => {
    const dataForExcel = dailyData.map(
      ({ date, event, organizerName, organizerCollege, organizerContact, expenses, participants }) => ({
        Date: date,
        Event: event,
        'Organizer Name': organizerName,
        'Organizer College': organizerCollege,
        Contact: organizerContact,
        Expenses: expenses,
        Participants: participants,
      })
    );

    const ws = XLSX.utils.json_to_sheet(dataForExcel);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Daily Report');
    XLSX.writeFile(wb, 'daily_report.xlsx');
  };

  return (
    <div className="report-container">
      <div className="report-header">
        <h2>Events Report</h2>
        <div className="report-buttons">
          <button onClick={downloadPDF}>
            <FaFilePdf /> Download PDF
          </button>
          <button onClick={downloadExcel}>
            <FaFileExcel /> Download Excel
          </button>
        </div>
      </div>
      <p>Daily breakdown of event activities, organizers, and expenses.</p>
      <table className="report-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Event</th>
            <th>Organizer Name</th>
            <th>Organizer College</th>
            <th>Contact</th>
            <th>Expenses</th>
            <th>Participants</th>
          </tr>
        </thead>
        <tbody>
          {dailyData.map(
            ({ date, event, organizerName, organizerCollege, organizerContact, expenses, participants }) => (
              <tr key={date + event}>
                <td>{date}</td>
                <td>{event}</td>
                <td>{organizerName}</td>
                <td>{organizerCollege}</td>
                <td>{organizerContact}</td>
                <td>{expenses}</td>
                <td>{participants}</td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Report;
