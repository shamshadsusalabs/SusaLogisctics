const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  refreshToken,
  logout,
 

} = require("../Controller/SuperAdmin");
const verifyAccessToken = require("../MiddileWare/authMiddeware");

// Public Routes
router.post("/signup",  signup);  // Signup
router.post("/login",  login);  // Login

// Protected Routes (requires valid access token)
router.post("/refresh-token",  refreshToken);  // Refresh Token
router.post("/logout", verifyAccessToken, logout);  // Logout

module.exports = router;
