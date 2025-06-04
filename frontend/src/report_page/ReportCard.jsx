import React, { useState } from "react";
import ReportCard from "./ReportCard";
import reportData from "./reportData";
import "./report_page.css";

const ReportPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredReports = reportData.filter((report) =>
    report.eventName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="report-page-container">
      <h1 className="heading">Finalized Events Report</h1>
      <input
        type="text"
        placeholder="Search by Event Name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      <div className="report-grid">
        {filteredReports.map((report, index) => (
          <ReportCard key={index} report={report} />
        ))}
      </div>
    </div>
  );
};

export default ReportPage;
