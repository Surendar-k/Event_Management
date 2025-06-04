
import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Layout from './Layout.jsx';
import Navbar from './Navbar';
import Event from './pages/main/Main';
import Agenda from './pages/agenda/Agenda';
import FinancialPlanning from './pages/finacialPlanning/FinancialPlanning';
import FoodTravel from './pages/foodAndTravel/FoodAndTravel';
import EventForm from './pages/main/Main';
import InfrtechSetup from './pages/Infra/Infra.jsx';
import Others from './pages/others/Others';
import Login from './pages/login/Login.jsx'
import FilterEvents from './pages/filterevents/FilterEvents';
import Inbox from './pages/inbox/Inbox';
import EventNav from './EventNav';
import InfraTechSetup from './pages/Infra/Infra.jsx';
import DailyReport from './report_generation/DailyReport.jsx';
import ReportOverview from './report_generation/ReportOverview.jsx';
import SummaryReport from './report_generation/SummaryReport.jsx';
//import ErrorBoundary from './ErrorBoundary.jsx';

function App() {
  const location = useLocation();
  
  // Paths where both navbars should be hidden
  const hideAllNavsPaths = ["/", "/login", "/signup"];
  // Paths where only EventNav should be hidden
  const hideEventNavPaths = ["/FilterEvents"];

  // Check if current path requires hiding navbars
  const shouldHideAllNavs = hideAllNavsPaths.some(path => 
    location.pathname === path
  );
  const shouldHideEventNav = hideEventNavPaths.some(path => 
    location.pathname === path
  );

  return (
    <>
      {/* Main Navbar - hidden only on login/signup pages */}
      {!shouldHideAllNavs && <Navbar />}
      
      {/* Event Navbar - hidden on FilterEvents and login pages */}
      {!shouldHideAllNavs && !shouldHideEventNav && <EventNav />}

      {/* Main content area */}
      <div style={{
        width: '100%',
        minHeight: '100vh',
        background: 'white',
        margin: 0,
        padding: 0,
        overflowX: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <div style={{ 
          width: '100%', 
          maxWidth: '1200px', 
          padding: '20px' 
        }}>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Login />} />
              <Route path="/login" element={<Login />} />
              <Route path="/event" element={<Event />} />
              <Route path="/agenda" element={<Agenda />} />
              <Route path="/financialPlanning" element={<FinancialPlanning />} />
              <Route path="/infraTech" element={<InfraTechSetup />} />
              <Route path="/foodTravel" element={<FoodTravel />} />
              <Route path="/checklist" element={<Others />} />
              <Route path="/filterEvents" element={<FilterEvents/>} />
             <Route path="/dailyreport" element={<DailyReport />}/>
             <Route path="/reportoverview" element={<ReportOverview />}/>
             <Route path="/summary" element={<SummaryReport />}/>
              {/* //<ErrorBoundary> */}
              <Route path="/inbox" element={<Inbox />} />
              {/* //</ErrorBoundary> */}
              <Route path="*" element={<EventForm />} />
            </Route>
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;