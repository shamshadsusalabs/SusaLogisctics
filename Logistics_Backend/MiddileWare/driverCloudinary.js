// cloudinaryUpload.js

const cloudinary = require('../config');  // Import the configured Cloudinary instance

const cloudinaryUpload = async (req, res, next) => {
    try {
        if (req.files) {
            const { profilePic, licenseImage, aadhaarImage } = req.files;

            // Upload each image to Cloudinary and get their URLs
            const uploadedProfilePic = profilePic ? await cloudinary.uploader.upload(profilePic[0].path) : null;
            const uploadedLicenseImage = licenseImage ? await cloudinary.uploader.upload(licenseImage[0].path) : null;
            const uploadedAadhaarImage = aadhaarImage ? await cloudinary.uploader.upload(aadhaarImage[0].path) : null;

            // Attach the Cloudinary URLs to the request body
            req.body.profilePic = uploadedProfilePic ? uploadedProfilePic.secure_url : null;
            req.body.licenseImage = uploadedLicenseImage ? uploadedLicenseImage.secure_url : null;
            req.body.aadhaarImage = uploadedAadhaarImage ? uploadedAadhaarImage.secure_url : null;
        }
        next();  // Proceed to the next middleware/controller
    } catch (error) {
        console.error('Error uploading images to Cloudinary:', error);
        return res.status(500).json({ message: 'Error uploading images to Cloudinary', error });
    }
};

module.exports = cloudinaryUpload;
