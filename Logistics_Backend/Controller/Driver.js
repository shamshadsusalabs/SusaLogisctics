require('dotenv').config();
const Driver = require('../Schema/Driver'); // Import the Driver model
const crypto = require('crypto');
const axios = require('axios'); // Import Axios for making HTTP requests
const jwt = require("jsonwebtoken");
const twilio = require('twilio');

// Error handler utility
const handleError = (res, error, status = 500) => {
    return res.status(status).json({ message: error.message || 'Internal server error', error });
};

// Helper: Generate Random OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP

// OTP store (consider moving to Redis for scalability)
const otpStore = new Map();

// 1. Send OTP
const sendOTP = async (req, res) => {
    try {
        const { contactNumber } = req.body;

        if (!contactNumber) {
            return res.status(400).json({ message: 'Contact number is required.' });
        }

        // Step 1: Check if the contact number exists in the database
        const driver = await Driver.findOne({ contactNumber });
        if (!driver) return res.status(404).json({ message: 'Driver not found.' });

        // Step 2: Add +91 prefix if it's not already present
        let formattedContactNumber = contactNumber;
        if (!formattedContactNumber.startsWith('+91')) {
            formattedContactNumber = '+91' + formattedContactNumber; // Prefix with +91 if not already present
        }

        const otp = generateOTP();
        const hashedOTP = crypto.createHash('sha256').update(otp).digest('hex');
        const expiresAt = Date.now() + 5 * 60 * 1000; // OTP valid for 5 minutes

        otpStore.set(formattedContactNumber, { otp: hashedOTP, expiresAt });

        // Twilio Credentials from .env file
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        const fromNumber = process.env.TWILIO_PHONE_NUMBER;

        const client = twilio(accountSid, authToken);

        // Sending OTP via Twilio API
        const message = await client.messages.create({
            body: `Your OTP is: ${otp}`,
            from: fromNumber,        // Twilio phone number
            to: formattedContactNumber // The recipient phone number (with +91 prefix)
        });

        console.log(`OTP sent to ${formattedContactNumber}: ${otp}`);
        return res.status(200).json({ message: 'OTP sent successfully.' });

    } catch (error) {
        handleError(res, error);
    }
};

// Helper: Generate JWT Tokens
const generateTokens = (driverId) => {
    const accessToken = jwt.sign({ id: driverId }, process.env.JWT_SECRET, { expiresIn: '15d' });
    const refreshToken = jwt.sign({ id: driverId }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
    return { accessToken, refreshToken };
};

// 2. Verify OTP and Login

const verifyOTPAndLogin = async (req, res) => {
    try {
        const { contactNumber, otp } = req.body;

        console.log('Received contact number:', contactNumber); // Log received contact number
        console.log('Received OTP:', otp); // Log received OTP

        if (!contactNumber || !otp) {
            return res.status(400).json({ message: 'Contact number and OTP are required.' });
        }

        // Normalize the contact number with +91 prefix if not already present
        let formattedContactNumber = contactNumber;
        if (!formattedContactNumber.startsWith('+91')) {
            formattedContactNumber = '+91' + formattedContactNumber; // Prefix with +91 if not already present
        }

        const storedOTP = otpStore.get(formattedContactNumber); // Retrieve OTP using the formatted contact number
        console.log('Stored OTP for contact:', storedOTP);

        if (!storedOTP) {
            return res.status(400).json({ message: 'OTP not found or expired.' });
        }

        const hashedOTP = crypto.createHash('sha256').update(otp).digest('hex');
        console.log('Hashed OTP:', hashedOTP); // Log the hashed OTP for comparison

        // Compare OTP and expiration
        if (storedOTP.otp !== hashedOTP || Date.now() > storedOTP.expiresAt) {
            console.log('Invalid or expired OTP');
            return res.status(400).json({ message: 'Invalid or expired OTP.' });
        }

        otpStore.delete(formattedContactNumber); // Remove OTP after validation
        console.log('OTP validated and deleted from store for contact:', formattedContactNumber);

        const driver = await Driver.findOne({ contactNumber });
        console.log('Driver found:', driver); // Log the found driver document

        if (!driver) {
            return res.status(404).json({ message: 'Driver not found.' });
        }

        const { accessToken, refreshToken } = generateTokens(driver._id);
        console.log('Generated accessToken and refreshToken:', { accessToken, refreshToken }); // Log generated tokens

        driver.refreshToken = refreshToken;
        await driver.save();
        console.log('Driver refresh token saved in database.');

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Set to true only in production
            sameSite: 'Strict', // Change to 'Lax' or 'None' if needed
            maxAge: 24 * 60 * 60 * 1000, // 1 day (24 hours)
        });
        
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Set to true only in production
            sameSite: 'Strict', // Change to 'Lax' or 'None' if needed
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        

        console.log('Cookies set for accessToken and refreshToken.');

        // Sending the response with driver details and tokens
        res.status(200).json({
            message: 'Login successful.',
            id: driver._id,
            name: driver.name,
            aadhaarCard: driver.aadhaarCard,
            accessToken,
            refreshToken
        });
    } catch (error) {
        console.error('Error in verifyOTPAndLogin:', error); // Log any error
        handleError(res, error);
    }
};

