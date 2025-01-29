import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Tournaments.css';

const Tournaments = () => {
  const [currentTournaments, setCurrentTournaments] = useState([]);
  const [pastTournaments, setPastTournaments] = useState([]);
  const [activeTab, setActiveTab] = useState('current');
  const [statusMessage, setStatusMessage] = useState('');
  const navigate = useNavigate();
  const now = new Date();

  useEffect(() => {
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

    fetchTournaments();
  }, []);

  const handleJoinQueue = async (tournamentId) => {
    const user = JSON.parse(sessionStorage.getItem('userData'));
    if (!user) {
      setStatusMessage('You must be logged in to join the queue.');
      return;
    }

    try {
      // Check if the user is already in a game
      const { data } = await axios.get(`http://localhost:5000/matchmaking/status?username=${user.username}`);

      if (data.status === 'inGame') {
        setStatusMessage('⚠️ You are already in a match! Finish or leave before joining a new one.');
        return;
      }

      // If not in a game, allow joining the queue
      navigate(`/queue/${tournamentId}`);

    } catch (error) {
      console.error('Error checking matchmaking status:', error.message);
      setStatusMessage('⚠️ Error checking matchmaking status.');
    }
  };

  const renderCurrentTournaments = () => {
    return currentTournaments.map((tournament) => {
      const hasStarted = new Date(tournament.startTime) <= now;
      const hasEnded = new Date(tournament.endTime) < now;

      return (
        <div key={tournament._id} className="tournament-card">
          <img src={tournament.imageUrl} alt={tournament.title} className="tournament-image" />
          <h3>
            {tournament.title} [{new Date(tournament.startTime).toLocaleDateString()}]
          </h3>
          <p>{tournament.description}</p>
          <p>
            <strong>Start:</strong> {new Date(tournament.startTime).toLocaleString()}
          </p>
          <p>
            <strong>End:</strong> {new Date(tournament.endTime).toLocaleString()}
          </p>
          <div className="tournament-actions">
            <button
              className="join-button"
              disabled={!hasStarted || hasEnded}
              title={
                !hasStarted
                  ? 'Tournament has not started yet.'
                  : hasEnded
                  ? 'Tournament has ended.'
                  : ''
              }
              onClick={() => handleJoinQueue(tournament._id)}
            >
              Join Queue
            </button>
            <button className="leaderboard-button">Leaderboard</button>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="tournaments-container">
      {statusMessage && <p className="error-message">{statusMessage}</p>}

      <div className="tabs">
        <button
          className={`tab-button ${activeTab === 'current' ? 'active' : ''}`}
          onClick={() => setActiveTab('current')}
        >
          All Cups
        </button>
        <button
          className={`tab-button ${activeTab === 'past' ? 'active' : ''}`}
          onClick={() => setActiveTab('past')}
        >
          Past Cups
        </button>
      </div>

      <div className="tournaments-list">
        {activeTab === 'current' && renderCurrentTournaments()}
        {activeTab === 'past' && renderPastTournaments()}
      </div>
    </div>
  );
};

export default Tournaments;
