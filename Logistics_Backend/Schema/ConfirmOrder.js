const mongoose = require('mongoose');

// Define the vehicle schema for each vehicle in the order
const vehicleSchema = new mongoose.Schema({
  vehicleNumber: {
    type: String,
    required: true,
  },
  vehicleName: {
    type: String,
    required: true,
  },
  driverName: {
    type: String,
    required: true,
  },
  driverContactNumber: {
    type: String,
    required: true,
  },
  driverNumber: {
    type: String,
    required: true,
  },
  capacity: {
    type: String,
    required: true,
  },
  ratePerKilometer: {
    type: Number, // Changed to Number for better numerical operations
    required: true,
  },
  ratePerKilometerAdmin: {
    type: Number, // Changed to Number for consistency
    required: true,
  },
  vendorId: {
    type: mongoose.Schema.Types.ObjectId, // Assuming vendorId is an ObjectId
    ref: 'Vendor',
    required: true,
  },
});

// Define the ConfirmOrder schema
const confirmOrderSchema = new mongoose.Schema({
  pickupLocation: {
    type: String,
    required: true,
  },
  dropLocation: {
    type: String,
    required: true,
  },
  totalKilometer: {
    type: Number, // Changed to Number for better numerical operations
    required: true,
  },
  partnerId: {
    type: mongoose.Schema.Types.ObjectId, // Assuming partnerId is an ObjectId
    ref: 'Patner',
    required: true,
  },
  vehicles: [vehicleSchema], // An array of vehicles in the order
  orderDate: {
    type: Date,
    default: Date.now, // Auto-generate the order date if not provided
  },
  invoiceUrl: {
    type: String, // URL to the generated invoice
  },
});

// Create the ConfirmOrder model
const ConfirmOrder = mongoose.model('ConfirmOrder', confirmOrderSchema);

// Export the model for use in other parts of your application
module.exports = ConfirmOrder;
