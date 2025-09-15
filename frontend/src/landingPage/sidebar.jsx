import React from 'react';
import { Link,NavLink,useNavigate } from 'react-router-dom';
import { FaTachometerAlt, FaUser, FaSignOutAlt } from 'react-icons/fa'; // Example icons
import './sidebar.css'; 

const Sidebar = () => {

  const navigate = useNavigate();

  const handleLogout = () => {
    // 1. Remove the authentication token from storage.
    // This is the most important step to "forget" the user.
    localStorage.removeItem('authToken');

    // 2. Remove the stored user information.
    localStorage.removeItem('user');

    // 3. Redirect the user to the login page (the homepage).
    navigate('/');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        Placement Cell
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li>
            <NavLink to="/student/dashboard">
              <FaTachometerAlt /> <span>Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/student/profile">
              <FaUser /> <span>My Profile</span>
            </NavLink>
          </li>
        </ul>
      </nav>
      {/* 5. Add the logout button at the end */}
      <div className="sidebar-footer">
        <button onClick={handleLogout} className="logout-button">
          <FaSignOutAlt /> <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;