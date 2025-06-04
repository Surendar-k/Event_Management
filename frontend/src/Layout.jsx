// import React from 'react';
// import { Outlet, useLocation } from 'react-router-dom';
// import EventNav from './EventNav'; // Adjusted import path

// function Layout() {
//   const location = useLocation();

//   // Pages where you DON'T want EventNav
//   const noNavPages = ['/FilterEvents', '/checklist', '/login', '/signup'];

//   return (
//     <>
//       {!noNavPages.includes(location.pathname) && <EventNav />}
//       <Outlet />
//     </>
//   );
// }

// export default Layout;


import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import EventNav from './EventNav'; // Ensure this path is correct

function Layout() {
  const location = useLocation();

  // List of paths where EventNav should be HIDDEN
  const hideEventNavPaths = [
    '/login',        // Hide on login page
    '/FilterEvents', // Hide on filter events page
    '/checklist' , 
    '/'   // Hide on checklist page
  ];

  // Only show EventNav if current path is NOT in hideEventNavPaths
  const shouldShowEventNav = !hideEventNavPaths.includes(location.pathname);

  return (
    <>
      {shouldShowEventNav && <EventNav />}
      <Outlet />
    </>
  );
}

export default Layout;