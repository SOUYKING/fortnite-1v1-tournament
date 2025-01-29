import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('1v1');
  const [imageUrl, setImageUrl] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [message, setMessage] = useState('');
  const [currentTournaments, setCurrentTournaments] = useState([]);
  const [pastTournaments, setPastTournaments] = useState([]);

  const fetchTournaments = async () => {
    try {
      const currentResponse = await axios.get('http://localhost:5000/tournament/cups');
      const pastResponse = await axios.get('http://localhost:5000/tournament/past');
      setCurrentTournaments(currentResponse.data);
      setPastTournaments(pastResponse.data);
    } catch (error) {
      console.error('Error fetching tournaments:', error.message);
    }
  };

  useEffect(() => {
    fetchTournaments();
  }, []);

  const handleHostTournament = async () => {
    const token = JSON.parse(sessionStorage.getItem('userData')).accessToken;

    try {
      const response = await axios.post(
        'http://localhost:5000/tournament/host',
        {
          title,
          description,
          type,
          imageUrl,
          startTime,
          endTime,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(response.data.message);
      fetchTournaments();
    } catch (error) {
      console.error('Error hosting tournament:', error.message);
      setMessage('Failed to host tournament.');
    }
  };

  const handleCancelTournament = async (tournamentId) => {
    const token = JSON.parse(sessionStorage.getItem('userData')).accessToken;

    try {
      const response = await axios.post(
        'http://localhost:5000/tournament/cancel',
        { tournamentId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(response.data.message);
      fetchTournaments();
    } catch (error) {
      console.error('Error canceling tournament:', error.message);
      setMessage('Failed to cancel tournament.');
    }
  };

  const handleDeleteTournament = async (tournamentId) => {
    const token = JSON.parse(sessionStorage.getItem('userData')).accessToken;

    try {
      const response = await axios.delete(
        `http://localhost:5000/tournament/delete/${tournamentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(response.data.message);
      fetchTournaments();
    } catch (error) {
      console.error('Error deleting tournament:', error.message);
      setMessage('Failed to delete tournament.');
    }
  };

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>

      <div className="form-group">
        <label>Title</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea value={
description} onChange={(e) => setDescription(e.target.value)} /> </div>
  <div className="form-group">
    <label>Type</label>
    <select value={type} onChange={(e) => setType(e.target.value)}>
      <option value="1v1">1v1</option>
      <option value="2v2">2v2</option>
      <option value="3v3">3v3</option>
      <option value="4v4">4v4</option>
    </select>
  </div>

  <div className="form-group">
    <label>Image URL</label>
    <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
  </div>

  <div className="form-group">
    <label>Start Time</label>
    <input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
  </div>

  <div className="form-group">
    <label>End Time</label>
    <input type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
  </div>

  <button onClick={handleHostTournament}>Host Tournament</button>
  {message && <p>{message}</p>}

  <h2>Current Tournaments</h2>
  <div className="current-tournaments">
    {currentTournaments.map((tournament) => (
      <div key={tournament._id} className="tournament-card">
        <h3>{tournament.title}</h3>
        <p>{tournament.description}</p>
        <button onClick={() => handleCancelTournament(tournament._id)}>Cancel Tournament</button>
      </div>
    ))}
  </div>

  <h2>Past Tournaments</h2>
  <div className="past-tournaments">
    {pastTournaments.map((tournament) => (
      <div key={tournament._id} className="tournament-card">
        <h3>{tournament.title}</h3>
        <p>{tournament.description}</p>
        <button onClick={() => handleDeleteTournament(tournament._id)}>Delete Tournament</button>
      </div>
    ))}
  </div>
</div>
); };

export default AdminDashboard;