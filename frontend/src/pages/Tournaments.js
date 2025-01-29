import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Tournaments.css';

const Tournaments = () => {
  const [currentTournaments, setCurrentTournaments] = useState([]);
  const [pastTournaments, setPastTournaments] = useState([]);
  const [activeTab, setActiveTab] = useState('current');
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

  const handleJoinQueue = (tournamentId) => {
    // Navigate to the queue page
    navigate(`/queue/${tournamentId}`);
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

  const renderPastTournaments = () => {
    return pastTournaments.map((tournament) => (
      <div key={tournament._id} className="tournament-card">
        <img src={tournament.imageUrl} alt={tournament.title} className="tournament-image" />
        <h3>
          {tournament.title} [{new Date(tournament.startTime).toLocaleDateString()}]
        </h3>
        <p>{tournament.description}</p>
        <div className="tournament-actions">
          <button className="leaderboard-button">Leaderboard</button>
        </div>
      </div>
    ));
  };

  return (
    <div className="tournaments-container">
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
