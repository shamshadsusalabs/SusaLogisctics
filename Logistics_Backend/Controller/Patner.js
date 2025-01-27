const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Patner = require('../Schema/Patner'); // Adjust path as needed
require('dotenv').config();
const validator = require('validator');
// Function to generate access and refresh tokens
const generateTokens = (PatnerId) => {
    const accessToken = jwt.sign({ id: PatnerId }, process.env.JWT_SECRET, { expiresIn: '1d' });
    const refreshToken = jwt.sign({ id: PatnerId }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
    return { accessToken, refreshToken };
};

// Signup Controller
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

        // Contact number validation (you can adjust it according to your requirements)
        if (!validator.isMobilePhone(contactNumber, 'any', { strictMode: false })) {
            return res.status(400).json({ message: 'Invalid contact number' });
        }

        // Check if the Patner already exists
        const existingPatner = await Patner.findOne({ email });
        if (existingPatner) {
            return res.status(400).json({ message: 'Patner with this email already exists' });
        }
 // Check if the operator with this contact number already exists
        const existingPatnerContact = await Patner.findOne({ contactNumber });
        if (existingPatnerContact) {
            return res.status(400).json({ message: 'Patner with this contact number already exists' });
        }
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new Patner with only the required fields (ignoring gstNumber, gstImage, address)
        const newPatner = new Patner({
            name,
            email,
            password: hashedPassword,
            contactNumber
        });

        // Save the new Patner in the database
        await newPatner.save();

        // Send response without tokens
        res.status(201).json({ message: 'Patner registered successfully' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error occurred while registering the Patner' });
    }
};

// Login Controller
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if Patner exists
        const existingPatner = await Patner.findOne({ email });
        if (!existingPatner) {
            return res.status(400).json({ message: 'Patner not found' });
        }

        // Compare the password
        const isMatch = await bcrypt.compare(password, existingPatner.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate tokens
        const { accessToken, refreshToken } = generateTokens(existingPatner._id);

        // Save the refresh token to the database
        existingPatner.refreshToken = refreshToken;
        await existingPatner.save();

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

        // Send response with Patner details and tokens
        res.status(200).json({
            accessToken,
            refreshToken,
            user: {
                _id: existingPatner._id,
                email: existingPatner.email,
                name:existingPatner.name,
                contactNumber: existingPatner.contactNumber,
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

            const driver = await Patner.findById(decoded.id);
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
            const driver = await Patner.findById(decoded.id);
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



// Get All Patners Controller
const getAllPatners = async (req, res) => {
    try {
        // Fetch all Patners from the database, excluding password and refreshToken fields
        const Patners = await Patner.find({}, '-password -refreshToken'); // Exclude the fields for security

        if (!Patners || Patners.length === 0) {
            return res.status(404).json({ message: 'No Patners found' });
        }

        // Send response with the list of Patners
        res.status(200).json({ message: 'Patners retrieved successfully', data: Patners });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error occurred while fetching Patners' });
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
      const updatedPatner = await  Patner.findByIdAndUpdate(
        _id,
        { approved: isApproved }, // Update the `approved` field
        { new: true } // Return the updated document
      );
  
      if (!updatedPatner ) {
        return res.status(404).json({
          success: false,
          message: 'Driver not found.',
        });
      }
  
      return res.status(200).json({
        success: true,
        data: updatedPatner,
      });
    } catch (err) {
      console.error('Error updating approval status:', err);
      return res.status(500).json({
        success: false,
        message: 'An error occurred while updating approval status.',
      });
    }
  };


  const getById = async (req, res) => {
    const { id } = req.params; // Extract Patner ID from URL parameters

    try {
        // Find Patner by ID and exclude the password field
        const PatnerData = await Patner.findById(id, '-password');

        if (!PatnerData) {
            return res.status(404).json({ 
                success: false, 
                message: 'Patner not found' 
            });
        }

        // Send the found Patner data as the response
        return res.status(200).json({ 
            meessag: 'Patners retrieved successfully', 
            data: PatnerData 
        });
    } catch (err) {
        console.error('Error fetching Patner by ID:', err);
        return res.status(500).json({ 
            success: false, 
            message: 'An error occurred while fetching Patner data' 
        });
    }
};


const updatePatner = async (req, res) => {
   
    try {
        // Basic validation for email format
        if (req.body.email && !validator.isEmail(req.body.email)) {
            return res.status(400).json({ message: 'Invalid email format' }); // Return error if email is invalid
        }

        // Basic validation for contact number format
        if (req.body.contactNumber && !validator.isMobilePhone(req.body.contactNumber, 'any', { strictMode: false })) {
            return res.status(400).json({ message: 'Invalid contact number format' }); // Return error if contact number is invalid
        }

        // Basic validation for GST number format (if provided)
        if (req.body.gstNumber && !/^[a-zA-Z0-9]+$/.test(req.body.gstNumber)) {
            return res.status(400).json({ message: 'Invalid GST number format. It should contain only letters and numbers.' });
        }

        // Check if the password is part of the update request
        if (req.body.password) {
            // Validate password length (at least 6 characters)
            if (req.body.password.length < 6) {
                return res.status(400).json({ message: 'Password must be at least 6 characters long' }); // Return error if password is too short
            }

            // Hash the password before saving
            const hashedPassword = await bcrypt.hash(req.body.password, 10); // Encrypt the password
            req.body.password = hashedPassword;  // Replace the password in the request body with its hashed version
        }

        // Update Patner in the database using the ID from the URL and data from the request body
        const updatedPatner = await Patner.findByIdAndUpdate(req.params.id, req.body, { new: true }); // Perform the database update

        // Check if the Patner was found and updated
        if (!updatedPatner) {
            return res.status(404).json({ message: 'Patner not found' }); // Return error if Patner does not exist
        }

        // Send the response back with the updated Patner data
        res.status(200).json({
            message: 'Patner updated successfully', // Success message
            Patner: updatedPatner // Updated Patner details
        });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ message: 'Error updating Patner', error }); // Return generic error message
    }
};

module.exports = { signup, login, refreshAccessToken, logout ,getAllPatners,ApprovedStatus , getById,updatePatner};
