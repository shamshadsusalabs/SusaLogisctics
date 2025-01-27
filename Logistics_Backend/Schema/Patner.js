const mongoose = require('mongoose');
const validator = require('validator');

const PatnerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Patner name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      validate: {
        validator: (v) => validator.isEmail(v),
        message: (props) => `${props.value} is not a valid email`
      }
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password should be at least 6 characters long']
    },
    contactNumber: {
      type: String,
      required: [true, 'Contact number is required'],
      validate: {
        validator: (v) => validator.isMobilePhone(v, 'any', { strictMode: false }),
        message: (props) => `${props.value} is not a valid contact number`
      },
      unique:true
    },
    refreshToken: {
      type: String,
      default: null
    },
    gstNumber: {
      type: String,
      required:false,
   
      
    },
    gstImage: {
      type: String, // URL of the GST image
      required: false
    },
    address: {
      type: String,
      required: false
    },
    aadhaarImage: {
      type: String,
      required: false, // Not required during updates
    
    },
    aadhaarNumber:{
      type: Number,
      required: false, 
   

    },
    profilePic: {
      type: String,
      required: false, // Not required during updates
     
    },
    approved: {
      type: Boolean,
      default: false, // Defaults to false
    },
  },
  
  { timestamps: true }
);



module.exports = mongoose.model('Patner', PatnerSchema);
