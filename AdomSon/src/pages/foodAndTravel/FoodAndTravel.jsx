import React, { useState, useEffect } from "react";
import EventNav from "../../EventNav";
import Navbar from "../../Navbar";
import "./Foodandtravel.css";
import axios from "axios";



const FoodTravelForm = () => {
  // Get days from localStorage
  const eventData = JSON.parse(localStorage.getItem('eventData'));
  const [days, setDays] = useState(eventData?.totalDays || "");
const [startDate, setStartDate] = useState("");
const [endDate, setEndDate] = useState("");


  // Refreshment states
  const [refreshmentEntries, setRefreshmentEntries] = useState([]);
  const [localRefreshmentEntries, setLocalRefreshmentEntries] = useState([]);
  const [refreshmentForm, setRefreshmentForm] = useState({
    date: "",
    time: "",
    session: "Forenoon",
    category: "Guest",
    items: "Only Tea/Coffee",
    count: "",
    servedAt: "Venue",
    note: "",
  });
  const [editingRefreshmentId, setEditingRefreshmentId] = useState(null);

  // Food states
  const [foodEntries, setFoodEntries] = useState([]);
  const [localFoodEntries, setLocalFoodEntries] = useState([]);
  const [foodForm, setFoodForm] = useState({
    date: "",
    time: "",
    mealType: "Breakfast",
    category: "Guest",
    menu: "Standard",
    count: "",
    servedAt: "Dining Hall",
    note: "",
  });
  const [editingFoodId, setEditingFoodId] = useState(null);

  // Travel states
  const [travelEntries, setTravelEntries] = useState([]);
  const [localTravelEntries, setLocalTravelEntries] = useState([]);
  const [travelForm, setTravelForm] = useState({
    category: "Guest",
    mode: "Car",
    date: "",
    time: "",
    pickup: "",
    drop: "",
    remarks: "",
  });
  const [editingTravelId, setEditingTravelId] = useState(null);

  // Status state
  const [status, setStatus] = useState({
    message: "",
    isError: false,
  });

  // Track changes
  const [hasChanges, setHasChanges] = useState(false);

  // Fetch initial data (only refreshments, food, and travel)
useEffect(() => {

  const start = localStorage.getItem("eventStartDate") || "";
  const end = localStorage.getItem("eventEndDate") || "";

  setStartDate(start);
  setEndDate(end);

  // Example: if you also want to log or use it
  console.log("Event Dates:", startDate, "to", endDate);
}, []);

  // Check for changes
  useEffect(() => {
    const changesExist =
      JSON.stringify(localRefreshmentEntries) !==
        JSON.stringify(refreshmentEntries) ||
      JSON.stringify(localFoodEntries) !== JSON.stringify(foodEntries) ||
      JSON.stringify(localTravelEntries) !== JSON.stringify(travelEntries);

    setHasChanges(changesExist);
  }, [
    localRefreshmentEntries,
    localFoodEntries,
    localTravelEntries,
    refreshmentEntries,
    foodEntries,
    travelEntries,
  ]);

  // Refreshment handlers
  const handleRefreshmentInputChange = (e) => {
    const { name, value } = e.target;
    setRefreshmentForm((prev) => ({ ...prev, [name]: value }));
  };

  const addRefreshmentEntry = () => {
    if (
      !refreshmentForm.date ||
      !refreshmentForm.time ||
      !refreshmentForm.count
    )
      return;

    const newEntry = {
      ...refreshmentForm,
      id: Date.now(), // Temporary ID for local editing
    };

    setLocalRefreshmentEntries((prev) => [...prev, newEntry]);
    setRefreshmentForm({
      date: "",
      time: "",
      session: "Forenoon",
      category: "Guest",
      items: "Only Tea/Coffee",
      count: "",
      servedAt: "Venue",
      note: "",
    });
  };

  const editRefreshmentEntry = (id) => {
    const entryToEdit = localRefreshmentEntries.find(
      (entry) => entry.id === id
    );
    if (!entryToEdit) return;

    setRefreshmentForm(entryToEdit);
    setEditingRefreshmentId(id);
  };

  const updateRefreshmentEntry = () => {
    if (!editingRefreshmentId) return;

    setLocalRefreshmentEntries((prev) =>
      prev.map((entry) =>
        entry.id === editingRefreshmentId ? refreshmentForm : entry
      )
    );
    setEditingRefreshmentId(null);
    setRefreshmentForm({
      date: "",
      time: "",
      session: "Forenoon",
      category: "Guest",
      items: "Only Tea/Coffee",
      count: "",
      servedAt: "Venue",
      note: "",
    });
  };

  const deleteRefreshmentEntry = (id) => {
    setLocalRefreshmentEntries((prev) =>
      prev.filter((entry) => entry.id !== id)
    );
    if (editingRefreshmentId === id) {
      setEditingRefreshmentId(null);
      setRefreshmentForm({
        date: "",
        time: "",
        session: "Forenoon",
        category: "Guest",
        items: "Only Tea/Coffee",
        count: "",
        servedAt: "Venue",
        note: "",
      });
    }
  };

  // Food handlers
  const handleFoodInputChange = (e) => {
    const { name, value } = e.target;
    setFoodForm((prev) => ({ ...prev, [name]: value }));
  };

  const addFoodEntry = () => {
    if (!foodForm.date || !foodForm.time || !foodForm.count) return;

    const newEntry = {
      ...foodForm,
      id: Date.now(), // Temporary ID for local editing
    };

    setLocalFoodEntries((prev) => [...prev, newEntry]);
    setFoodForm({
      date: "",
      time: "",
      mealType: "Breakfast",
      category: "Guest",
      menu: "Standard",
      count: "",
      servedAt: "Dining Hall",
      note: "",
    });
  };

  const editFoodEntry = (id) => {
    const entryToEdit = localFoodEntries.find((entry) => entry.id === id);
    if (!entryToEdit) return;

    setFoodForm(entryToEdit);
    setEditingFoodId(id);
  };

  const updateFoodEntry = () => {
    if (!editingFoodId) return;

    setLocalFoodEntries((prev) =>
      prev.map((entry) => (entry.id === editingFoodId ? foodForm : entry))
    );
    setEditingFoodId(null);
    setFoodForm({
      date: "",
      time: "",
      mealType: "Breakfast",
      category: "Guest",
      menu: "Standard",
      count: "",
      servedAt: "Dining Hall",
      note: "",
    });
  };

  const deleteFoodEntry = (id) => {
    setLocalFoodEntries((prev) => prev.filter((entry) => entry.id !== id));
    if (editingFoodId === id) {
      setEditingFoodId(null);
      setFoodForm({
        date: "",
        time: "",
        mealType: "Breakfast",
        category: "Guest",
        menu: "Standard",
        count: "",
        servedAt: "Dining Hall",
        note: "",
      });
    }
  };

  // Travel handlers
  const handleTravelInputChange = (e) => {
    const { name, value } = e.target;
    setTravelForm((prev) => ({ ...prev, [name]: value }));
  };

  const addTravelEntry = () => {
    if (
      !travelForm.date ||
      !travelForm.time ||
      !travelForm.pickup ||
      !travelForm.drop
    )
      return;

    const newEntry = {
      ...travelForm,
      id: Date.now(), // Temporary ID for local editing
    };

    setLocalTravelEntries((prev) => [...prev, newEntry]);
    setTravelForm({
      category: "Guest",
      mode: "Car",
      date: "",
      time: "",
      pickup: "",
      drop: "",
      remarks: "",
    });
  };

  const editTravelEntry = (id) => {
    const entryToEdit = localTravelEntries.find((entry) => entry.id === id);
    if (!entryToEdit) return;

    setTravelForm(entryToEdit);
    setEditingTravelId(id);
  };

  const updateTravelEntry = () => {
    if (!editingTravelId) return;

    setLocalTravelEntries((prev) =>
      prev.map((entry) => (entry.id === editingTravelId ? travelForm : entry))
    );
    setEditingTravelId(null);
    setTravelForm({
      category: "Guest",
      mode: "Car",
      date: "",
      time: "",
      pickup: "",
      drop: "",
      remarks: "",
    });
  };

  const deleteTravelEntry = (id) => {
    setLocalTravelEntries((prev) => prev.filter((entry) => entry.id !== id));
    if (editingTravelId === id) {
      setEditingTravelId(null);
      setTravelForm({
        category: "Guest",
        mode: "Car",
        date: "",
        time: "",
        pickup: "",
        drop: "",
        remarks: "",
      });
    }
  };

  // Save all changes to backend
const saveAllChanges = async () => {
  try {
    const eventId = localStorage.getItem('eventId');
    const userId = JSON.parse(localStorage.getItem('userData'))?.user?._id;

    if (!eventId || !userId) {
      setStatus({
        message: "Event ID or User ID not found in local storage",
        isError: true,
      });
      return;
    }

    const payload = {
      eventId,
      userId,
      refreshments: localRefreshmentEntries,
      meals: localFoodEntries,   // Note: your backend expects 'meals' not 'food'
      travels: localTravelEntries // Also note your backend expects 'travels' plural
    };

    const response = await axios.post("http://localhost:1045/event/arrangements", payload);

    // Axios throws error for non-2xx statuses, so this is usually not needed:
    // if (response.status !== 200) {
    //   throw new Error("Failed to save arrangements");
    // }

    setRefreshmentEntries(localRefreshmentEntries);
    setFoodEntries(localFoodEntries);
    setTravelEntries(localTravelEntries);

    setStatus({
     
      isError: false,
    });

  } catch (error) {
    console.error("Save failed:", error);
    setStatus({
      message: error.response?.data?.message || error.message || "Failed to save changes",
      isError: true,
    });
  }
  alert("All arrangements saved successfully!");
};

  // Group entries for display with serial numbers
 const groupEntriesWithSerial = (entries, timeField) => {
  const grouped = entries.reduce((acc, entry) => {
    const date = entry.date;
    const timeKey = entry[timeField];

    if (!date || !timeKey) return acc; // Skip if either is missing

    if (!acc[date]) acc[date] = {};
    acc[date][timeKey] = entry;

    return acc;
  }, {});

  return Object.entries(grouped).map(([date, sessions], index) => ({
    serial: index + 1,
    date,
    ...sessions,
  }));
};


  const groupedRefreshments = groupEntriesWithSerial(
    localRefreshmentEntries,
    "session"
  );
  const groupedFood = groupEntriesWithSerial(localFoodEntries, "mealType");

  return (
    <>
      <div className="nav">
        <Navbar />
        <EventNav />
      </div>

      <div className="food-travel-container">
        <h3>Food and Travel Arrangements</h3>

        {status.message && (
  <div className={`status-message ${status.isError ? "error" : "success"}`}>
    {status.message}
  </div>
)}


        {/* Save All Button */}
       

        {/* Food Section */}
        <div className="section-container-1">
          <h3>Meal Arrangements</h3>

          <div className="input-table-container">
            <table className="input-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Meal Type</th>
                  <th>Category</th>
                  <th>Menu</th>
                  <th>Persons</th>
                  <th>Served At</th>
                  <th>Special Note</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <input
                      type="date"
                      name="date"
                      value={foodForm.date}
                      onChange={handleFoodInputChange}
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="time"
                      name="time"
                      value={foodForm.time}
                      onChange={handleFoodInputChange}
                      required
                    />
                  </td>
                  <td>
                    <select
                      name="mealType"
                      value={foodForm.mealType}
                      onChange={handleFoodInputChange}
                      required
                    >
                      <option value="Breakfast">Breakfast</option>
                      <option value="Lunch">Lunch</option>
                      <option value="Dinner">Dinner</option>
                    </select>
                  </td>
                  <td>
                    <select
                      name="category"
                      value={foodForm.category}
                      onChange={handleFoodInputChange}
                      required
                    >
                      <option value="Guest">Guest</option>
                      <option value="Participants">Participants</option>
                      <option value="Both">Both</option>
                    </select>
                  </td>
                  <td>
                    <select
                      name="menu"
                      value={foodForm.menu}
                      onChange={handleFoodInputChange}
                      required
                    >
                      <option value="Standard">Standard</option>
                      <option value="Vegetarian">Vegetarian</option>
                      <option value="Special">Special</option>
                    </select>
                  </td>
                  <td>
                    <input
                      type="number"
                      placeholder="Count"
                      name="count"
                      value={foodForm.count}
                      onChange={handleFoodInputChange}
                      required
                      min="1"
                    />
                  </td>
                  <td>
                    <select
                      name="servedAt"
                      value={foodForm.servedAt}
                      onChange={handleFoodInputChange}
                      required
                    >
                      <option value="Dining Hall">Dining Hall</option>
                      <option value="Venue">Venue</option>
                    </select>
                  </td>
                  <td>
                    <input
                      type="text"
                      placeholder="Note"
                      name="note"
                      value={foodForm.note}
                      onChange={handleFoodInputChange}
                    />
                  </td>
                  <td>
                    <button
                      className="add-btn"
                      onClick={editingFoodId ? updateFoodEntry : addFoodEntry}
                    >
                      {editingFoodId ? "Update" : "Add"}
                    </button>
                    {editingFoodId && (
                      <button
                        className="cancel-btn"
                        onClick={() => {
                          setEditingFoodId(null);
                          setFoodForm({
                            date: "",
                            time: "",
                            mealType: "Breakfast",
                            category: "Guest",
                            menu: "Standard",
                            count: "",
                            servedAt: "Dining Hall",
                            note: "",
                          });
                        }}
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h4>Meal Schedule</h4>
          <div className="schedule-container">
            <table className="schedule-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Breakfast</th>
                  <th>Lunch</th>
                  <th>Dinner</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {groupedFood.map((group) => (
                  <tr key={group.date}>
                    <td>{group.date}</td>
                    <td>
                      {group.Breakfast ? (
                        <>
                          {group.Breakfast.time} - {group.Breakfast.category} (
                          {group.Breakfast.count})
                          <br />
                          {group.Breakfast.menu} - {group.Breakfast.servedAt}
                          {group.Breakfast.note && <br />}
                          {group.Breakfast.note}
                        </>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td>
                      {group.Lunch ? (
                        <>
                          {group.Lunch.time} - {group.Lunch.category} (
                          {group.Lunch.count})
                          <br />
                          {group.Lunch.menu} - {group.Lunch.servedAt}
                          {group.Lunch.note && <br />}
                          {group.Lunch.note}
                        </>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td>
                      {group.Dinner ? (
                        <>
                          {group.Dinner.time} - {group.Dinner.category} (
                          {group.Dinner.count})
                          <br />
                          {group.Dinner.menu} - {group.Dinner.servedAt}
                          {group.Dinner.note && <br />}
                          {group.Dinner.note}
                        </>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td>
                      {group.Breakfast && (
                        <>
                          <button
                            className="edit-btn"
                            onClick={() => editFoodEntry(group.Breakfast.id)}
                          >
                            Edit
                          </button>
                          <button
                            className="delete-btn"
                            onClick={() => deleteFoodEntry(group.Breakfast.id)}
                          >
                            Delete
                          </button>
                        </>
                      )}
                      {group.Lunch && (
                        <>
                          <button
                            className="edit-btn"
                            onClick={() => editFoodEntry(group.Lunch.id)}
                          >
                            Edit
                          </button>
                          <button
                            className="delete-btn"
                            onClick={() => deleteFoodEntry(group.Lunch.id)}
                          >
                            Delete
                          </button>
                        </>
                      )}
                      {group.Dinner && (
                        <>
                          <button
                            className="edit-btn"
                            onClick={() => editFoodEntry(group.Dinner.id)}
                          >
                            Edit
                          </button>
                          <button
                            className="delete-btn"
                            onClick={() => deleteFoodEntry(group.Dinner.id)}
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
                {localFoodEntries.length === 0 && (
                  <tr>
                    <td colSpan="5" className="empty-table-message">
                      No meal arrangements added yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Refreshment Section */}
        <div className="section-container">
          <h3>Refreshment Arrangements</h3>

          <div className="input-table-container">
            <table className="input-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Session</th>
                  <th>Category</th>
                  <th>Items</th>
                  <th>Persons</th>
                  <th>Served At</th>
                  <th>Special Note</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <input
                      type="date"
                      name="date"
                      value={refreshmentForm.date}
                      onChange={handleRefreshmentInputChange}
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="time"
                      name="time"
                      value={refreshmentForm.time}
                      onChange={handleRefreshmentInputChange}
                      required
                    />
                  </td>
                  <td>
                    <select
                      name="session"
                      value={refreshmentForm.session}
                      onChange={handleRefreshmentInputChange}
                      required
                    >
                      <option value="Forenoon">Forenoon</option>
                      <option value="Afternoon">Afternoon</option>
                    </select>
                  </td>
                  <td>
                    <select
                      name="category"
                      value={refreshmentForm.category}
                      onChange={handleRefreshmentInputChange}
                      required
                    >
                      <option value="Guest">Guest</option>
                      <option value="Participants">Participants</option>
                      <option value="Both">Both</option>
                    </select>
                  </td>
                  <td>
                    <select
                      name="items"
                      value={refreshmentForm.items}
                      onChange={handleRefreshmentInputChange}
                      required
                    >
                      <option value="Only Tea/Coffee">Only Tea/Coffee</option>
                      <option value="Tea/Coffee with Snacks">
                        Tea/Coffee with Snacks
                      </option>
                    </select>
                  </td>
                  <td>
                    <input
                      type="number"
                      placeholder="Count"
                      name="count"
                      value={refreshmentForm.count}
                      onChange={handleRefreshmentInputChange}
                      required
                      min="1"
                    />
                  </td>
                  <td>
                    <select
                      name="servedAt"
                      value={refreshmentForm.servedAt}
                      onChange={handleRefreshmentInputChange}
                      required
                    >
                      <option value="Venue">Venue</option>
                      <option value="Guest Room">Guest Room</option>
                    </select>
                  </td>
                  <td>
                    <input
                      type="text"
                      placeholder="Note"
                      name="note"
                      value={refreshmentForm.note}
                      onChange={handleRefreshmentInputChange}
                    />
                  </td>
                  <td>
                    <button
                      className="add-btn"
                      onClick={
                        editingRefreshmentId
                          ? updateRefreshmentEntry
                          : addRefreshmentEntry
                      }
                    >
                      {editingRefreshmentId ? "Update" : "Add"}
                    </button>
                    {editingRefreshmentId && (
                      <button
                        className="cancel-btn"
                        onClick={() => {
                          setEditingRefreshmentId(null);
                          setRefreshmentForm({
                            date: "",
                            time: "",
                            session: "Forenoon",
                            category: "Guest",
                            items: "Only Tea/Coffee",
                            count: "",
                            servedAt: "Venue",
                            note: "",
                          });
                        }}
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h4>Refreshment Schedule</h4>
          <div className="schedule-container">
            <table className="schedule-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Forenoon</th>
                  <th>Afternoon</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {groupedRefreshments.map((group) => (
                  <tr key={group.date}>
                    <td>{group.date}</td>
                    <td>
                      {group.Forenoon ? (
                        <>
                          {group.Forenoon.time} - {group.Forenoon.category} (
                          {group.Forenoon.count})
                          <br />
                          {group.Forenoon.items} - {group.Forenoon.servedAt}
                          {group.Forenoon.note && <br />}
                          {group.Forenoon.note}
                        </>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td>
                      {group.Afternoon ? (
                        <>
                          {group.Afternoon.time} - {group.Afternoon.category} (
                          {group.Afternoon.count})
                          <br />
                          {group.Afternoon.items} - {group.Afternoon.servedAt}
                          {group.Afternoon.note && <br />}
                          {group.Afternoon.note}
                        </>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td>
                      {group.Forenoon && (
                        <>
                          <button
                            className="edit-btn"
                            onClick={() =>
                              editRefreshmentEntry(group.Forenoon.id)
                            }
                          >
                            Edit
                          </button>
                          <button
                            className="delete-btn"
                            onClick={() =>
                              deleteRefreshmentEntry(group.Forenoon.id)
                            }
                          >
                            Delete
                          </button>
                        </>
                      )}
                      {group.Afternoon && (
                        <>
                          <button
                            className="edit-btn"
                            onClick={() =>
                              editRefreshmentEntry(group.Afternoon.id)
                            }
                          >
                            Edit
                          </button>
                          <button
                            className="delete-btn"
                            onClick={() =>
                              deleteRefreshmentEntry(group.Afternoon.id)
                            }
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
                {localRefreshmentEntries.length === 0 && (
                  <tr>
                    <td colSpan="4" className="empty-table-message">
                      No refreshment arrangements added yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Travel Section */}
        <div className="section-container">
          <h3>Travel Arrangements</h3>

          <div className="input-table-container">
            <table className="input-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Mode of Travel</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Pickup Location</th>
                  <th>Drop Location</th>
                  <th>Remarks</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <select
                      name="category"
                      value={travelForm.category}
                      onChange={handleTravelInputChange}
                      required
                    >
                      <option value="Guest">Guest</option>
                      <option value="Participants">Participants</option>
                    </select>
                  </td>
                  <td>
                    <select
                      name="mode"
                      value={travelForm.mode}
                      onChange={handleTravelInputChange}
                      required
                    >
                      <option value="Car">Car</option>
                      <option value="Bus">Bus</option>
                      <option value="Train">Train</option>
                      <option value="Flight">Flight</option>
                    </select>
                  </td>
                  <td>
                    <input
                      type="date"
                      name="date"
                      value={travelForm.date}
                      onChange={handleTravelInputChange}
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="time"
                      name="time"
                      value={travelForm.time}
                      onChange={handleTravelInputChange}
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="pickup"
                      value={travelForm.pickup}
                      onChange={handleTravelInputChange}
                      placeholder="Pickup location"
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="drop"
                      value={travelForm.drop}
                      onChange={handleTravelInputChange}
                      placeholder="Drop location"
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="remarks"
                      value={travelForm.remarks}
                      onChange={handleTravelInputChange}
                      placeholder="Remarks"
                    />
                  </td>
                  <td>
                    <button
                      className="add-btn"
                      onClick={
                        editingTravelId ? updateTravelEntry : addTravelEntry
                      }
                    >
                      {editingTravelId ? "Update" : "Add"}
                    </button>
                    {editingTravelId && (
                      <button
                        className="cancel-btn"
                        onClick={() => {
                          setEditingTravelId(null);
                          setTravelForm({
                            category: "Guest",
                            mode: "Car",
                            date: "",
                            time: "",
                            pickup: "",
                            drop: "",
                            remarks: "",
                          });
                        }}
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h4>Travel Schedule</h4>
          <div className="schedule-container">
            <table className="schedule-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Mode</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Pickup</th>
                  <th>Drop</th>
                  <th>Remarks</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {localTravelEntries.map((entry) => (
                  <tr key={entry.id}>
                    <td>{entry.category}</td>
                    <td>{entry.mode}</td>
                    <td>{entry.date}</td>
                    <td>{entry.time}</td>
                    <td>{entry.pickup}</td>
                    <td>{entry.drop}</td>
                    <td>{entry.remarks}</td>
                    <td>
                      <button
                        className="edit-btn"
                        onClick={() => editTravelEntry(entry.id)}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => deleteTravelEntry(entry.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {localTravelEntries.length === 0 && (
                  <tr>
                    <td colSpan="8" className="empty-table-message">
                      No travel arrangements added yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="save-all-container">
            <button
              className="submit-btn-fa"
              onClick={saveAllChanges}
              disabled={!hasChanges}
            >
              Save All Arrangements
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FoodTravelForm;  