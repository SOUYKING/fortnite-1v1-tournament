import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Account.css';

const Account = () => {
  const [userData, setUserData] = useState(null);
  const [epicGamesName, setEpicGamesName] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const token = sessionStorage.getItem('userData')
        ? JSON.parse(sessionStorage.getItem('userData')).accessToken
        : null;

      if (!token) return;

      try {
        const response = await axios.get('http://localhost:5000/account', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUserData(response.data);
        setEpicGamesName(response.data.epicGamesName || '');
      } catch (err) {
        console.error('Error fetching user data:', err.message);
        setErrorMessage('Failed to load account data.');
      }
    };

    fetchData();
  }, []);

  const handleUpdate = async () => {
    const token = sessionStorage.getItem('userData')
      ? JSON.parse(sessionStorage.getItem('userData')).accessToken
      : null;

    if (!token) return;

    try {
      const response = await axios.post(
        'http://localhost:5000/account/update',
        { epicGamesName },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccessMessage(response.data.message);
      setErrorMessage('');
    } catch (err) {
      console.error('Error updating Epic Games Name:', err.response?.data?.message || err.message);
      setErrorMessage(err.response?.data?.message || 'Failed to update Epic Games Name.');
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = '/'; // Redirect to login page or homepage
  };

  if (!userData) return <p>Loading...</p>;

  return (
    <div className="account-container">
      <h2>Account</h2>

      <div className="account-section">
        <h3>Discord</h3>
        <p><strong>Discord Username:</strong> {userData.discordName}</p>
        <p><strong>Discord ID:</strong> {userData.discordId}</p>
      </div>

      <div className="account-section">
        <h3>Epic Games</h3>
        <input
          type="text"
          placeholder="Enter Epic Games Username"
          value={epicGamesName}
          onChange={(e) => setEpicGamesName(e.target.value)}
        />
      </div>

      <div className="account-section">
        <h3>Game Statistics</h3>
        <p><strong>Wins:</strong> {userData.wins}</p>
        <p><strong>Losses:</strong> {userData.losses}</p>
      </div>

      <div className="button-group">
        <button onClick={handleUpdate} className="update-button">Update</button>
        <button onClick={handleLogout} className="logout-button">Log Out</button>
      </div>

      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};

export default Account;
