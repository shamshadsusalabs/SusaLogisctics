const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Operator = require('../Schema/Operator'); // Adjust path as needed
require('dotenv').config();
const validator = require('validator');
// Function to generate access and refresh tokens
const generateTokens = (OperatorId) => {
    const accessToken = jwt.sign({ id: OperatorId }, process.env.JWT_SECRET, { expiresIn: '1d' });
    const refreshToken = jwt.sign({ id: OperatorId }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
    return { accessToken, refreshToken };
};

const signup = async (req, res) => {
    const { name, email, password, contactNumber } = req.body;

    try {
        // Validation for required fields
        if (!name || !email || !password || !contactNumber) {
            return res.status(400).json({ message: 'All fields are required: name, email, password, contactNumber' });
        }

        // Email validation
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        // Contact number validation (adjust as needed)
        if (!validator.isMobilePhone(contactNumber, 'any', { strictMode: false })) {
            return res.status(400).json({ message: 'Invalid contact number' });
        }

        // Check if the operator with this email already exists
        const existingOperatorEmail = await Operator.findOne({ email });
        if (existingOperatorEmail) {
            return res.status(400).json({ message: 'Operator with this email already exists' });
        }

        // Check if the operator with this contact number already exists
        const existingOperatorContact = await Operator.findOne({ contactNumber });
        if (existingOperatorContact) {
            return res.status(400).json({ message: 'Operator with this contact number already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new Operator
        const newOperator = new Operator({
            name,
            email,
            password: hashedPassword,
            contactNumber,
        });

        // Save the new Operator in the database
        await newOperator.save();

        // Send response
        res.status(201).json({ message: 'Operator registered successfully' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error occurred while registering the Operator' });
    }
};



const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if  Operator exists
        const existingOperator = await  Operator.findOne({ email });
        if (!existingOperator) {
            return res.status(400).json({ message: ' Operator not found' });
        }

        // Compare the password
        const isMatch = await bcrypt.compare(password, existingOperator.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate tokens
        const { accessToken, refreshToken } = generateTokens(existingOperator._id);

        // Save the refresh token to the database
        existingOperator.refreshToken = refreshToken;
        await existingOperator.save();

        // Set the refresh token in an HTTP-only cookie with 7-day expiration
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true, // Make it HTTP-only
            secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
            sameSite: 'Strict' // To prevent CSRF attacks
        });

        // Set the access token in a cookie (optional, you can make it httpOnly if needed)
        res.cookie('accessToken', accessToken, {
            httpOnly: false, // Access token accessible in JavaScript if required
            secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
            maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
            sameSite: 'Strict' // To prevent CSRF attacks
        });

        // Send response with  Operator details and tokens
        res.status(200).json({
            accessToken,
            refreshToken,
            user: {
                _id: existingOperator._id,
                email: existingOperator.email,
                contactNumber: existingOperator.contactNumber,
            },
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Refresh Token Controller
const refreshAccessToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken || req.body.refreshToken || req.query.refreshToken;
        if (!refreshToken) return res.status(401).json({ message: 'Refresh token is missing.' });

        jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, async (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Invalid refresh token.' });

            const driver = await  Operator.findById(decoded.id);
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

// Logout Controller (optional, if you want to invalidate refresh token)
const logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken || req.body.refreshToken || req.query.refreshToken;
        if (!refreshToken) return res.status(401).json({ message: 'Refresh token is missing.' });

        const decoded = jwt.decode(refreshToken);
        if (decoded && decoded.id) {
            const driver = await  Operator.findById(decoded.id);
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


const getAllOperators = async (req, res) => {
    try {
      // Fetch all operators from the database
      const operators = await Operator.find({}, 'name contactNumber email adharCard operatorNumber  approved'); // Specifying the fields to return
  
      // Check if operators exist
      if (operators.length === 0) {
        return res.status(404).json({ message: 'No operators found' });
      }
  
      // Respond with the operators
      res.status(200).json({ message: 'Vendors retrieved successfully', data: operators });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error occurred while fetching operators' });
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
        const updatedVendor = await  Operator.findByIdAndUpdate(
          _id,
          { approved: isApproved }, // Update the `approved` field
          { new: true } // Return the updated document
        );
    
        if (!updatedVendor ) {
          return res.status(404).json({
            success: false,
            message: 'Driver not found.',
          });
        }
    
        return res.status(200).json({
          success: true,
          data: updatedVendor,
        });
      } catch (err) {
        console.error('Error updating approval status:', err);
        return res.status(500).json({
          success: false,
          message: 'An error occurred while updating approval status.',
        });
      }
    };


    const getTotalOperatorCount = async (req, res) => {
        try {
          const count = await  Operator.countDocuments(); // Count the total number of driver documents
          res.status(200).json({
            message: 'Total number of drivers fetched successfully.',
            data: { count }
          });
        } catch (error) {
          console.error('Error fetching driver count:', error);
          res.status(500).json({ message: 'Server error while fetching driver count.' });
        }
      };

module.exports = { signup, login, refreshAccessToken, logout,getAllOperators, ApprovedStatus, getTotalOperatorCount };