// 3. Refresh Access Token
const refreshAccessToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken || req.body.refreshToken || req.query.refreshToken;
        if (!refreshToken) return res.status(401).json({ message: 'Refresh token is missing.' });

        jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, async (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Invalid refresh token.' });

            const driver = await Driver.findById(decoded.id);
            if (!driver || driver.refreshToken !== refreshToken) {
                return res.status(403).json({ message: 'Invalid refresh token.' });
            }

            const newAccessToken = jwt.sign({ id: driver._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

            // Set the new access token in the response cookies
            res.cookie('accessToken', newAccessToken, {
                httpOnly: true, 
                secure: process.env.NODE_ENV === 'production', // Only set secure in production
                sameSite: 'strict',
                maxAge: 15 * 60 * 1000, // 15 minutes
            });

            // Respond with the new access token in the response body as well
            res.status(200).json({
                message: 'New access token generated successfully.',
                accessToken: newAccessToken, // Send access token in response
            });
        });
    } catch (error) {
        handleError(res, error);
    }
};


// 4. Logout
const logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken || req.body.refreshToken || req.query.refreshToken;
        if (!refreshToken) return res.status(401).json({ message: 'Refresh token is missing.' });

        const decoded = jwt.decode(refreshToken);
        if (decoded && decoded.id) {
            const driver = await Driver.findById(decoded.id);
            if (driver) {
                driver.refreshToken = null;
                await driver.save();
            }
        }

        res.clearCookie('accessToken', { httpOnly: true, secure: true, sameSite: 'strict' });
        res.clearCookie('refreshToken', { httpOnly: true, secure: true, sameSite: 'strict' });

        res.status(200).json({ message: 'Logged out successfully.' });
    } catch (error) {
        handleError(res, error);
    }
};

// Sign-Up Controller
const signUpDriver = async (req, res) => {
    try {
        const { name, contactNumber, aadhaarCard, licenseNumber, driverNumber, address, profilePic, licenseImage, aadhaarImage, refreshToken } = req.body;

        // Validate required fields for sign-up
        if (!name || !contactNumber || !aadhaarCard || !licenseNumber) {
            return res.status(400).json({ message: 'Required fields are missing.' });
        }

        const newDriver = new Driver({
            name, contactNumber, aadhaarCard, licenseNumber,
            driverNumber: driverNumber || '', address: address || '', profilePic: profilePic || '', licenseImage: licenseImage || '', aadhaarImage: aadhaarImage || '',
            refreshToken: refreshToken || null,
        });

        const savedDriver = await newDriver.save();
        return res.status(201).json({ message: 'Driver signed up successfully.', data: savedDriver });
    } catch (error) {
        handleError(res, error, error.code === 11000 ? 400 : 500);
    }
};



// 9. Update Driver Details
const updateDriver = async (req, res) => {
    try {
        const { driverId } = req.params;  // Extract driverId from URL params
        const { name, contactNumber, aadhaarCard, licenseNumber, driverNumber, address, profilePic, licenseImage, aadhaarImage } = req.body;

        // Validate required fields
        if (!name || !contactNumber || !aadhaarCard || !licenseNumber) {
            return res.status(400).json({ message: 'Required fields are missing.' });
        }

        // Find the driver by driverId
        const driver = await Driver.findById(driverId);
        if (!driver) {
            return res.status(404).json({ message: 'Driver not found.' });
        }

        // Update the driver's information
        driver.name = name || driver.name;
        driver.contactNumber = contactNumber || driver.contactNumber;
        driver.aadhaarCard = aadhaarCard || driver.aadhaarCard;
        driver.licenseNumber = licenseNumber || driver.licenseNumber;
        driver.driverNumber = driverNumber || driver.driverNumber;
        driver.address = address || driver.address;
        driver.profilePic = profilePic || driver.profilePic;
        driver.licenseImage = licenseImage || driver.licenseImage;
        driver.aadhaarImage = aadhaarImage || driver.aadhaarImage;

        // Save the updated driver information
        const updatedDriver = await driver.save();

        return res.status(200).json({
            message: 'Driver details updated successfully.',
            data: updatedDriver
        });

    } catch (error) {
        res.status(500).json({ message: 'Error updating driver', error });
    }
};



// Controller function to get all drivers sorted by createdAt
const getAllDrivers = async (req, res) => {
    try {
        // Fetch all drivers sorted by createdAt in ascending order
        const drivers = await Driver.find().sort({ createdAt: -1 });

        if (drivers.length === 0) {
            return res.status(404).json({ message: 'No drivers found.' });
        }

        return res.status(200).json({
            message: 'Drivers fetched successfully.',
            data: drivers,
        });
    } catch (error) {
        handleError(res, error);
    }
};
const ApprovedStatus = async (req, res) => {
    const { _id } = req.params; // Extract driver ID from URL parameters
    const { isApproved } = req.body; // Extract approval status from request body
  
    if (typeof isApproved !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'Invalid value for isApproved. Must be a boolean.',
      });
    }
  
    try {
      const updatedDriver = await Driver.findByIdAndUpdate(
        _id,
        { approved: isApproved }, // Update the `approved` field
        { new: true } // Return the updated document
      );
  
      if (!updatedDriver) {
        return res.status(404).json({
          success: false,
          message: 'Driver not found.',
        });
      }
  
      return res.status(200).json({
        success: true,
        data: updatedDriver,
      });
    } catch (err) {
      console.error('Error updating approval status:', err);
      return res.status(500).json({
        success: false,
        message: 'An error occurred while updating approval status.',
      });
    }
  };
  
const getTotalDriverCount = async (req, res) => {
    try {
      const count = await Driver.countDocuments(); // Count the total number of driver documents
      res.status(200).json({
        message: 'Total number of drivers fetched successfully.',
        data: { count }
      });
    } catch (error) {
      console.error('Error fetching driver count:', error);
      res.status(500).json({ message: 'Server error while fetching driver count.' });
    }
  };

module.exports = { signUpDriver, verifyOTPAndLogin, sendOTP, refreshAccessToken, logout , updateDriver,getAllDrivers,ApprovedStatus, getTotalDriverCount};
