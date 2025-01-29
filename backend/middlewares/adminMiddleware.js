const { isAdmin } = require("../utils/discordAuth");

async function adminMiddleware(req, res, next) {
  const accessToken = req.headers.authorization?.split(" ")[1];
  if (!accessToken) return res.status(401).json({ message: "Unauthorized" });

  try {
    const isUserAdmin = await isAdmin(accessToken, process.env.DISCORD_GUILD_ID);
    if (!isUserAdmin) return res.status(403).json({ message: "Forbidden: Admins Only" });

    next();
  } catch (error) {
    res.status(500).json({ message: "Error validating admin role", error: error.message });
  }
}

module.exports = adminMiddleware;
