const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config'); // Cloudinary config

// Cloudinary storage configuration for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'vehicles', // Cloudinary folder to store the files
    resource_type: 'auto', // Automatically detect file type (image, video, document, etc.)
  },
});

// Multer middleware for handling file uploads
const upload = multer({ storage }).single('insuranceImage'); // Accept a single file under the name "insuranceImage"

// Function to upload a single file to Cloudinary
const cloudinaryUpload = async (req, res, next) => {
  try {
   

    // Check if a file has been uploaded
    if (req.file) {
      console.log('File uploaded:', req.file);

      // Log the entire file object to verify all properties
      console.log('Uploaded file object:', req.file);

      // Check if the 'path' property is available (this contains the Cloudinary URL)
      const cloudinaryUrl = req.file.path;
      
      if (cloudinaryUrl) {
        req.body.insuranceImage = cloudinaryUrl; // Store the Cloudinary URL in the request body
        console.log('Uploaded file URL:', req.body.insuranceImage); // Log the uploaded URL for debugging
      } else {
        console.error('No Cloudinary URL found in the file upload.');
        return res.status(500).json({ message: 'No Cloudinary URL found for the uploaded file.' });
      }
    } else {
      console.error('No file uploaded.');
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    // Proceed to the next middleware or route handler
    console.log('Proceeding to next middleware or route handler...');
    next();
  } catch (error) {
    console.error('Error uploading file to Cloudinary:', error);
    return res.status(500).json({ message: 'Error uploading file to Cloudinary', error });
  }
};

module.exports = { upload, cloudinaryUpload };
