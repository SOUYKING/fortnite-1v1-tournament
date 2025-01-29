import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CurrentGame = () => {
  const navigate = useNavigate();
  const [isInMatch, setIsInMatch] = useState(false);

  useEffect(() => {
    const currentMatch = JSON.parse(sessionStorage.getItem('currentMatch'));
    if (currentMatch) {
      setIsInMatch(true);
      navigate(`/match/${currentMatch.matchId}`, {
        state: { self: currentMatch.self, opponent: currentMatch.opponent },
      });
    } else {
      setIsInMatch(false);
    }
  }, [navigate]);

  return (
    <div>
      {!isInMatch && (
        <div className="popup-container">
          <div className="popup">
            <h3>You are currently not participating in any active game</h3>
            <button onClick={() => navigate('/tournaments')}>Ok</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrentGame;
