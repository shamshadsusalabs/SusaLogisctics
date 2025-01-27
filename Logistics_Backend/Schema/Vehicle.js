const mongoose = require('mongoose');

// Vehicle schema definition
const vehicleSchema = {
  vehicleName: {
    type: String,
    required: true,
  },
  vehicleNumber: {
    type: String,
    required: true,
    unique: true,
  },
  insuranceImage: {
    type: String,
    required: true,
  },
  insuranceNumber: {
    type: String,
    required: true,
    unique: true,
  },
  dimensions: {
    length: {
      type: Number,
      required: true,
    },
    breadth: {
      type: Number,
      required: true,
    }
  },
  speed: {
    kilometerPerHour: {
      type: Number,
      required: true,
    }
  },
  ratePerKilometer: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
  additionalDetails: {
    type: Object,
    required: false,
  },

  // Vendor reference
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true,
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
    required: false,
  },
  driverContact: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    required: true,
    enum: ['Available', 'In Transit', 'Under Maintenance', 'Unavailable'],
  },
  location: {
    
      type: String,
     
      required: true,
      
   
  },
  capacity: {
    type: Number,
    required: true,
  },
  lastServicedDate: {
    type: Date,
    required: false,
  }
};

module.exports = mongoose.model('Vehicle', vehicleSchema);
