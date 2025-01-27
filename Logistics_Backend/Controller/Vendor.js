const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const vendor = require('../Schema/Vendor'); // Adjust path as needed
require('dotenv').config();
const validator = require('validator');
// Function to generate access and refresh tokens
const generateTokens = (vendorId) => {
    const accessToken = jwt.sign({ id: vendorId }, process.env.JWT_SECRET, { expiresIn: '1d' });
    const refreshToken = jwt.sign({ id: vendorId }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
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

        // Check if the vendor already exists
        const existingEmailVendor = await vendor.findOne({ email });
        if (existingEmailVendor) {
            return res.status(400).json({ message: 'Vendor with this email already exists' });
        }


        const existingContactNumberVendor = await vendor.findOne({ email });
        if (existingContactNumberVendor) {
            return res.status(400).json({ message: 'Vendor with this email already exists' });
        }
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new vendor with only the required fields (ignoring gstNumber, gstImage, address)
        const newVendor = new vendor({
            name,
            email,
            password: hashedPassword,
            contactNumber
        });

        // Save the new vendor in the database
        await newVendor.save();

        // Send response without tokens
        res.status(201).json({ message: 'Vendor registered successfully' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error occurred while registering the vendor' });
    }
};

// Login Controller
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if vendor exists
        const existingVendor = await vendor.findOne({ email });
        if (!existingVendor) {
            return res.status(400).json({ message: 'Vendor not found' });
        }

        // Compare the password
        const isMatch = await bcrypt.compare(password, existingVendor.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate tokens
        const { accessToken, refreshToken } = generateTokens(existingVendor._id);

        // Save the refresh token to the database
        existingVendor.refreshToken = refreshToken;
        await existingVendor.save();

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

        // Send response with vendor details and tokens
        res.status(200).json({
            accessToken,
            refreshToken,
            user: {
                _id: existingVendor._id,
                email: existingVendor.email,
                name:existingVendor.name,
                contactNumber: existingVendor.contactNumber,
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

            const driver = await vendor.findById(decoded.id);
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
            const driver = await vendor.findById(decoded.id);
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



// Get All Vendors Controller
const getAllVendors = async (req, res) => {
    try {
        // Fetch all vendors from the database, excluding password and refreshToken fields
        const vendors = await vendor.find({}, '-password -refreshToken'); // Exclude the fields for security

        if (!vendors || vendors.length === 0) {
            return res.status(404).json({ message: 'No vendors found' });
        }

        // Send response with the list of vendors
        res.status(200).json({ message: 'Vendors retrieved successfully', data: vendors });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error occurred while fetching vendors' });
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
      const updatedVendor = await  vendor.findByIdAndUpdate(
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


  const getById = async (req, res) => {
    const { id } = req.params; // Extract vendor ID from URL parameters

    try {
        // Find vendor by ID and exclude the password field
        const vendorData = await vendor.findById(id, '-password');

        if (!vendorData) {
            return res.status(404).json({ 
                success: false, 
                message: 'Vendor not found' 
            });
        }

        // Send the found vendor data as the response
        return res.status(200).json({ 
            meessag: 'Vendors retrieved successfully', 
            data: vendorData 
        });
    } catch (err) {
        console.error('Error fetching vendor by ID:', err);
        return res.status(500).json({ 
            success: false, 
            message: 'An error occurred while fetching vendor data' 
        });
    }
};


const updateVendor = async (req, res) => {
   
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

        // Update vendor in the database using the ID from the URL and data from the request body
        const updatedVendor = await vendor.findByIdAndUpdate(req.params.id, req.body, { new: true }); // Perform the database update

        // Check if the vendor was found and updated
        if (!updatedVendor) {
            return res.status(404).json({ message: 'Vendor not found' }); // Return error if vendor does not exist
        }

        // Send the response back with the updated vendor data
        res.status(200).json({
            message: 'Vendor updated successfully', // Success message
            vendor: updatedVendor // Updated vendor details
        });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ message: 'Error updating vendor', error }); // Return generic error message
    }
};

module.exports = { signup, login, refreshAccessToken, logout ,getAllVendors,ApprovedStatus , getById,updateVendor};
