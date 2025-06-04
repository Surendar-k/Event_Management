import React, { useEffect, useState } from "react";
import Navbar from "../../Navbar";
import EventNav from "../../EventNav";
import "./Others.css";

const checklistItems = [
  { key: "eventAgenda", label: "Event Agenda" },
  { key: "guest_Information_And_Confirmation", label: "Guest Invitations & Confirmation" },
  { key: "participation_Notification_And_Communication", label: "Participation Notification & Communication" },
  { key: "newspaper_Engagement", label: "Newspaper Engagement (Event Column)" },
  { key: "flexBanner_Design_And_Installation", label: "Flex Banner Design & Installation" },
  { key: "website_And_SocialMedia_PreEventUpdates", label: "Website & Social Media Pre-Event Updates" },
  { key: "Signage_And_DirectionalBoards_Placement", label: "Signage & Directional Boards Placement" },
  { key: "HallSetup_And_TechnicalRequirements", label: "Hall Setup & Technical Requirements" },
  { key: "FloaralArrangements_Mementos_Shawl_ReturnGifts", label: "Floral Arrangements, Mementos, Shawl, Return Gifts" },
  { key: "Reception_Desk_And_Welcome_Setup", label: "Reception Desk & Welcome Setup" },
  { key: "Tree_Plantation_Ceremony", label: "Tree Plantation Ceremony" },
  { key: "Guest_Reception_At_Campus", label: "Guest Reception At Campus" },
  { key: "Lift_Coordinator_Assigned", label: "Lift Coordinator Assigned" },
  { key: "Guest_BookSigning_And_2Min_VideoByte", label: "Guest Book Signing & 2-Min Video Byte" },
  { key: "Photography_And_Videography_Coverage", label: "Photography & Videography Coverage" },
  { key: "EventReport_Preparation_And_Submission", label: "Event Report Preparation & Submission" },
  { key: "Website_And_SocialMedia_PostEventUpdates", label: "Website and Social Media Post-Event Updates" },
  { key: "Certificate_For_Guest_Participants_Or_Feedback_From_The_Participants", label: "Certificate for Guest & Participants / Feedback From The Participants" },
];

