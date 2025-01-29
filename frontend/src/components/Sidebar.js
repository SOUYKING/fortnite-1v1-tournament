import React from 'react';
import { Link } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import FontAwesome for icons
import './Sidebar.css';

const Sidebar = () => {
  // Retrieve isAdmin from session storage
  const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');
  const isAdmin = userData.isAdmin === true || userData.isAdmin === 'true'; // Ensure it matches boolean or string

  return (
    <div className="sidebar">
      <h1 className="sidebar-logo">souy</h1>
      <ul className="sidebar-menu">
        <li><Link to="/tournaments"><i className="fas fa-trophy"></i> Tournaments</Link></li>
        <li><Link to="/current-game"><i className="fas fa-gamepad"></i> Current Game</Link></li>
        <li><Link to="/account"><i className="fas fa-user"></i> Account</Link></li>
        {isAdmin && <li><Link to="/admin-dashboard"><i className="fas fa-tools"></i> Admin Dashboard</Link></li>}
      </ul>
    </div>
  );
};

export default Sidebar;
