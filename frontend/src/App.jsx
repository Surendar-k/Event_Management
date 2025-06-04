import React from 'react';
import { Route, Routes, useLocation, Navigate } from 'react-router-dom';

import Layout from './Layout.jsx';
import Navbar from './Navbar';
import Event from './pages/main/Main';
import Agenda from './pages/agenda/Agenda';
import FinancialPlanning from './pages/finacialPlanning/FinancialPlanning';
import FoodTravel from './pages/foodAndTravel/FoodAndTravel';
import EventForm from './pages/main/Main';
import InfrtechSetup from './pages/Infra/Infra.jsx';
import Others from './pages/others/Others';
import Login from './pages/login/Login.jsx';
import FilterEvents from './pages/filterevents/FilterEvents';
import Inbox from './pages/inbox/Inbox';
import EventNav from './EventNav';

import Report_Generation from './report_generation/Report_Generation.jsx';
import ReportOverview from './report_generation/ParticipantsInfo.jsx';
import Report from './report_generation/Report.jsx';
import SummaryReport from './report_generation/SummaryReport.jsx';
import ParticipantsInfo from './report_generation/ParticipantsInfo.jsx';

function App() {
  const location = useLocation();

  const hideAllNavsPaths = ["/", "/login", "/signup"];
  const hideEventNavPaths = ["/filterEvents"];

  const shouldHideAllNavs = hideAllNavsPaths.some(path => location.pathname === path);
  const shouldHideEventNav = hideEventNavPaths.some(path => location.pathname === path);

  return (
    <>
      {!shouldHideAllNavs && <Navbar />}
      {!shouldHideAllNavs && !shouldHideEventNav && <EventNav />}

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
              <Route path="/infraTech" element={<InfrtechSetup />} />
              <Route path="/foodTravel" element={<FoodTravel />} />
              <Route path="/checklist" element={<Others />} />
              <Route path="/filterEvents" element={<FilterEvents />} />
             
              {/* Report Generation route with nested routes */}
              <Route path="/reportgeneration" element={<Report_Generation />}>
                {/* Default route for /reportgeneration */}
                <Route index element={<Navigate to="report" replace />} />
                <Route path="participationinfo" element={<ParticipantsInfo />} />
                <Route path="report" element={<Report />} />
                <Route path="summary" element={<SummaryReport />} />
              </Route>
              
              <Route path="/inbox" element={<Inbox />} />
              <Route path="*" element={<EventForm />} />
            </Route>
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;