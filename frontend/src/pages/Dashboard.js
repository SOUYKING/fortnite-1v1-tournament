import React from 'react';

const Dashboard = () => {
  const params = new URLSearchParams(window.location.search);
  const username = params.get('username');

  return (
    <div>
      <h2>Welcome to the Dashboard</h2>
      <p>Hello, {username}! Explore your tournaments, leaderboards, and more.</p>
    </div>
  );
};

export default Dashboard;
