const express = require('express');
const axios = require('axios');
const { isAdmin } = require('../utils/discordAuth');
const router = express.Router();

// OAuth2 callback route
router.get('/callback', async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ message: 'Authorization code missing' });
  }

  try {
    // Exchange the authorization code for an access token
    const tokenResponse = await axios.post(
      'https://discord.com/api/oauth2/token',
      new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID,
        client_secret: process.env.DISCORD_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: process.env.DISCORD_CALLBACK_URL,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const { access_token } = tokenResponse.data;

    // Fetch user info from Discord
    const userResponse = await axios.get('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const discordUser = userResponse.data;

    // Construct the avatar URL
    const avatarUrl = discordUser.avatar
      ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`
      : `https://cdn.discordapp.com/embed/avatars/${parseInt(discordUser.discriminator) % 5}.png`;

    // Check if the user has the admin role
    const userIsAdmin = await isAdmin(discordUser.id, process.env.DISCORD_GUILD_ID);

    // Redirect the user to the frontend with their access token, username, Discord ID, avatar, and admin status
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(
      `${frontendUrl}/?accessToken=${encodeURIComponent(access_token)}&username=${encodeURIComponent(
        discordUser.username
      )}&discordId=${encodeURIComponent(discordUser.id)}&avatarUrl=${encodeURIComponent(
        avatarUrl
      )}&isAdmin=${userIsAdmin}`
    );
  } catch (error) {
    console.error('Error during OAuth callback:', error.response?.data || error.message);
    res.status(500).json({ message: 'Error processing the OAuth callback' });
  }
});

module.exports = router;
