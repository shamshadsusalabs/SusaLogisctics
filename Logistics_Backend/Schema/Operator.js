const mongoose = require('mongoose');

const operatorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  contactNumber: {
    type: String,
    required: true,
    trim: true,
    unique:true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
    default: null,
  },
  adharCard: {
    type: String,
    required: false,
    
  },
  operatorNumber: {
    type: String,
    required: false,
    
  },
  approved: {
    type: Boolean,
    required: false,
    default: false, // Initially, the operator will not be approved
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt timestamps automatically
});

module.exports = mongoose.model('Operator', operatorSchema);
