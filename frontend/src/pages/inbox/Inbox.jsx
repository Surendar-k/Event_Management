import {useState, useEffect} from 'react'
import axios from 'axios'
import './inbox.css'

const Inbox = () => {
  const [events, setEvents] = useState([])
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [userType, setUserType] = useState('HOD')

  // Get user type from localStorage when component mounts
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData'))
    setUserType(userData?.user?.designation || '')
  }, [])

  console.log('User Type:', userType)

  // Fetch events from database based on user type
  useEffect(() => {
    const fetchEvents = async () => {
      const userData = JSON.parse(localStorage.getItem('userData'))
      try {
        setLoading(true)
        let endpoint = ''
        let requestBody = {}

        if (userType === 'HOD') {
          const department = userData?.user?.department
          if (!department) {
            throw new Error('Missing department in localStorage')
          }
          endpoint = 'http://localhost:1045/event/view-hod'
          requestBody = {department}
          console.log('Fetching events for department:', department)
        } else if (userType === 'CSO') {
          const csoId = userData?.user?.cso
          endpoint = 'http://localhost:1045/event/view-cso'
          requestBody = {csoId}
        } else if (userType === 'PRINCIPAL') {
          const principalId = userData?.user?.principal
          endpoint = 'http://localhost:1045/event/view-principal'
          requestBody = {principalId}
        }

        console.log('POSTing to:', endpoint)
        console.log('With body:', requestBody)

        const response = await axios.post(endpoint, requestBody, {
          headers: {
            'Content-Type': 'application/json'
          }
        })

        console.log('Fetched Events:', response.data)
        setEvents(response.data.events ? response.data : [])
      } catch (err) {
        setError('Failed to load events. Please try again later.')
        console.error('Axios Error:', err)

        if (err.response) {
          console.error('Status:', err.response.status)
          console.error('Data:', err.response.data)
        }

        setEvents([])
      } finally {
        setLoading(false)
      }
    }

    if (userType) {
      fetchEvents()
    }
  }, [userType])

  const handleSuggestionChange = (eventId, newSuggestion) => {
    setEvents(
      events.map(event =>
        event.eventId === eventId
          ? {...event, suggestions: newSuggestion}
          : event
      )
    )
  }

  const handleApprove = async eventId => {
    try {
      let endpoint = ''

      // Determine approval endpoint based on user type
      if (userType === 'PRINCIPAL') {
        endpoint = 'http://localhost:1045/event/approveByPrincipal'
      } else if (userType === 'CSO') {
        endpoint = 'http://localhost:1045/event/approveByCso'
      } else if (userType === 'HOD') {
        endpoint = 'http://localhost:1045/event/approveByHod'
      }

      if (!endpoint) {
        alert('Invalid user type for approval')
        return
      }

      // Send PUT request with eventId in the body
      await axios.put(endpoint, {eventId})

      // Update UI approval status
      setEvents(
        events.map(event => {
          if (event.eventId === eventId) {
            const updatedEvent = {...event}
            if (userType === 'HOD') {
              updatedEvent.hodApprovalStatus = 'Approved'
            } else if (userType === 'CSO') {
              updatedEvent.csoApprovalStatus = 'Approved'
            } else if (userType === 'PRINCIPAL') {
              updatedEvent.principalApprovalStatus = 'Approved'
            }
            return updatedEvent
          }
          return event
        })
      )
    } catch (err) {
      alert('Failed to approve event. Please try again.')
      console.error('Error approving event:', err)
    }
  }

  const handleSuggest = async eventId => {
    try {
      const event = events.find(e => e.eventId === eventId)
      if (!event.suggestions) {
        alert('Please add suggestions before submitting')
        return
      }

      let endpoint = ''

      // Determine suggestion endpoint based on user type
      if (userType === 'HOD') {
        endpoint = 'http://localhost:1045/event/suggestByHod'
      } else if (userType === 'CSO') {
        endpoint = 'http://localhost:1045/event/suggestByCso'
      } else if (userType === 'PRINCIPAL') {
        endpoint = 'http://localhost:1045/event/suggestByPrincipal'
      }

      if (!endpoint) {
        alert('Invalid user type for suggestions')
        return
      }

      await axios.put(endpoint, {
        eventId,
        suggestions: event.suggestions
      })

      // Update UI to show suggestions were submitted
      setEvents(
        events.map(e =>
          e.eventId === eventId ? {...e, suggestionsSubmitted: true} : e
        )
      )

      alert('Suggestions submitted successfully!')
    } catch (err) {
      alert('Failed to submit suggestions. Please try again.')
      console.error('Error submitting suggestions:', err)
    }
  }

  const handleView = async eventId => {
    try {
      const response = await axios.get(
        `http://localhost:1045/event/get-event/${eventId}`
      )
      setSelectedEvent(response.data)
      setShowModal(true)
    } catch (err) {
      alert('Failed to load event details. Please try again.')
      console.error('Error fetching event details:', err)
    }
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedEvent(null)
  }

  // Helper function to check if event is approved by current user
  const isApprovedByCurrentUser = event => {
    if (userType === 'HOD') {
      return event.hodApprovalStatus === 'Approved'
    } else if (userType === 'CSO') {
      return event.csoApprovalStatus === 'Approved'
    } else if (userType === 'PRINCIPAL') {
      return event.principalApprovalStatus === 'Approved'
    }
    return false
  }

  if (loading) return <div className='loading'>Loading events...</div>
  if (error) return <div className='error'>{error}</div>
  if (events.length === 0)
    return <div className='no-events'>No events found in your inbox.</div>
  {
    events.length === 0 ? (
      <p>No events available.</p>
    ) : (
      events.map((event, index) => (
        <div key={index}>
          <p>{event.title}</p>
        </div>
      ))
    )
  }

  return (
    <div className='page-container1'>
      <header className='page-header'>
        <h1>{userType.toUpperCase()} Inbox</h1>
      </header>

      <main className='content-container1'>
        <div className='event-cards-container1'>
          {events.map(event => {
            const isApproved = isApprovedByCurrentUser(event)
            const showSuggestions = !isApproved && userType !== 'PRINCIPAL' // Principal might not need to suggest

            return (
              <div key={event.eventId} className='event-card1'>
                <div className='event-header1'>
                  <h3>{event.eventId}</h3>
                  <span
                    className={`status-badge ${event.hodApprovalStatus.toLowerCase()}`}>
                    {event.hodApprovalStatus}
                  </span>
                </div>

                <div className='event-details1'>
                  <p>
                    <strong>{event.eventInfo?.title}</strong>
                  </p>
                  <p>{event.eventInfo?.department}</p>
                  <p>
                    {event.eventInfo?.eventStartDate
                      ? new Date(
                          event.eventInfo.eventStartDate
                        ).toLocaleDateString()
                      : 'N/A'}{' '}
                    -{' '}
                    {event.eventInfo?.eventEndDate
                      ? new Date(
                          event.eventInfo.eventEndDate
                        ).toLocaleDateString()
                      : 'N/A'}{' '}
                    | {event.eventInfo?.eventStartTime || 'N/A'} -{' '}
                    {event.eventInfo?.eventEndTime || 'N/A'}
                  </p>
                  <p>Venue: {event.eventInfo?.venue || 'N/A'}</p>
                </div>

                {showSuggestions && (
                  <div className='event-status1'>
                    <textarea
                      value={event.suggestions || ''}
                      onChange={e =>
                        handleSuggestionChange(
                          event.eventId,
                          e.target.value
                        )
                      }
                      placeholder='Add suggestions...'
                      rows='3'
                      className='suggestions-textarea'
                    />
                  </div>
                )}

                <div className='event-buttons1'>
                  {isApproved ? (
                    <button className='approved-button' disabled>
                      ✓ Approved
                    </button>
                  ) : (
                    <button
                      className='approve-button'
                      onClick={() => handleApprove(event.eventId)}>
                      ✓ Approve
                    </button>
                  )}

                  {showSuggestions && !event.suggestionsSubmitted && (
                    <button
                      className='suggest-button'
                      onClick={() => handleSuggest(event.eventId)}>
                      ✎ Suggest
                    </button>
                  )}

                  <button
                    className='view-button'
                    onClick={() => handleView(event.eventId)}>
                    👁 View Details
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {showModal && selectedEvent && (
          <div className='modal-overlay'>
            <div className='modal-content'>
              <button className='close-button' onClick={closeModal}>
                ×
              </button>

              <div className='form-row1'>
                <div className='title-row'>
                  <div className='form-field'>
                    <div className='centered-title'>
                      {selectedEvent?.eventInfo?.title || 'Event Details'}
                      <div className='dotted-line'></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className='modal-header'>
                <h2>Event Outline & Summary Sheet</h2>
                <div className='approval-status'>
                  <span>
                    HOD Status:{' '}
                    <strong>
                      {selectedEvent.hodApprovalStatus || 'N/A'}
                    </strong>
                  </span>
                  {userType === 'CSO' && (
                    <span>
                      CSO Status:{' '}
                      <strong>
                        {selectedEvent.csoApprovalStatus || 'N/A'}
                      </strong>
                    </span>
                  )}
                  {userType === 'PRINCIPAL' && (
                    <span>
                      Principal Status:{' '}
                      <strong>
                        {selectedEvent.principalApprovalStatus || 'N/A'}
                      </strong>
                    </span>
                  )}
                </div>
              </div>

              <div className='model-id-c'>
                <div className='event-form'>
                  {/* E_ID */}
                  <div className='form-row1'>
                    <div className='form-field'>
                      <label>E_ID:</label>
                      <div className='form-value'>
                        {selectedEvent.eventId || 'N/A'}
                      </div>
                    </div>
                  </div>

                  {/* General Information Section */}
                  <div className='form-section'>
                    <h3>General Information</h3>
                    <div className='form-grid'>
                      <div className='form-field'>
                        <label>Organizing Institution:</label>
                        <div className='form-value'>
                          {selectedEvent.eventInfo
                            ?.eventOrganizingInstitution || 'N/A'}
                        </div>
                      </div>
                      <div className='form-field'>
                        <label>Department:</label>
                        <div className='form-value'>
                          {selectedEvent.eventInfo?.department || 'N/A'}
                        </div>
                      </div>
                      <div className='form-field'>
                        <label>Event Title:</label>
                        <div className='form-value'>
                          {selectedEvent.eventInfo?.title || 'N/A'}
                        </div>
                      </div>
                      <div className='form-field'>
                        <label>Event Nature:</label>
                        <div className='form-value'>
                          {selectedEvent.eventInfo?.eventNature || 'N/A'}
                        </div>
                      </div>
                      <div className='form-field'>
                        <label>Event Scope:</label>
                        <div className='form-value'>
                          {selectedEvent.eventInfo?.eventScope || 'N/A'}
                        </div>
                      </div>
                      <div className='form-field'>
                        <label>Funding Source:</label>
                        <div className='form-value'>
                          {selectedEvent.eventInfo?.fundingSource || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Event Schedule Section */}
                  <div className='form-section'>
                    <h3>Event Schedule</h3>
                    <div className='form-grid'>
                      <div className='form-field'>
                        <label>Start Date:</label>
                        <div className='form-value'>
                          {selectedEvent.eventInfo?.eventStartDate
                            ? new Date(
                                selectedEvent.eventInfo.eventStartDate
                              ).toLocaleDateString()
                            : 'N/A'}
                        </div>
                      </div>
                      <div className='form-field'>
                        <label>End Date:</label>
                        <div className='form-value'>
                          {selectedEvent.eventInfo?.eventEndDate
                            ? new Date(
                                selectedEvent.eventInfo.eventEndDate
                              ).toLocaleDateString()
                            : 'N/A'}
                        </div>
                      </div>
                      <div className='form-field'>
                        <label>Total Days:</label>
                        <div className='form-value'>
                          {selectedEvent.eventInfo?.totalDays || 'N/A'}
                        </div>
                      </div>
                      <div className='form-field'>
                        <label>Start Time:</label>
                        <div className='form-value'>
                          {selectedEvent.eventInfo?.eventStartTime ||
                            'N/A'}
                        </div>
                      </div>
                      <div className='form-field'>
                        <label>End Time:</label>
                        <div className='form-value'>
                          {selectedEvent.eventInfo?.eventEndTime || 'N/A'}
                        </div>
                      </div>
                      <div className='form-field'>
                        <label>Venue:</label>
                        <div className='form-value'>
                          {selectedEvent.eventInfo?.venue || 'N/A'}
                        </div>
                      </div>
                      <div className='form-field'>
                        <label>Intended Audience:</label>
                        <div className='form-value'>
                          {selectedEvent.eventInfo?.intendedAudience ||
                            'N/A'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Coordinators Section */}
                  <div className='form-section'>
                    <h3>Coordinators</h3>
                    <div className='form-grid'>
                      <div className='form-field'>
                        <label>Lead Coordinator:</label>
                        <div className='form-value'>
                          {selectedEvent.eventInfo?.leadCoOrdinator ||
                            'N/A'}
                        </div>
                      </div>
                      <div className='form-field'>
                        <label>Faculty Coordinator:</label>
                        <div className='form-value'>
                          {selectedEvent.eventInfo?.facultyCoOrdinator ||
                            'N/A'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Speaker Details Section */}
                  <div className='form-section'>
                    <h3>Speaker Details</h3>
                    <div className='form-grid'>
                      <div className='form-field'>
                        <label>Name:</label>
                        <div className='form-value'>
                          {selectedEvent.eventInfo?.name_Of_The_Speaker ||
                            'N/A'}
                        </div>
                      </div>
                      <div className='form-field'>
                        <label>Designation:</label>
                        <div className='form-value'>
                          {selectedEvent.eventInfo?.designation || 'N/A'}
                        </div>
                      </div>
                      <div className='form-field'>
                        <label>Organization:</label>
                        <div className='form-value'>
                          {selectedEvent.eventInfo
                            ?.affiliated_Organization || 'N/A'}
                        </div>
                      </div>
                      <div className='form-field'>
                        <label>Contact Number:</label>
                        <div className='form-value'>
                          {selectedEvent.eventInfo?.contactNumber || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Participation Details */}
                  <div className='form-section'>
                    <h3>Participation Details</h3>
                    <div className='form-grid'>
                      <div className='form-field'>
                        <label>Estimated Students:</label>
                        <div className='form-value'>
                          {selectedEvent.eventInfo
                            ?.estimated_Student_Participation || 'N/A'}
                        </div>
                      </div>
                      <div className='form-field'>
                        <label>Estimated Faculty:</label>
                        <div className='form-value'>
                          {selectedEvent.eventInfo
                            ?.estimated_Faculty_Participation || 'N/A'}
                        </div>
                      </div>
                      <div className='form-field'>
                        <label>Total Expected:</label>
                        <div className='form-value'>
                          {selectedEvent.eventInfo
                            ?.total_Expected_Attendence || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Guest Arrangements */}
                  <div className='form-section'>
                    <h3>Guest Arrangements</h3>
                    <div className='form-grid'>
                      <div className='form-field'>
                        <label>Accommodation:</label>
                        <div className='form-value'>
                          {selectedEvent.eventInfo?.guest_Accomodation ||
                            'N/A'}
                        </div>
                      </div>
                      <div className='form-field'>
                        <label>Transportation:</label>
                        <div className='form-value'>
                          {selectedEvent.eventInfo?.guest_Transportation ||
                            'N/A'}
                        </div>
                      </div>
                      <div className='form-field'>
                        <label>Food:</label>
                        <div className='form-value'>
                          {selectedEvent.eventInfo?.guest_Food || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Infrastructure Requirements */}
                  <div className='form-section'>
                    <h3>Infrastructure Requirements</h3>
                    <div className='form-grid'>
                      <div className='form-field'>
                        <label>Equipment:</label>
                        <div className='form-value'>
                          {selectedEvent.infraAndTech?.equipment || 'N/A'}
                        </div>
                      </div>
                      <div className='form-field'>
                        <label>Quantity:</label>
                        <div className='form-value'>
                          {selectedEvent.infraAndTech?.quantity || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Suggestions */}
                  <div className='form-section'>
                    <h3>Suggestions</h3>
                    <div className='form-field full-width'>
                      <div className='form-value suggestions-box'>
                        {selectedEvent.suggestions ||
                          'No suggestions provided yet'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default Inbox
