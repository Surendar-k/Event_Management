import React, { useState, useEffect } from "react";
import axios from "axios";
import "./FilterEvents.css";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";

const FilterEvents = () => {
  const data = [
    { label: "Event Period : select Dates from – To", children: [] },
    { label: "Select All", children: [] },
    { label: "Clear All", children: [] },
    {
      label: "Organizing Institution",
      children: [
        "SSEI",
        "Engg & Tech",
        "Pharmacy",
        "AHS",
        "Aakam",
        "Nursing",
        "HI",
        "Others",
      ],
    },
    {
      label: "Organizing Department",
      children: ["CSE", "IT", "AI&DS", "Cyber", "Mech", "Agri", "SNH"],
    },
    {
      label: "Nature of the Event",
      children: [
        "Seminar",
        "Workshop",
        "Guest Lecture",
        "Conference",
        "Symposium",
        "FDP",
        "Others",
      ],
    },
    {
      label: "Scope of the Event",
      children: [
        "Department",
        "Institution",
        "State",
        "Regional",
        "National",
        "International",
      ],
    },
    { label: "Funding Source", children: ["Management", "Funding Agency"] },
    { label: "Title of the Event", children: [] },
    { label: "Objectives of the Event", children: [] },
    { label: "Outcomes of the Event", children: [] },
    { label: "Number of Days", children: [] },
    { label: "Lead Coordinator (Faculty ID)", children: [] },
    { label: "Resource Person", children: [] },
    { label: "Event Status", children: [] },
  ];

  const [selected, setSelected] = useState({});
  const [expanded, setExpanded] = useState({});
  const [childSelected, setChildSelected] = useState({});
  const [inputValues, setInputValues] = useState({});
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch events from backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:1045/event/get-final-events"); 
        setEvents(response.data);
        setFilteredEvents(response.data);
      } catch (err) {
        setError("Failed to load events. Please try again later.");
        console.error("Error fetching events:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Apply filters when filter criteria change
  useEffect(() => {
    applyFilters();
  }, [selected, childSelected, inputValues, dateRange, events]);

  const applyFilters = () => {
    if (events.length === 0) return;

    // Check if any filters are active
    const hasActiveFilters =
      Object.values(selected).some((val) => val) ||
      Object.values(childSelected).some((val) => val) ||
      Object.values(inputValues).some((val) => val) ||
      dateRange.from ||
      dateRange.to;

    // If no filters are active, show all events
    if (!hasActiveFilters) {
      setFilteredEvents(events);
      return;
    }

    const filtered = events.filter((event) => {
      const eventDate = event.eventInfo.eventStartDate
        ? new Date(event.eventInfo.eventStartDate)
        : null;
      const from = dateRange.from ? new Date(dateRange.from) : null;
      const to = dateRange.to ? new Date(dateRange.to) : null;

      const inDateRange =
        !selected["Event Period : select Dates from – To"] ||
        ((!from || (eventDate && eventDate >= from)) &&
          (!to || (eventDate && eventDate <= to)));

      const institutionFilter = selected["Organizing Institution"]
        ? event.eventInfo.eventOrganizingInstitution &&
          data
            .find((d) => d.label === "Organizing Institution")
            ?.children.some(
              (child) =>
                childSelected[`Organizing Institution-${child}`] &&
                event.eventInfo.eventOrganizingInstitution.includes(child)
            )
        : true;

      const departmentFilter = selected["Organizing Department"]
        ? event.eventInfo.department &&
          data
            .find((d) => d.label === "Organizing Department")
            ?.children.some(
              (child) =>
                childSelected[`Organizing Department-${child}`] &&
                event.eventInfo.department.includes(child)
            )
        : true;

      const natureFilter = selected["Nature of the Event"]
        ? event.eventInfo.eventNature &&
          data
            .find((d) => d.label === "Nature of the Event")
            ?.children.some(
              (child) =>
                childSelected[`Nature of the Event-${child}`] &&
                event.eventInfo.eventNature.includes(child)
            )
        : true;

      const scopeFilter = selected["Scope of the Event"]
        ? event.eventInfo.eventScope &&
          data
            .find((d) => d.label === "Scope of the Event")
            ?.children.some(
              (child) =>
                childSelected[`Scope of the Event-${child}`] &&
                event.eventInfo.eventScope.includes(child)
            )
        : true;

      const fundingFilter = selected["Funding Source"]
        ? event.eventInfo.fundingSource &&
          data
            .find((d) => d.label === "Funding Source")
            ?.children.some(
              (child) =>
                childSelected[`Funding Source-${child}`] &&
                event.eventInfo.fundingSource.includes(child)
            )
        : true;

      const titleFilter = inputValues["Title of the Event"]
        ? event.eventInfo.title
            ?.toLowerCase()
            .includes(inputValues["Title of the Event"].toLowerCase())
        : true;

      const facultyFilter = inputValues["Lead Coordinator (Faculty ID)"]
        ? event.eventInfo.leadCoOrdinator
            ?.toLowerCase()
            .includes(
              inputValues["Lead Coordinator (Faculty ID)"].toLowerCase()
            )
        : true;

      const resourcePersonFilter = inputValues["Resource Person"]
        ? event.eventInfo.name_Of_The_Speaker
            ?.toLowerCase()
            .includes(inputValues["Resource Person"].toLowerCase())
        : true;

      const daysFilter = inputValues["Number of Days"]
        ? event.eventInfo.totalDays
            ?.toString()
            .includes(inputValues["Number of Days"])
        : true;

      return (
        inDateRange &&
        institutionFilter &&
        departmentFilter &&
        natureFilter &&
        scopeFilter &&
        fundingFilter &&
        titleFilter &&
        facultyFilter &&
        resourcePersonFilter &&
        daysFilter
      );
    });

    setFilteredEvents(filtered);
  };

  // Rest of the functions remain the same (toggleCheckbox, toggleExpand, toggleChild, handleInputChange, handleDateChange)
  // ... (keep all your existing functions unchanged)

  const toggleCheckbox = (label) => {
    if (label === "Select All") {
      const allSelected = {};
      const allChildSelected = {};
      const allExpanded = {};
      data.forEach((item) => {
        allSelected[item.label] = true;
        allExpanded[item.label] = true;
        item.children?.forEach((child) => {
          allChildSelected[`${item.label}-${child}`] = true;
        });
      });
      setSelected(allSelected);
      setExpanded(allExpanded);
      setChildSelected(allChildSelected);
    } else if (label === "Clear All") {
      setSelected({});
      setExpanded({});
      setChildSelected({});
      setInputValues({});
      setDateRange({ from: "", to: "" });
      setFilteredEvents(events); // Reset to all events
    } else {
      setSelected((prev) => {
        const newSelected = {
          ...prev,
          [label]: !prev[label],
          ["Select All"]: false,
        };

        const item = data.find((d) => d.label === label);

        setExpanded((prevExpanded) => ({
          ...prevExpanded,
          [label]: !prev[label],
        }));

        if (item?.children?.length > 0) {
          const newChildSelected = { ...childSelected };
          item.children.forEach((child) => {
            const key = `${label}-${child}`;
            newChildSelected[key] = !prev[label];
          });
          setChildSelected(newChildSelected);
        }

        return newSelected;
      });
    }
  };

  const toggleExpand = (label) => {
    setExpanded((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const toggleChild = (parentLabel, childLabel) => {
    const key = `${parentLabel}-${childLabel}`;
    setChildSelected((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleInputChange = (label, value) => {
    setInputValues((prev) => ({
      ...prev,
      [label]: value,
    }));
  };

  const handleDateChange = (type, value) => {
    setDateRange((prev) => ({
      ...prev,
      [type]: value,
    }));
  };


  const downloadFilteredPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);

    doc.setFontSize(16);
    doc.setTextColor(40);
    doc.text("Filtered Events Report", 105, 15, { align: "center" });

    doc.setFontSize(12);
    doc.text("Filtered Events", 14, 25);
    doc.line(14, 26, 50, 26);
    let y = 32;

    filteredEvents.forEach((event, index) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.setFontSize(14);
      doc.setTextColor(0, 102, 204);
      doc.text(`Event ${index + 1}`, 14, y);
      y += 8;

      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);

      const fields = [
        { label: "Event ID", value: event.eventId },
        {
          label: "Organizing Institution",
          value: event.eventInfo.eventOrganizingInstitution || "N/A",
        },
        { label: "Department", value: event.eventInfo.department || "N/A" },
        {
          label: "Nature of Event",
          value: event.eventInfo.eventNature || "N/A",
        },
        { label: "Scope", value: event.eventInfo.eventScope || "N/A" },
        {
          label: "Funding Source",
          value: event.eventInfo.fundingSource || "N/A",
        },
        {
          label: "Lead Coordinator",
          value: event.eventInfo.leadCoOrdinator || "N/A",
        },
        {
          label: "Resource Person",
          value: event.eventInfo.name_Of_The_Speaker || "N/A",
        },
        { label: "Title", value: event.eventInfo.title || "N/A" },
        { label: "Number of Days", value: event.eventInfo.totalDays || "N/A" },
      ];

      fields.forEach((field) => {
        doc.text(`${field.label}: `, 14, y);
        doc.text(field.value, 60, y);
        y += 7;
      });

      y += 8;
    });

    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(150);
      doc.text(`Page ${i} of ${pageCount}`, 105, 285, { align: "center" });
      doc.text(new Date().toLocaleDateString(), 195, 285, { align: "right" });
    }

    doc.save("filtered_events_report.pdf");
  };

  const exportFilteredToExcel = () => {
    const workbook = XLSX.utils.book_new();
    const eventsData = filteredEvents.map((event) => ({
      "Event ID": event.eventId,
      "Organizing Institution":
        event.eventInfo.eventOrganizingInstitution || "N/A",
      Department: event.eventInfo.department || "N/A",
      "Nature of Event": event.eventInfo.eventNature || "N/A",
      Scope: event.eventInfo.eventScope || "N/A",
      "Funding Source": event.eventInfo.fundingSource || "N/A",
      "Lead Coordinator": event.eventInfo.leadCoOrdinator || "N/A",
      "Resource Person": event.eventInfo.name_Of_The_Speaker || "N/A",
      Title: event.eventInfo.title || "N/A",
      "Number of Days": event.eventInfo.totalDays || "N/A",
    }));

    if (eventsData.length > 0) {
      const eventsSheet = XLSX.utils.json_to_sheet(eventsData);
      XLSX.utils.book_append_sheet(workbook, eventsSheet, "Filtered Events");
    }

    XLSX.writeFile(workbook, "filtered_events_report.xlsx");
  };

  const inputFields = [
    "Title of the Event",
    "Number of Days",
    "Lead Coordinator (Faculty ID)",
    "Resource Person",
  ];

  const dateField = "Event Period : select Dates from – To";

  if (loading) return <div className="loading">Loading events...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div style={{ display: "flex", gap: "30px" }}>
      <div className="filter-container">
        <h3 className="column-title">Filter Events :</h3>

        {data.map((item, idx) => (
          <div key={idx} className="checkbox-group">
            <div className="checkbox-item">
              <input
                type="checkbox"
                id={`main-${idx}`}
                checked={selected[item.label] || false}
                onChange={() => toggleCheckbox(item.label)}
              />
              <label
                id={`main-${idx}`}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                {item.label}
                {expanded[item.label] && (
                  <span
                    style={{
                      marginLeft: "80%",
                      cursor: "pointer",
                      marginTop: "-6%",
                      fontWeight: "bold",
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleExpand(item.label);
                    }}
                  >
                    ˅
                  </span>
                )}
              </label>
            </div>

            {expanded[item.label] && (
              <>
                {item.children.length > 0 && (
                  <div className="sub-options">
                    {item.children.map((child, i) => {
                      const childKey = `${item.label}-${child}`;
                      return (
                        <div key={i} className="checkbox-item sub">
                          <input
                            type="checkbox"
                            id={`sub-${idx}-${i}`}
                            checked={childSelected[childKey] || false}
                            onChange={() => toggleChild(item.label, child)}
                          />
                          <label htmlFor={`sub-${idx}-${i}`}>{child}</label>

                        </div>
                      );
                    })}
                  </div>
                )}

                {selected[item.label] && inputFields.includes(item.label) && (
                  <div className="checkbox-item vertical sub">
                    <label>Enter the {item.label.toLowerCase()}:</label>
                    <input
                      type="text"
                      value={inputValues[item.label] || ""}
                      onChange={(e) =>
                        handleInputChange(item.label, e.target.value)
                      }
                      placeholder={item.label}
                    />
                  </div>
                )}

                {selected[item.label] && item.label === dateField && (
                  <div className="checkbox-item vertical sub">
                    <label>Select Event Period:</label>
                    <div
                      style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}
                    >
                      <div>
                        <label>From:</label>
                        <input
                          type="date"
                          value={dateRange.from}
                          onChange={(e) =>
                            handleDateChange("from", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <label>To:</label>
                        <input
                          type="date"
                          value={dateRange.to}
                          onChange={(e) =>
                            handleDateChange("to", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      <div className="results-container">
        {filteredEvents.length === 0 ? (
          <p>No events match your filters. Try adjusting your criteria.</p>
        ) : (
          <div className="events-table-container">
            <div className="events-count-container">
              <div className="events-count">Showing Filtered Events</div>
              <div className="download-icons">
                <div className="math-download-container">
                  <button
                    className="math-download-btn"
                    onClick={downloadFilteredPDF}
                    title="Download as PDF"
                  >
                    <div className="download-fraction">
                      <span className="file-type">PDF</span>
                      <span className="fraction-line"></span>
                      <div className="icon-wrapper">
                        <svg className="file-icon" viewBox="0 0 24 24">
                          <path
                            fill="#e74c3c"
                            d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"
                          />
                        </svg>
                        <svg className="download-arrow" viewBox="0 0 24 24">
                          <path
                            fill="#e74c3c"
                            d="M12 16l4-4h-3V4h-2v8H8l4 4zm-7 4h14v-2H5v2z"
                          />
                        </svg>
                      </div>
                    </div>
                  </button>

                  <button
                    className="math-download-btn"
                    onClick={exportFilteredToExcel}
                    title="Download as Excel"
                  >
                    <div className="download-fraction">
                      <span className="file-type">XLS</span>
                      <span className="fraction-line"></span>
                      <div className="icon-wrapper">
                        <svg className="file-icon" viewBox="0 0 24 24">
                          <path
                            fill="#217346"
                            d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zM8 20H6v-2h2v2zm0-4H6v-2h2v2zm0-4H6v-2h2v2zm7-1h-4v-5h4v5zm3 9h-8v-2h2v-2h-2v-2h2v-2h-2v-2h8v10z"
                          />
                        </svg>
                        <svg className="download-arrow" viewBox="0 0 24 24">
                          <path
                            fill="#217346"
                            d="M12 16l4-4h-3V4h-2v8H8l4 4zm-7 4h14v-2H5v2z"
                          />
                        </svg>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {filteredEvents.map((event, eventIndex) => (
              <div key={eventIndex} className="event-summary form-style">
                <div className="summary-header">
                  &lt;&lt; Shri Shanmuga college of engineering and technology &gt;&gt;
                </div>

                {selected["Organizing Institution"] && (
                  <div className="info-line">
                    <div className="label">Organizing Institution</div>
                    <span className="colon">:</span>
                    <span>{event.eventInfo.eventOrganizingInstitution}</span>
                  </div>
                )}

                {selected["Organizing Department"] && (
                  <div className="info-line">
                    <div className="label">Department</div>
                    <span className="colon">:</span>
                    <span>{event.eventInfo.department}</span>
                  </div>
                )}

                {selected["Nature of the Event"] && (
                  <div className="info-line">
                    <div className="label">Nature of the Event</div>
                    <span className="colon">:</span>
                    <span>{event.eventInfo.eventNature}</span>
                  </div>
                )}

                {selected["Scope of the Event"] && (
                  <div className="info-line">
                    <div className="label">Scope</div>
                    <span className="colon">:</span>
                    <span>{event.eventInfo.eventScope}</span>
                  </div>
                )}

                {selected["Funding Source"] && (
                  <div className="info-line">
                    <div className="label">Funding</div>
                    <span className="colon">:</span>
                    <span>{event.eventInfo.fundingSource}</span>
                  </div>
                )}

                {selected["Lead Coordinator (Faculty ID)"] && (
                  <div className="info-line">
                    <div className="label">Lead Coordinator</div>
                    <span className="colon">:</span>
                    <span>{event.eventInfo.leadCoOrdinator}</span>
                  </div>
                )}

                {selected["Resource Person"] && (
                  <div className="info-line">
                    <div className="label">Resource Person</div>
                    <span className="colon">:</span>
                    <span>{event.eventInfo.name_Of_The_Speaker}</span>
                  </div>
                )}

                {selected["Title of the Event"] && (
                  <div className="info-line">
                    <div className="label">Title</div>
                    <span className="colon">:</span>
                    <span>{event.eventInfo.title}</span>
                  </div>
                )}

                {selected["Number of Days"] && (
                  <div className="info-line">
                    <div className="label">No. of Days</div>
                    <span className="colon">:</span>
                    <span>{event.eventInfo.totalDays}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <style>{`
        .form-style {
          border: 1px solid #2980b9;
          padding: 16px;
          border-radius: 8px;
          margin-bottom: 20px;
          background: #f4f9ff;
        }
        .form-style .info-line {
          display: flex;
          margin-bottom: 8px;
        }
        .form-style .label {
          width: 180px;
          font-weight: 600;
          color: #2c3e50;
        }
        .form-style .colon {
          margin: 0 10px;
          font-weight: 600;
          color: #2980b9;
        }
        .form-style span {
          flex: 1;
          color: #34495e;
        }
        .loading {
          padding: 20px;
          text-align: center;
          color: #3498db;
          font-size: 18px;
        }
        .error {
          padding: 20px;
          text-align: center;
          color: #e74c3c;
          font-size: 18px;
        }
      `}</style>
    </div>
  );
};

export default FilterEvents;