import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Tournaments from './pages/Tournaments';
import Account from './pages/Account';
import AdminDashboard from './pages/AdminDashboard';
import Leaderboard from './pages/Leaderboard';
import QueuePage from './pages/QueuePage';
import MatchPage from './pages/MatchPage';
import CurrentGame from './pages/CurrentGame'; // Add the current game page
import './App.css';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('accessToken');
    const username = params.get('username');
    const avatarUrl = params.get('avatarUrl');
    const discordId = params.get('discordId');
    const adminStatus = params.get('isAdmin') === 'true';

    if (accessToken && username) {
      sessionStorage.setItem(
        'userData',
        JSON.stringify({
          accessToken,
          username,
          avatarUrl,
          discordId,
          isAdmin: adminStatus,
        })
      );
      setIsAuthenticated(true);
      setIsAdmin(adminStatus);
      window.history.replaceState({}, document.title, '/dashboard');
    } else {
      const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');
      setIsAuthenticated(!!userData.accessToken);
      setIsAdmin(userData.isAdmin === true || userData.isAdmin === 'true');
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    setIsAuthenticated(false);
    setIsAdmin(false);
  };

  return (
    <Router>
      {isAuthenticated ? (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#121212' }}>
          <Sidebar onLogout={handleLogout} />
          <div className="main-content">
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/tournaments" element={<Tournaments />} />
              <Route path="/queue/:tournamentId" element={<QueuePage />} />
              <Route path="/match/:matchId" element={<MatchPage />} />
              <Route path="/current-game" element={<CurrentGame />} />
              <Route path="/account" element={<Account />} />
              {isAdmin && <Route path="/admin-dashboard" element={<AdminDashboard />} />}
              <Route path="/tournament/:id/leaderboard" element={<Leaderboard />} />
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
          </div>
        </div>
      ) : (
        <Routes>
          <Route path="*" element={<Login />} />
        </Routes>
      )}
    </Router>
  );
};

export default App;
