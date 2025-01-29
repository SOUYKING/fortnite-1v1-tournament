import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import './Matchmaking.css';

const Matchmaking = () => {
  const [match, setMatch] = useState(null);
  const [message, setMessage] = useState('');
  const socket = io('http://localhost:5000');

  useEffect(() => {
    socket.on('matchFound', (data) => {
      setMatch(data);
    });

    return () => socket.disconnect();
  }, []);

  const handleMessageSend = () => {
    socket.emit('chatMessage', message);
    setMessage('');
  };

  return (
    <div className="matchmaking-container">
      {match ? (
        <>
          <div className="player-info">
            <p><strong>Host:</strong> {match.host}</p>
            <p><strong>Player:</strong> {match.player}</p>
          </div>
          <div className="chat-container">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your message"
            />
            <button onClick={handleMessageSend}>Send</button>
          </div>
        </>
      ) : (
        <p>Waiting for a match...</p>
      )}
    </div>
  );
};

export default Matchmaking;
