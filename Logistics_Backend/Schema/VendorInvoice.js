const mongoose = require('mongoose');

// Vehicle schema
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
    type: Number,
    required: true,
  },
 
  RatePerkilometerAdmin: {
    type: String,
    required: true,
  },
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true,
  },
});

// ConfirmOrder schema
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
    type: Number,
    required: true,
  },
  partnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Partner',
    required: true,
  },
  vehicles: [vehicleSchema], // Array of vehicles
  orderDate: {
    type: Date,
    default: Date.now,
  },
  invoiceUrl: {
    type: String,
  },
});

// Export the model
const VendorInvoice = mongoose.model('VendorInvoice', confirmOrderSchema);
module.exports = VendorInvoice;
