const mongoose = require('mongoose');

// Define the schema
const vehicleOrderSchema = new mongoose.Schema({
  vehicleCount: {
    type: Number,
    required: true
  },
  orderDate: {
    type: String, // You can change this to Date if you prefer
    required: true
  },
  hubAddress: {
    type: String,
    required: true
  },
  vehicleType: {
    type: String,
    required: true
  },
  capacity: {
    type: Number,
    required: true
  },
  pickupLocation: {
    type: String,
    required: true
  },
  dropLocation: {
    type: String,
    required: true
  },
  partnerId: {
    type: mongoose.Schema.Types.ObjectId, // Refers to a partner's ID from another collection
    ref: 'Patner', // Replace 'Patner' with the actual model name of the partners collection
    required: true
  },
  partnerName: {
    type: String,
    required: true
  },
  partnerContactNumber: {
    type: String,
    required: true
  },
  totalKilometer:{
    type: Number,
    required: true
  },
  isAccepted: {
    type: Boolean,
    default: false // By default, this field will be false
  }
});

// Create the model based on the schema
const PartnerVehicleOrder = mongoose.model('PartnerVehicleOrder', vehicleOrderSchema);

module.exports = PartnerVehicleOrder;
