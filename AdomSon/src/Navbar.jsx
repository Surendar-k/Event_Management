import React, { useState, useEffect, useRef } from "react";
import "./Navbar.css";
import {
  FaUserCircle,
  FaCalendarAlt,
  FaListAlt,
  FaMoneyBillWave,
  FaTools,
  FaUtensils,
  FaBusAlt,
  FaClipboardCheck,
  FaBars,
  FaTimes,
  FaChevronDown,
  FaChevronUp
} from "react-icons/fa";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
//import userData from "./data/user.json";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState({
    name: "Loading...",
    profilePic: null,
    email: "user@example.com"
  });
  const [showMenu, setShowMenu] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCreateEventExpanded, setIsCreateEventExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
        setIsCreateEventExpanded(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // useEffect(() => {
  //   const fetchUser = async () => {
  //     const storedUser = JSON.parse(localStorage.getItem("userData"));
  //     const loggedInUserEmail = storedUser?.email;
  
  //     if (!loggedInUserEmail) {
  //       setUser({
  //         name: "Guest User",
  //         email: "guest@example.com",
  //         profilePic: null
  //       });
  //       return;
  //     }
  
  //     try {
  //       const response = await fetch(`http://localhost:1045/event/user?email=${loggedInUserEmail}`);
  //       const data = await response.json();
  
  //       if (response.ok) {
  //         setUser({
  //           name: data.name,
  //           email: data.email,
  //           profilePic: data.profilePic || null
  //         });
  //       } else {
  //         setUser({
  //           name: "Guest User",
  //           email: "guest@example.com",
  //           profilePic: null
  //         });
  //       }
  //     } catch (error) {
  //       console.error("Error fetching user:", error);
  //       setUser({
  //         name: "Guest User",
  //         email: "guest@example.com",
  //         profilePic: null
  //       });
  //     }
  //   };
  
  //   fetchUser();
  // }, []);
useEffect(() => {
  const storedUserData = JSON.parse(localStorage.getItem("userData"));
  const userObj = storedUserData?.user;

  if (userObj) {
    setUser({
      name: userObj.name || "Guest User",
      email: userObj.email || "guest@example.com",
      profilePic: userObj.profilePic || null
    });
  } else {
    setUser({
      name: "Guest User",
      email: "guest@example.com",
      profilePic: null
    });
  }
}, []);



  const getInitialTab = () => {
    const path = location.pathname;
    if (path === "/FilterEvents") return "generation";
    if (path === "/event") return "create";
    if (path === "/Inbox") return "inbox-msg";

    return "report";
  };

  const [selected, setSelected] = useState(getInitialTab());

  useEffect(() => {
    const path = location.pathname;
    const isEventSubPath = eventNavItems.some(item => path.startsWith(item.path));
    
    if (isEventSubPath) {
      setSelected('create');
    } else if (path === '/FilterEvents') {
      setSelected('generation');
    } else if (path === '/Inbox') {
      setSelected('inbox-msg');
    } else {
      setSelected('/event');
    }
  }, [location.pathname]);

  const eventNavItems = [
    {
      id: "eventProposal",
      label: "Event Info",
      icon: <FaCalendarAlt />,
      path: "/event"
    },
    {
      id: "agenda",
      label: "Agenda",
      icon: <FaListAlt />,
      path: "/agenda"
    },
    {
      id: "financialPlanning",
      label: "Financial Planning",
      icon: <FaMoneyBillWave />,
      path: "/financialPlanning"
    },
    {
      id: "infraTech",
      label: "Infra & Tech Setup",
      icon: <FaTools />,
      path: "/infraTech"
    },
    {
      id: "foodTravel",
      label: "Food & Travel",
      icon: (
        <>
          <FaUtensils /> <FaBusAlt />
        </>
      ),
      path: "/foodTravel"
    },
    {
      id: "checklist",
      label: "Checklist",
      icon: <FaClipboardCheck />,
      path: "/checklist"
    }
  ];

  // Define routes where EventNav should NOT appear
  const noEventNavRoutes = ["/FilterEvents"];

  const handleCreateEventClick = () => {
    if (isMobile) {
      setIsCreateEventExpanded(!isCreateEventExpanded);
    } else {
      setSelected("create");
      navigate("/event");
    }
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleLogout = () => {
    console.log("Logging out...");
    localStorage.removeItem('userEmail'); // Clear the stored email
    navigate("/login");
  };

  const handleChangePassword = () => {
    setShowPasswordModal(true);
    setShowMenu(false);
  };

  return (
    <>
      <nav className="navbar">
        {isMobile ? (
          <>
            <div className="mobile-menu-icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
            </div>
            <div className="navbar-center-mobile">
              <img src="/logo.png" alt="Logo" className="logo" />
            </div>
            <div className="navbar-right" ref={dropdownRef}>
              <div className="profile-container" onClick={toggleMenu}>
                {user.profilePic ? (
                  <img src={user.profilePic} alt="Profile" className="profile-pic" />
                ) : (
                  <FaUserCircle className="user-icon" />
                )}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="navbar-left">
              <img src="/logo1.png" alt="Logo" className="logo" />
            </div>

            <div className="navbar-center">
              <button
                className={`nav-option ${selected === "create" ? "selected" : ""}`}
                onClick={handleCreateEventClick}
              >
                Create Event
              </button>

              <button
                className={`nav-option ${selected === "generation" ? "selected" : ""}`}
                onClick={() => {
                  setSelected("generation");
                  navigate("/FilterEvents");
                }}
              >
                Report Generation
              </button>

              <button
                className={`nav-option ${selected === "report" ? "selected" : ""}`}
                onClick={() => {
                  setSelected("report");
                  navigate("/FilterEvents");
                }}
              >
                Report
              </button>

              <button
                className={`nav-option ${selected === "inbox-msg" ? "selected" : ""}`}
                onClick={() => {
                  setSelected("inbox-msg");
                  navigate("/Inbox");
                }}
              >
                Inbox
              </button>
            </div>

            <div className="navbar-right" ref={dropdownRef}>
              <div className="profile-container" onClick={toggleMenu}>
                {user.profilePic ? (
                  <img src={user.profilePic} alt="Profile" className="profile-pic" />
                ) : (
                  <FaUserCircle className="user-icon" />
                )}
                <span className="username">
                  {user.name} <span className="dropdown-arrow">▼</span>
                </span>
              </div>

              {showMenu && (
                <div className={`dropdown-menu ${showMenu ? "show" : ""}`}>
                  <button className="dropdown-item" onClick={handleChangePassword}>
                    Change Password
                  </button>
                  <button className="dropdown-item logout" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </nav>

      {/* Mobile Menu */}
      {isMobile && isMobileMenuOpen && (
        <div className="mobile-menu">
          <div 
            className={`mobile-menu-item ${selected === "create" ? "selected" : ""}`}
            onClick={handleCreateEventClick}
          >
            <div className="mobile-menu-header">
              Create Event
              {isCreateEventExpanded ? <FaChevronUp /> : <FaChevronDown />}
            </div>
            {isCreateEventExpanded && (
              <div className="mobile-submenu">
                {eventNavItems.map(item => (
                  <NavLink
                    key={item.id}
                    to={item.path}
                    className={({ isActive }) =>
                      `mobile-submenu-item ${isActive ? "active" : ""}`
                    }
                    onClick={() => {
                      setSelected("create");
                      setIsMobileMenuOpen(false);
                      setIsCreateEventExpanded(false);
                    }}
                  >
                    <span className="mobile-submenu-icon">{item.icon}</span>
                    <span className="mobile-submenu-label">{item.label}</span>
                  </NavLink>
                ))}
              </div>
            )}
          </div>

          <button
            className={`mobile-menu-item ${selected === "generation" ? "selected" : ""}`}
            onClick={() => {
              setSelected("generation");
              navigate("/FilterEvents");
              setIsMobileMenuOpen(false);
            }}
          >
            Report Generation
          </button>

          <button
            className={`mobile-menu-item ${selected === "report" ? "selected" : ""}`}
            onClick={() => {
              setSelected("report");
              navigate("/FilterEvents");
              setIsMobileMenuOpen(false);
            }}
          >
            Report
          </button>
        </div>
      )}

      {/* EventNav Section - Desktop only */}
      {!isMobile && !noEventNavRoutes.includes(location.pathname) && (
        <div className="event-nav">
          {eventNavItems.map(item => (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) =>
                `event-nav-item ${isActive ? "active" : ""}`
              }
            >
              <span className="event-icon">{item.icon}</span>
              <span className="event-label">{item.label}</span>
            </NavLink>
          ))}
        </div>
      )}

      {showPasswordModal && (
        <ChangePasswordModal
          userEmail={user.email}
          onClose={() => setShowPasswordModal(false)}
        />
      )}
    </>
  );
};

const ChangePasswordModal = ({ userEmail, onClose }) => {
  const [formData, setFormData] = useState({
    email: userEmail,
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (formData.newPassword !== formData.confirmPassword) {
      return setError("New passwords don't match");
    }

    try {
      setIsLoading(true);
      const response = await fetch("/api/auth/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setError(data.message || "Failed to change password");
      }
    } catch (err) {
      setError("Failed to connect to server");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <button className="modal-close" onClick={onClose}>×</button>
        <h2>Change Password</h2>
        
        {success ? (
          <div className="success-message">
            Password changed successfully!
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled
                placeholder=" "
              />
              <label htmlFor="email">Email</label>
            </div>
            
            <div className="form-group">
              <input
                id="oldPassword"
                type="password"
                name="oldPassword"
                value={formData.oldPassword}
                onChange={handleChange}
                required
                placeholder=" "
              />
              <label htmlFor="oldPassword">Current Password</label>
            </div>
            
            <div className="form-group">
              <input
                id="newPassword"
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                required
                minLength="8"
                placeholder=" "
              />
              <label htmlFor="newPassword">New Password</label>
            </div>
            
            <div className="form-group">
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder=" "
              />
              <label htmlFor="confirmPassword">Confirm New Password</label>
            </div>
            
            {error && <div className="error-message">{error}</div>}
            
            <button 
              type="submit" 
              className="submit-btn"
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Change Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Navbar;