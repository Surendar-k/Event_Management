import {useState} from 'react'
import './Inbox2.css'

const eventList = [
  {
    id: 1,
    title: 'Tech Talk 2025',
    eventOrganizingInstitution: 'SSEI',
    department: 'CSE',
    eventStartDate: '2025-07-01',
    eventEndDate: '2025-07-02',
    eventNature: 'Seminar',
    venueType: 'Offline',
    eventScope: 'National',
    fundingSource: 'Management',
    eventStartTime: '10:00',
    eventEndTime: '15:00',
    venue: 'Auditorium',
    intendedAudience: 'Both',
    leadCoOrdinator: 'Dr. Alice',
    facultyCoOrdinator: 'Prof. Bob',
    name_Of_The_Speaker: 'Mr. John Doe',
    designation: 'CTO',
    affiliated_Organization: 'Tech Corp',
    contactNumber: '1234567890',
    email: 'john@techcorp.com',
    estimated_Student_Participation: '150',
    estimated_Faculty_Participation: '30',
    total_Expected_Attendence: '180',
    guest_Accomodation: 'Yes',
    guest_Transportation: 'No',
    guest_Food: 'Yes'
  },
  {
    id: 2,
    title: 'Tech Talk 2026',
    eventOrganizingInstitution: 'SSEI',
    department: 'CSE',
    eventStartDate: '2025-07-01',
    eventEndDate: '2025-07-02',
    eventNature: 'Seminar',
    venueType: 'Offline',
    eventScope: 'National',
    fundingSource: 'Management',
    eventStartTime: '10:00',
    eventEndTime: '15:00',
    venue: 'Auditorium',
    intendedAudience: 'Both',
    leadCoOrdinator: 'Dr. Alice',
    facultyCoOrdinator: 'Prof. Bob',
    name_Of_The_Speaker: 'Mr. John Doe',
    designation: 'CTO',
    affiliated_Organization: 'Tech Corp',
    contactNumber: '1234567890',
    email: 'john@techcorp.com',
    estimated_Student_Participation: '150',
    estimated_Faculty_Participation: '30',
    total_Expected_Attendence: '180',
    guest_Accomodation: 'Yes',
    guest_Transportation: 'No',
    guest_Food: 'Yes'
  },
  {
    id: 3,
    title: 'Tech Talk 2027',
    eventOrganizingInstitution: 'SSEI',
    department: 'CSE',
    eventStartDate: '2025-07-01',
    eventEndDate: '2025-07-02',
    eventNature: 'Seminar',
    venueType: 'Offline',
    eventScope: 'National',
    fundingSource: 'Management',
    eventStartTime: '10:00',
    eventEndTime: '15:00',
    venue: 'Auditorium',
    intendedAudience: 'Both',
    leadCoOrdinator: 'Dr. Alice',
    facultyCoOrdinator: 'Prof. Bob',
    name_Of_The_Speaker: 'Mr. John Doe',
    designation: 'CTO',
    affiliated_Organization: 'Tech Corp',
    contactNumber: '1234567890',
    email: 'john@techcorp.com',
    estimated_Student_Participation: '150',
    estimated_Faculty_Participation: '30',
    total_Expected_Attendence: '180',
    guest_Accomodation: 'Yes',
    guest_Transportation: 'No',
    guest_Food: 'Yes'
  }
]

export default function EventCard() {
  const [selectedEvent, setSelectedEvent] = useState(null)

  return (
    <>
      {eventList.map(event => (
        <div
          key={event.id}
          className='card'
          onClick={() => setSelectedEvent(event)}>
          <div className='card-title'>{event.title}</div>
          <div className='card-row'>
            Institution: {event.eventOrganizingInstitution}
          </div>
          <div className='card-row'>Department: {event.department}</div>
          <div className='card-row'>
            Date: {event.eventStartDate} to {event.eventEndDate}
          </div>
          <div className='card-row'>Type: {event.eventNature}</div>
          <div className='card-buttons'>
            <button
              onClick={e => {
                e.stopPropagation()
                alert('Approved')
              }}>
              Approve
            </button>
            <button
              onClick={e => {
                e.stopPropagation()
                const msg = prompt('Enter your message:')
                if (msg) alert(`Sent message: ${msg}`)
              }}>
              Review
            </button>
          </div>
        </div>
      ))}

      {selectedEvent && (
        <div className='modal'>
          <div className='content'>
            <span
              className='close-btn'
              onClick={() => setSelectedEvent(null)}>
              &times;
            </span>
            <h2>Event Details</h2>
            <table>
              <tbody>
                {Object.entries(selectedEvent).map(([key, value]) => (
                  <tr key={key}>
                    <td style={{fontWeight: 'bold', paddingRight: '10px'}}>
                      {key
                        .replace(/([A-Z])/g, ' $1')
                        .replace(/_/g, ' ')
                        .replace(/\b\w/g, c => c.toUpperCase())}
                    </td>
                    <td>{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  )
}
