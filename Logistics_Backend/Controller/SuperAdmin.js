
require('dotenv').config(); 
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const SuperAdmin = require("../Schema/SuperAdmin");

// Helper to generate tokens
const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "1d",
  });
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d",
  });
};

// Validation Middleware for signup
const signupValidation = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Please provide a valid email address"),
  body("contactNumber")
    .isLength({ min: 10, max: 10 })
    .withMessage("Contact number must be 10 digits"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

// Validation Middleware for login
const loginValidation = [
  body("email").isEmail().withMessage("Please provide a valid email address"),
  body("password").notEmpty().withMessage("Password is required"),
];

// Validation Middleware for refresh token
const refreshTokenValidation = [
  body("refreshToken").notEmpty().withMessage("Refresh token is required"),
];

// Signup Controller
exports.signup = [
  signupValidation,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, email, contactNumber, profilePic, password } = req.body;

      // Check if email already exists
      const existingUser = await SuperAdmin.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already registered" });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new Super Admin
      const superAdmin = new SuperAdmin({
        name,
        email,
        contactNumber,
        profilePic,
        password: hashedPassword,
      });

      await superAdmin.save();
      res.status(201).json({ message: "Signup successful", superAdmin });
    } catch (error) {
      res.status(500).json({ message: "Signup failed", error: error.message });
    }
  },
];

// Login Controller
exports.login = [
    loginValidation,
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      try {
        const { email, password } = req.body;
  
        // Find the Super Admin by email
        const superAdmin = await SuperAdmin.findOne({ email });
     
        if (!superAdmin) {
          return res.status(404).json({ message: "User not found" });
        }
  
        // Check password
        const isPasswordValid = await bcrypt.compare(password, superAdmin.password);
        if (!isPasswordValid) {
          return res.status(401).json({ message: "Invalid credentials" });
        }
  
        // Generate tokens
        const accessToken = generateAccessToken(superAdmin._id);
        const refreshToken = generateRefreshToken(superAdmin._id);
  
        // Save refresh token in the database
        superAdmin.refreshToken = refreshToken;
        await superAdmin.save();
  
        // Set the refresh token as an HTTP-only, Secure cookie
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production", // Use secure cookie in production
          sameSite: "Strict", // Prevent CSRF attacks
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.cookie('accessToken', accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production', // Set to true only in production
          sameSite: 'Strict', // Change to 'Lax' or 'None' if needed
          maxAge: 24 * 60 * 60 * 1000, // 1 day (24 hours)
      });
      
        // Send response with user details, access token, and refresh token
        res.status(200).json({
          message: "Login successful",
          user: {
            id: superAdmin._id,
            email: superAdmin.email,
            contactNumber: superAdmin.contactNumber,
          },
          accessToken,
          refreshToken, // Can be removed if you don't want to expose it in the response
        });
      } catch (error) {
        res.status(500).json({ message: "Login failed", error: error.message });
      }
    },
  ];
  

// Refresh Token Controller
exports.refreshToken = [
  refreshTokenValidation,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { refreshToken } = req.body;

      // Verify refresh token
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

      // Find the Super Admin by ID
      const superAdmin = await SuperAdmin.findById(decoded.userId);
      if (!superAdmin || superAdmin.refreshToken !== refreshToken) {
        return res.status(403).json({ message: "Invalid refresh token" });
      }

      // Generate a new access token
      const accessToken = generateAccessToken(superAdmin._id);

      res.status(200).json({
        message: "Access token refreshed",
        accessToken,
      });
    } catch (error) {
      res.status(403).json({ message: "Refresh token expired or invalid", error: error.message });
    }
  },
];

// Logout Controller
exports.logout = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required for logout" });
    }

    // Find the Super Admin by ID and clear the refresh token
    await SuperAdmin.findByIdAndUpdate(userId, { refreshToken: null });

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: "Logout failed", error: error.message });
  }
};






