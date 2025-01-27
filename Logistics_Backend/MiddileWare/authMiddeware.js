// Middleware to verify the access token
require('dotenv').config();
const jwt = require("jsonwebtoken");

const verifyAccessToken = (req, res, next) => {
  let token;

  // Check Authorization header
  if (req.header("Authorization")) {
    token = req.header("Authorization").replace("Bearer ", "");
  }
  
  // Check cookies (useful for client-side JWT storage)
  if (!token && req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  // Check request body (useful in POST requests or mobile apps)
  if (!token && req.body && req.body.token) {
    token = req.body.token;
  }

  if (!token) {
    return res.status(401).json({ message: "Access token is required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId; // Attach userId to request
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired access token", error: error.message });
  }
};


module.exports = verifyAccessToken;
