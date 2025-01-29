import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CurrentGame.css';

const CurrentGame = ({ currentMatchId }) => {
  const navigate = useNavigate();

  return (
    <div className="current-game">
      {currentMatchId ? (
        <>
          <h2>You are in a game!</h2>
          <p>Match ID: {currentMatchId}</p>
          <button onClick={() => navigate(`/match/${currentMatchId}`)}>Go to Match</button>
        </>
      ) : (
        <div className="popup-container">
          <div className="popup">
            <h3>You are not in a game.</h3>
            <button onClick={() => navigate('/tournaments')}>Go to Tournaments</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrentGame;