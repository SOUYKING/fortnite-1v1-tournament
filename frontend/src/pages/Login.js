import React from 'react';
import './Login.css';

const Login = () => {
  const handleLogin = () => {
    const clientId = process.env.REACT_APP_DISCORD_CLIENT_ID;
    const redirectUri = encodeURIComponent(process.env.REACT_APP_DISCORD_REDIRECT_URL);

    if (!clientId || !redirectUri) {
      console.error('Environment variables for Discord login are not properly set!');
      return;
    }

    const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=identify`;
    window.location.href = discordAuthUrl;
  };

  return (
    <div className="login-container">
      <h1>Welcome to souy</h1>
      <button onClick={handleLogin} className="login-button">Login with Discord</button>
    </div>
  );
};

export default Login;
