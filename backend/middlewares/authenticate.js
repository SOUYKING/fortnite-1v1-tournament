const axios = require('axios');

const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  try {
    const response = await axios.get('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const discordUser = response.data;

    // Attach real user data to req.user
    req.user = {
      discordId: discordUser.id,
      discordName: discordUser.username,
    };

    next(); // Proceed to the next middleware/route
  } catch (error) {
    console.error('Error verifying token:', error.message);
    res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

module.exports = authenticate;
