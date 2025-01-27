// At the top of your main server file
require('dotenv').config();  // Ensure environment variables are loaded

const cloudinary = require('cloudinary').v2;

// Set your Cloudinary credentials (get these from your Cloudinary account)
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Add your Cloudinary Cloud Name
    api_key: process.env.CLOUDINARY_API_KEY,       // Add your Cloudinary API Key
    api_secret: process.env.CLOUDINARY_API_SECRET  // Add your Cloudinary API Secret
});
module.exports = cloudinary;