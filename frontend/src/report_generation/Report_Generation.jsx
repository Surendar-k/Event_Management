import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { FaChartLine, FaRegCalendarCheck, FaFileAlt } from 'react-icons/fa';

const reportNavItems = [
  { id: 'reportOverview', label: 'Participation Info', icon: <FaChartLine />, path: 'participationinfo' },
  { id: 'report', label: 'Report', icon: <FaRegCalendarCheck />, path: 'report' },
  { id: 'summaryReport', label: 'Summary', icon: <FaFileAlt />, path: 'summary' }
];

const Report_Generation = () => {
  const location = useLocation();

  return (
    <div className="report-generation-container">
      {/* Secondary Nav */}
      <nav className="event-nav" style={{ marginBottom: 30 }}>
        {reportNavItems.map(item => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) =>
              `event-nav-item ${isActive ? 'active' : ''}`
            }
            style={{
              marginRight: 20,
              padding: '10px 16px',
              textDecoration: 'none',
              color: '#575757', // changed color to dark gray
              borderBottom: location.pathname.endsWith(item.path) ? '3px solidrgb(13, 12, 12)' : 'none', // dark gray border
              fontWeight: location.pathname.endsWith(item.path) ? '700' : '500',
              transition: 'background-color 0.3s ease'
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#dedede'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <span style={{ marginRight: 6 }}>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* This renders the matched child route */}
      <Outlet />
    </div>
  );
};

export default Report_Generation;
