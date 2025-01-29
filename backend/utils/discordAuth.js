const axios = require('axios');

async function fetchDiscordUserRoles(userId, guildId) {
  try {
    const response = await axios.get(`https://discord.com/api/v10/guilds/${guildId}/members/${userId}`, {
      headers: {
        Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
      },
    });

    return response.data.roles; // Array of role IDs
  } catch (error) {
    console.error('Error fetching user roles:', error.response?.data || error.message);
    throw new Error('Failed to fetch user roles.');
  }
}

async function isAdmin(userId, guildId) {
  const roles = await fetchDiscordUserRoles(userId, guildId);
  return roles.includes(process.env.ADMIN_ROLE_ID); // Compare with admin role ID
}

module.exports = { isAdmin };
