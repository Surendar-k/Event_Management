import React from 'react';
import './EventNav.css';
import { 
  FaCalendarAlt,
  FaListAlt,
  FaMoneyBillWave,
  FaTools,
  FaUtensils,
  FaBusAlt,
  FaClipboardCheck
} from 'react-icons/fa';
import { NavLink, useLocation } from 'react-router-dom';

const EventNav = () => {
  const location = useLocation();

  // Show this navbar only on "/event" and its subroutes
  const isEventPath = location.pathname.startsWith('/event') ||
                      location.pathname.startsWith('/agenda') ||
                      location.pathname.startsWith('/financialPlanning') ||
                      location.pathname.startsWith('/infraTech') ||
                      location.pathname.startsWith('/foodTravel') ||
                      location.pathname.startsWith('/checklist');

  if (!isEventPath) return null; // Don't render anything

  const navItems = [
    { id: 'eventProposal', label: 'Event Info', icon: <FaCalendarAlt />, path: '/event' },
    { id: 'agenda', label: 'Agenda', icon: <FaListAlt />, path: '/agenda' },
    { id: 'financialPlanning', label: 'Financial Planning', icon: <FaMoneyBillWave />, path: '/financialPlanning' },
    { id: 'infraTech', label: 'Infra & Tech Setup', icon: <FaTools />, path: '/infraTech' },
    { id: 'foodTravel', label: 'Food & Travel', icon: <><FaUtensils /> <FaBusAlt /></>, path: '/foodTravel' },
    { id: 'checklist', label: 'Checklist', icon: <FaClipboardCheck />, path: '/checklist' }
  ];

  return (
    <div className="event-nav">
      {navItems.map(item => (
        <NavLink
          key={item.id}
          to={item.path}
          className={({ isActive }) => 
            `event-nav-item ${isActive ? 'active' : ''}`
          }
        >
          <span className="event-icon">{item.icon}</span>
          <span className="event-label">{item.label}</span>
        </NavLink>
      ))}
    </div>
  );
};

export default EventNav;