const Others = () => {
  const itemsPerPage = 9;
  const totalPages = Math.ceil(checklistItems.length / itemsPerPage);
  const [currentPage, setCurrentPage] = useState(0);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [userId, setUserId] = useState('');
  const [eventId, setEventId] = useState('');

  // Initialize form data from localStorage if available
  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem('checklistData');
    return savedData ? JSON.parse(savedData) : checklistItems.reduce((acc, item) => {
      acc[item.key] = { required: "", inCharge: "", date: "" };
      return acc;
    }, {});
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  // Save to localStorage whenever formData changes
  useEffect(() => {
    localStorage.setItem('checklistData', JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 3000);
      return () => clearTimeout(timer);
    }
    
    const storedData = JSON.parse(localStorage.getItem('userData'));
    const storedUserId = storedData?.user?.hod || '';
    const storedEventId = localStorage.getItem('eventId');
    setUserId(storedData?.user?._id || '');
    setEventId(storedEventId || '');
  }, [message]);

  const visibleItems = checklistItems.slice(
    currentPage * itemsPerPage, 
    (currentPage + 1) * itemsPerPage
  );

  const handleChange = (key, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: value,
      },
    }));
  };

  const validateCurrentPage = () => {
    return visibleItems.every((item) => {
      const { required, inCharge, date } = formData[item.key];
      return required && inCharge.trim() && date;
    });
  };

  const validateAllPages = () => {
    return checklistItems.every((item) => {
      const { required, inCharge, date } = formData[item.key];
      return required && inCharge.trim() && date;
    });
  };

  const handleNextPage = () => {
    if (!validateCurrentPage()) {
      setMessage("Please fill all fields on this page!");
      setMessageType("error");
      return;
    }
    setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const handleSaveCurrentPage = async () => {
    try {
      // Save only the current page data to checklist in DB
      const currentPageData = visibleItems.map(item => ({
        taskName: item.label,
        required: formData[item.key].required,
        inCharge: formData[item.key].inCharge,
        dueDate: formData[item.key].date
      }));

      const saveResponse = await fetch("http://localhost:1045/event/checklist/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          eventId,
          checklistType: "others",
          tasks: currentPageData,
          isDraft: true
        }),
      });

      if (saveResponse.ok) {
        setMessage("Current page details saved successfully!");
        setMessageType("success");
        setShowSaveModal(false);
      } else {
        const errorData = await saveResponse.json();
        throw new Error(errorData.message || "Save failed");
      }
    } catch (err) {
      console.error("Save error:", err);
      setMessage(err.message || "Failed to save data");
      setMessageType("error");
    }
  };

  const handleSubmitForApproval = async () => {
    if (!validateAllPages()) {
      setMessage("Please fill all fields on all pages before submitting!");
      setMessageType("error");
      setShowSaveModal(false);
      return;
    }

    try {
      // First submit the checklist
      const checklistResponse = await fetch("http://localhost:1045/event/checklist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          eventId,
          checklistType: "others",
          tasks: checklistItems.map(item => ({
            taskName: item.label,
            required: formData[item.key].required,
            inCharge: formData[item.key].inCharge,
            dueDate: formData[item.key].date
          })),
          submittedAt: new Date().toISOString()
        }),
      });

      if (!checklistResponse.ok) {
        throw new Error("Checklist submission failed");
      }

      // Then submit all other event data
      const eventDataResponse = await fetch("http://localhost:1045/event/final", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId,
          submitAll: true
        }),
      });

      if (eventDataResponse.ok) {
        setMessage("All data submitted for approval successfully!");
        setMessageType("success");
        localStorage.removeItem('checklistData');
        setShowSaveModal(false);
      } else {
        throw new Error("Failed to submit all event data");
      }
    } catch (err) {
      console.error("Submission error:", err);
      setMessage(err.message || "Server error during submission");
      setMessageType("error");
    }
  };

  return (
    <>
      <div className="nav">
        <Navbar />
        <EventNav />
      </div>

      {message && <div className={`message-box ${messageType}`}>{message}</div>}

      <div className="others-container">
        <h2 className="ot-title">Event Checklist</h2>
        <div className="table-section">
          <table className="checklist-table">
            <thead>
              <tr>
                <th>S.NO</th>
                <th>ACTIVITY</th>
                <th>REQUIRED</th>
                <th>IN-CHARGE</th>
                <th>DATE</th>
              </tr>
            </thead>
            <tbody>
              {visibleItems.map((item, index) => (
                <tr key={item.key}>
                  <td data-label="S.NO">{currentPage * itemsPerPage + index + 1}</td>
                  <td data-label="ACTIVITY">{item.label}</td>
                  <td data-label="REQUIRED">
                    <select
                      value={formData[item.key].required}
                      onChange={(e) =>
                        handleChange(item.key, "required", e.target.value)
                      }
                    >
                      <option value="">Select</option>
                      <option value="yes">YES</option>
                      <option value="no">NO</option>
                    </select>
                  </td>
                  <td data-label="IN-CHARGE">
                    <input
                      type="text"
                      placeholder="In-charge"
                      value={formData[item.key].inCharge}
                      onChange={(e) =>
                        handleChange(item.key, "inCharge", e.target.value)
                      }
                    />
                  </td>
                  <td data-label="DATE">
                    <input
                      type="date"
                      value={formData[item.key].date}
                      onChange={(e) =>
                        handleChange(item.key, "date", e.target.value)
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="btn-row">
            {currentPage > 0 && (
              <button className="prev-btn" onClick={handlePrevPage}>
                {"<<"} Prev
              </button>
            )}
            {currentPage < totalPages - 1 ? (
              <button className="next-btn" onClick={handleNextPage}>
                Next {">>"}
              </button>
            ) : (
              <button 
                className="submit-btn-cl" 
                onClick={() => setShowSaveModal(true)}
                disabled={!validateCurrentPage()}
              >
                Save
              </button>
            )}
          </div>
        </div>
      </div>

      {showSaveModal && (
        <div className="modal-overlay">
          <div className="save-modal">
            <div className="modal-content">
              <button 
                className="close-modal-btn" 
                onClick={() => setShowSaveModal(false)}
              >
                ×
              </button>
              {/* <h3>Save Options</h3> */}
              <p>Submit all data for approval</p>
              
              <div className="modal-buttons-vertical">
                
                <button 
                  className="submit-approval-btn" 
                  onClick={handleSubmitForApproval}
                >
                  Submit All for Approval
                </button>
                <button 
                  className="cancel-btn-cl" 
                  onClick={() => setShowSaveModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Others;