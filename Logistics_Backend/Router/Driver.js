const express = require('express');
const router = express.Router();
const {
  signUpDriver,
  verifyOTPAndLogin,
  sendOTP,
  refreshAccessToken,
  logout,
  updateDriver,getAllDrivers,ApprovedStatus, getTotalDriverCount
} = require('../Controller/Driver');
const verifyAccessToken = require("../MiddileWare/authMiddeware"); // Assuming your controller file is in the 'controllers' folder
const multer = require('multer');
const cloudinaryUpload = require('../MiddileWare/driverCloudinary');

// Route for Driver Sign-Up
router.post('/signup', signUpDriver);

// Route for sending OTP to the driver
router.post('/send-otp', sendOTP);

// Route for verifying OTP and logging in the driver
router.post('/login', verifyOTPAndLogin);

// Route for refreshing the access token using refresh token
router.post('/refresh-token', refreshAccessToken);

// Update driver details route
const upload = multer();  // Don't need to specify 'dest' since files will be uploaded to Cloudinary

// Define the update route with image uploads
router.put('/update/:driverId', 
  verifyAccessToken,  // First, check the token
  upload.fields([  // Handle multiple file uploads (profilePic, licenseImage, aadhaarImage)
    { name: 'profilePic', maxCount: 1 },
    { name: 'licenseImage', maxCount: 1 },
    { name: 'aadhaarImage', maxCount: 1 }
  ]), 
  cloudinaryUpload,  // Upload images to Cloudinary
  updateDriver  // Use the controller function for the actual update logic
);


//GetAll
router.get('/getAll',verifyAccessToken, getAllDrivers); 


///status Approved
router.put('/approval/:_id',verifyAccessToken , ApprovedStatus);

// Route for logging out the driver
router.post('/logout', verifyAccessToken, logout);

router.get('/total-count',verifyAccessToken, getTotalDriverCount);

module.exports = router;
