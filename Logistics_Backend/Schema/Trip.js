const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema({
  driverNumber: {
    type: String,
    required: true,
  },
  pickupLocation: {
    type: String,
    required: true,
  },
  dropLocation: {
    type: String,
    required: true,
  },
  distanceInKm: {
    type: Number,
    required: true,
  },
  tripDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["Pending", "In Progress", "Completed"],
    default: "Pending",
  },
});

const Trip = mongoose.model("Trip", tripSchema);

module.exports = Trip;
