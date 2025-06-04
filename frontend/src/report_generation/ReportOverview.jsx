// src/pages/report_generation/ReportOverview.jsx
import React from 'react';
import './report.css';
import { FaFilePdf, FaFileExcel } from 'react-icons/fa';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

const ReportOverview = () => {
  const data = [
    { label: 'Total Events Created', value: 12 },
    { label: 'Total Budget Spent', value: '₹2,40,000' },
    { label: 'Total Participants', value: 820 },
  ];

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('Report Overview', 14, 22);

    const tableColumn = ['Metric', 'Value'];
    const tableRows = data.map(item => [item.label, item.value]);

    doc.autoTable({
      startY: 30,
      head: [tableColumn],
      body: tableRows,
      theme: 'grid',
      headStyles: { fillColor: '#2980b9' },
    });

    doc.save('report_overview.pdf');
  };

  const downloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Report Overview');
    XLSX.writeFile(wb, 'report_overview.xlsx');
  };

  return (
    <div className="report-container">
      <div className="report-header">
        <h2>Report Overview</h2>
        <div className="report-buttons">
          <button onClick={downloadPDF}>
            <FaFilePdf /> Download PDF
          </button>
          <button onClick={downloadExcel}>
            <FaFileExcel /> Download Excel
          </button>
        </div>
      </div>
      <p>This section provides a high-level overview of all events, finances, and logistics.</p>
      <ul className="overview-list">
        {data.map(({ label, value }) => (
          <li key={label}>
            <strong>{label}:</strong> {value}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReportOverview;
