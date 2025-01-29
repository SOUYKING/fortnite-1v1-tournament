import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:5000');

const QueuePage = () => {
  const navigate = useNavigate();
  const [statusMessage, setStatusMessage] = useState('Click to join the queue.');

  useEffect(() => {
    socket.on('matchFound', (data) => {
      sessionStorage.setItem('currentMatch', JSON.stringify(data));
      navigate(`/match/${data.matchId}`, { state: { self: data.self, opponent: data.opponent } });
    });

    socket.on('alreadyInGame', () => {
      navigate('/current-game');
    });

    socket.on('alreadyInQueue', () => {
      setStatusMessage('You are already in the queue.');
    });

    socket.on('waiting', (data) => {
      setStatusMessage(data.message);
    });

    return () => {
      socket.off('matchFound');
      socket.off('alreadyInGame');
      socket.off('alreadyInQueue');
      socket.off('waiting');
    };
  }, [navigate]);

  const handleJoinQueue = async () => {
    const user = JSON.parse(sessionStorage.getItem('userData'));
    if (user) {
      const { data } = await axios.get('http://localhost:5000/matchmaking/status', {
        params: { username: user.username },
      });

      if (data.status === 'inGame') {
        setStatusMessage('You are already in a game.');
        navigate('/current-game');
      } else if (data.status === 'inQueue') {
        setStatusMessage('You are already in the queue.');
      } else {
        socket.emit('joinQueue', {
          username: user.username,
          discordId: user.discordId,
          epicName: user.epicName,
          tournamentId: '12345',
        });
        setStatusMessage('You are in the queue. Waiting for another player...');
      }
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>{statusMessage}</h2>
      <button onClick={handleJoinQueue}>Join Queue</button>
    </div>
  );
};

export default QueuePage;
