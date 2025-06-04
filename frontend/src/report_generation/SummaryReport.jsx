// src/pages/report_generation/SummaryReport.jsx
import React from 'react';
import './report.css';
import { FaFilePdf, FaFileExcel } from 'react-icons/fa';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

const summaryData = [
  { event: 'Tech Summit', attendance: 250 },
  { event: 'Startup Panel', attendance: 180 },
  { event: 'Developer Meetup', attendance: 160 },
];

const SummaryReport = () => {
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('Summary Report', 14, 22);

    // Attendance table
    doc.setFontSize(14);
    doc.text('Top 3 Events by Attendance', 14, 32);
    const attendanceColumns = ['Event', 'Attendance'];
    const attendanceRows = summaryData.map(item => [item.event, item.attendance]);
    doc.autoTable({
      startY: 36,
      head: [attendanceColumns],
      body: attendanceRows,
      theme: 'grid',
      headStyles: { fillColor: '#2980b9' },
    });

    // Budget summary below the table
    const finalY = doc.lastAutoTable.finalY + 10 || 70;
    doc.setFontSize(14);
    doc.text('Total Budget Summary', 14, finalY);
    doc.setFontSize(12);
    doc.text('₹2,40,000 used across 5 events. Average per event: ₹48,000', 14, finalY + 8);

    doc.save('summary_report.pdf');
  };

  const downloadExcel = () => {
    const wb = XLSX.utils.book_new();

    // Attendance sheet
    const attendanceSheet = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, attendanceSheet, 'Attendance');

    // Budget summary sheet
    const budgetSummary = [
      { Metric: 'Total Budget Used', Value: '₹2,40,000' },
      { Metric: 'Events Count', Value: 5 },
      { Metric: 'Average per Event', Value: '₹48,000' },
    ];
    const budgetSheet = XLSX.utils.json_to_sheet(budgetSummary);
    XLSX.utils.book_append_sheet(wb, budgetSheet, 'Budget Summary');

    XLSX.writeFile(wb, 'summary_report.xlsx');
  };

  return (
    <div className="report-container">
      <div className="report-header">
        <h2>Summary Report</h2>
        <div className="report-buttons">
          <button onClick={downloadPDF}>
            <FaFilePdf /> Download PDF
          </button>
          <button onClick={downloadExcel}>
            <FaFileExcel /> Download Excel
          </button>
        </div>
      </div>
      <p>Summarized data of the entire event cycle with key metrics and charts (if applicable).</p>
      <div className="summary-section">
        <h4>Top 3 Events by Attendance</h4>
        <ol>
          {summaryData.map(({ event, attendance }) => (
            <li key={event}>{event} - {attendance} attendees</li>
          ))}
        </ol>
        <h4>Total Budget Summary</h4>
        <p>₹2,40,000 used across 5 events. Average per event: ₹48,000</p>
      </div>
    </div>
  );
};

export default SummaryReport;
