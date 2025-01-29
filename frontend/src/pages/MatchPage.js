import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import './MatchPage.css';

const socket = io('http://localhost:5000'); // Backend URL

const MatchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { self, opponent } = location.state || {};
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (!self) {
      navigate('/tournaments');
      return;
    }

    const matchId = `${self.id}-${opponent?.id}`;

    // Store match state in session storage
    sessionStorage.setItem('currentMatch', JSON.stringify({ matchId, self, opponent }));

    socket.emit('joinMatch', { matchId });

    socket.on('receiveMessage', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, [self, opponent, navigate]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const matchId = `${self.id}-${opponent?.id}`;
      socket.emit('sendMessage', {
        matchId,
        message: newMessage,
        sender: self.username,
      });
      setNewMessage('');
    }
  };

  const handleLeaveMatch = () => {
    const matchId = `${self.id}-${opponent?.id}`;
    socket.emit('leaveMatch', { matchId });
    sessionStorage.removeItem('currentMatch');
    navigate('/tournaments');
  };

  return (
    <div className="match-page">
      <h1>Match Page</h1>
      <div className="players">
        <div className="player">
          <img src={self?.avatarUrl || '/default-avatar.png'} alt="Your Avatar" className="avatar" />
          <h3>{self?.epicName || 'Your Name'}</h3>
        </div>
        <h2>VS</h2>
        <div className="player">
          <img
            src={opponent?.avatarUrl || '/default-avatar.png'}
            alt="Opponent Avatar"
            className="avatar"
          />
          <h3>{opponent?.epicName || 'Waiting for opponent...'}</h3>
        </div>
      </div>

      <div className="chat">
        <div className="chat-messages">
          {messages.map((msg, index) => (
            <p key={index}>
              <strong>{msg.sender}:</strong> {msg.message}
            </p>
          ))}
        </div>
        <div className="chat-input">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>
      <button onClick={handleLeaveMatch}>Leave Match</button>
    </div>
  );
};

export default MatchPage;