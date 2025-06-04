// src/pages/report_generation/DailyReport.jsx
import React from 'react';
import './report.css';
import { FaFilePdf, FaFileExcel } from 'react-icons/fa';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

const dailyData = [
  { date: '2025-06-01', event: 'Tech Summit', expenses: '₹40,000', participants: 250 },
  { date: '2025-06-02', event: 'AI Workshop', expenses: '₹15,000', participants: 120 },
];

const DailyReport = () => {
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('Daily Report', 14, 22);

    const tableColumn = ['Date', 'Event', 'Expenses', 'Participants'];
    const tableRows = dailyData.map(item => [
      item.date,
      item.event,
      item.expenses,
      item.participants,
    ]);

    doc.autoTable({
      startY: 30,
      head: [tableColumn],
      body: tableRows,
      theme: 'striped',
      headStyles: { fillColor: '#2980b9' },
    });

    doc.save('daily_report.pdf');
  };

  const downloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet(dailyData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Daily Report');
    XLSX.writeFile(wb, 'daily_report.xlsx');
  };

  return (
    <div className="report-container">
      <div className="report-header">
        <h2>Daily Report</h2>
        <div className="report-buttons">
          <button onClick={downloadPDF}>
            <FaFilePdf /> Download PDF
          </button>
          <button onClick={downloadExcel}>
            <FaFileExcel /> Download Excel
          </button>
        </div>
      </div>
      <p>Daily breakdown of event activities and expenses.</p>
      <table className="report-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Event</th>
            <th>Expenses</th>
            <th>Participants</th>
          </tr>
        </thead>
        <tbody>
          {dailyData.map(({ date, event, expenses, participants }) => (
            <tr key={date + event}>
              <td>{date}</td>
              <td>{event}</td>
              <td>{expenses}</td>
              <td>{participants}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DailyReport;
