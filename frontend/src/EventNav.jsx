import React from 'react';
import './EventNav.css';
import { 
  FaCalendarAlt,     // For event-related items
  FaListAlt,         // Agenda
  FaMoneyBillWave,   // Financial Planning
  FaTools,           // Infra & Tech Setup
  FaUtensils,        // Food
  FaBusAlt,          // Travel
  FaClipboardCheck   // Checklist
} from 'react-icons/fa';
import { NavLink, useLocation } from 'react-router-dom';

const EventNav = () => {
  const navItems = [
    {
      id: 'eventProposal', 
      label: 'Event Info', 
      icon: <FaCalendarAlt />,
      path: '/event' 
    },
    { 
      id: 'agenda', 
      label: 'Agenda', 
      icon: <FaListAlt />,
      path: '/agenda' 
    },
    { 
      id: 'financialPlanning', 
      label: 'Financial Planning', 
      icon: <FaMoneyBillWave />,
      path: '/financialPlanning' 
    },
    { 
      id: 'infraTech', 
      label: 'Infra & Tech Setup', 
      icon: <FaTools />,
      path: '/infraTech' 
    },
    { 
      id: 'foodTravel', 
      label: 'Food & Travel', 
      icon: <><FaUtensils /> <FaBusAlt /></>,
      path: '/foodTravel' 
    },
    { 
      id: 'checklist', 
      label: 'Checklist', 
      icon: <FaClipboardCheck />,
      path: '/checklist' 
    }
  ];

  const location = useLocation();

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
