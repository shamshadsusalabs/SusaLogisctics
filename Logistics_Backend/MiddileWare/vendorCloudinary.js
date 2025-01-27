const cloudinary = require('../config'); // Correct import of the Cloudinary config
const fs = require('fs'); // For file system operations
const path = require('path'); // For handling file paths
const os = require('os'); // For getting temporary directory

const cloudinaryUpload = async (req, res, next) => {
    

    try {
        if (!cloudinary || !cloudinary.uploader) {
            console.error('Cloudinary is not configured properly.');
            return res.status(500).json({ message: 'Cloudinary configuration error.' });
        }

        if (req.files) {
            const { profilePic, gstImage, aadhaarImage } = req.files;

            // Function to save the file buffer to a temporary file
            const saveFileToTemp = (file) => {
                return new Promise((resolve, reject) => {
                    const tempPath = path.join(os.tmpdir(), file.originalname);
                    fs.writeFile(tempPath, file.buffer, (err) => {
                        if (err) return reject(err);
                        resolve(tempPath);
                    });
                });
            };

            // Function to upload the file to Cloudinary
            const uploadFile = async (file) => {
                const tempPath = await saveFileToTemp(file);
                try {
                    const uploaded = await cloudinary.uploader.upload(tempPath);
                    fs.unlinkSync(tempPath); // Delete the temporary file after upload
                    return uploaded;
                } catch (error) {
                    fs.unlinkSync(tempPath); // Delete the temporary file even if upload fails
                    throw error;
                }
            };

            const uploadedProfilePic = profilePic
                ? await uploadFile(profilePic[0])
                : null;
            const uploadedGstImage = gstImage
                ? await uploadFile(gstImage[0])
                : null;
            const uploadedAadhaarImage = aadhaarImage
                ? await uploadFile(aadhaarImage[0])
                : null;

            req.body.profilePic = uploadedProfilePic?.secure_url || null;
            req.body.gstImage = uploadedGstImage?.secure_url || null;
            req.body.aadhaarImage = uploadedAadhaarImage?.secure_url || null;
        }

        next(); // Proceed to the next middleware
    } catch (error) {
        console.error('Error uploading images to Cloudinary:', error);
        return res.status(500).json({ message: 'Error uploading images to Cloudinary', error });
    }
};

module.exports = cloudinaryUpload;
