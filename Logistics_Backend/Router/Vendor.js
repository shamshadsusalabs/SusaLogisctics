const express = require('express');
const router = express.Router();
const { signup, login, logout, refreshAccessToken, getAllVendors, ApprovedStatus, getById, updateVendor } = require('../Controller/Vendor');
const verifyAccessToken = require("../MiddileWare/authMiddeware"); 
const multer = require('multer');
const cloudinaryUpload = require('../MiddileWare/vendorCloudinary');

// Signup route
router.post('/signup', signup);

// Login route
router.post('/login', login);

// Logout route
router.post('/logout', logout);

// Refresh Token route
router.post('/refresh-token', refreshAccessToken);

// Get All Vendors
router.get('/getAlls', getAllVendors);

// Approve Vendor Status
router.put('/approval/:_id', verifyAccessToken, ApprovedStatus);

// Get Vendor By ID
router.get('/getbyId/:id', getById);

// Update Vendor Details route with file uploads (profilePic, gstImage, aadhaarImage)
const upload = multer(); // This should be configured to handle file storage, or use a memory storage if Cloudinary is used directly
router.put('/updateVendor/:id', upload.fields([
    { name: 'profilePic', maxCount: 1 },
    { name: 'gstImage', maxCount: 1 },
    { name: 'aadhaarImage', maxCount: 1 }
]), cloudinaryUpload, updateVendor);

module.exports = router;
