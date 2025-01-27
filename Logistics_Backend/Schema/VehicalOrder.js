const mongoose = require('mongoose');

// Vehicle Order schema definition
const VehicleOrderSchema = new mongoose.Schema({
  vehicleName: {
    type: String,
    required: true,
  },
  vehicleNumber: {
    type: String,
    required: true,
   
  },
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true,
    index: true,
  },
  ratePerKilometer: {
    type: Number,
    required: true,
  },
  pickupLocation: {
    type: String,
    required: true,
    index: true,
  },
  dropLocation: {
    type: String,
    required: true,
    index: true,
  },
  totalKilometer:{
    type: Number,
    required: true,
  },
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true,
    index: true,
  },
  vendorName: {
    type: String,
    required: true,
  },
  vendorContactNumber: {
    type: String,
    required: true,
  },
  driverName: {
    type: String,
    required: true,
  },
  driverContact: {
    type: String,
    required: true,
  },
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver',
    required: true,
    index: true,
  },
  lastServicedDate: {
    type: Date,
  },
  isApproved: {
    type: Boolean,
    default: false,
    index: true,
  },
}, { timestamps: true });

// Adding compound indexes
VehicleOrderSchema.index({ vendorId: 1, vehicleId: 1 }); // Optimize queries filtering by vendor and vehicle
VehicleOrderSchema.index({ driverId: 1, vehicleId: 1 }); // Optimize queries filtering by driver and vehicle

// Export the model
module.exports = mongoose.model('VehicleOrder', VehicleOrderSchema);
