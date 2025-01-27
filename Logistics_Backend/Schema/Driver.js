const mongoose = require('mongoose');

// Driver Schema
const driverSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Driver name is required.'],
      trim: true,
      minlength: [3, 'Name must be at least 3 characters long.'],
      maxlength: [50, 'Name cannot exceed 50 characters.'],
    },
    contactNumber: {
      type: String,
      required: [true, 'Contact number is required.'],
      unique: true,
     
    },
    aadhaarCard: {
      type: String,
      required: [true, 'Aadhaar card number is required.'],
      unique: true,
     
    },
    licenseNumber: {
      type: String,
      required: [true, 'License number is required.'],
      unique: true,
    
    },
    driverNumber: {
      type: String,
      required: false,
      unique: true,
      
     
    },
    address: {
      type: String,
      required: false, 
   
    },
    profilePic: {
      type: String,
      required: false, // Not required during updates
     
    },
    licenseImage: {
      type: String,
      required: false, // Not required during updates
     
    },
    aadhaarImage: {
      type: String,
      required: false, // Not required during updates
    
    },
    refreshToken: {
      type: String,
      default: null, // Optional field
    },
    approved: {
      type: Boolean,
      default: false, // Defaults to false
    },
  },
  
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Export the model
module.exports = mongoose.model('Driver', driverSchema);
