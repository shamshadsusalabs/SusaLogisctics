const Vehicle = require('../Schema/Vehicle');  // Assuming the vehicle model is stored in vehicleModel.js

// Create a new vehicle
const createVehicle = async (req, res) => {
  try {
 

    // Convert fields to numbers
    const vehicle = new Vehicle({
      vehicleName: req.body.vehicleName,
      vehicleNumber: req.body.vehicleNumber,
      insuranceImage: req.body.insuranceImage,
      insuranceNumber: req.body.insuranceNumber,
      dimensions: {
        length: Number(req.body['dimensions.length']) || 0, // Convert to number
        breadth: Number(req.body['dimensions.breadth']) || 0, // Convert to number
      },
      speed: {
        kilometerPerHour: Number(req.body['speed.kilometerPerHour']) || 0, // Convert to number
      },
      ratePerKilometer: Number(req.body.ratePerKilometer) || 0, // Ensure it's a number
      image: req.body.image,
      additionalDetails: req.body.additionalDetails,
      vendorId: req.body.vendorId,
      vendorName: req.body.vendorName,
      vendorContactNumber: req.body.vendorContactNumber,
      driverName: req.body.driverName,
      driverContact: req.body.driverContact,
      status: req.body.status,
      location: req.body.location, // Single string for location
      capacity: Number(req.body.capacity) || 0, // Ensure it's a number
      lastServicedDate: req.body.lastServicedDate,
    });

    console.log('Vehicle object created:', vehicle); // Log the vehicle object created before saving

    // Save the vehicle object to the database
    const savedVehicle = await vehicle.save();

    console.log('Vehicle saved successfully:', savedVehicle); // Log the saved vehicle data

    res.status(201).json({ message: 'Vehicle created successfully', vehicle: savedVehicle });

  } catch (error) {
    console.error('Error creating vehicle:', error); // Log the error if the process fails
    res.status(500).json({ message: 'Error creating vehicle', error: error.message });
  }
};



// Get all vehicles
const getAllVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find().populate('vendorId', 'name'); // Populating vendorId with the vendor name
    res.status(200).json({message:"sucessfully getAll data", data:vehicles });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching vehicles', error: error.message });
  }
};

const getAvailableVehicles = async (req, res) => {
  try {
    // Fetch vehicles with status "Available"
    const availableVehicles = await Vehicle.find({ status: 'Available' });
    res.status(200).json({
     message:"sucessfully getAll data", 
      data: availableVehicles,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching available vehicles.',
      error: error.message,
    });
  }
};

// Get a vehicle by ID
const getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id).populate('vendorId', 'name');
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    res.status(200).json({ vehicle });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching vehicle', error: error.message });
  }
};

// Update a vehicle by ID
const updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    res.status(200).json({ message: 'Vehicle updated successfully', vehicle });
  } catch (error) {
    res.status(500).json({ message: 'Error updating vehicle', error: error.message });
  }
};

// Delete a vehicle by ID
const deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndDelete(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    res.status(200).json({ message: 'Vehicle deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting vehicle', error: error.message });
  }
};

// Get vehicles by status
const getVehiclesByStatus = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ status: req.params.status }).populate('vendorId', 'name');
    res.status(200).json({ vehicles });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching vehicles by status', error: error.message });
  }
};

// Update vehicle location
const updateVehicleLocation = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    vehicle.location.coordinates = [longitude, latitude];
    await vehicle.save();
    res.status(200).json({ message: 'Vehicle location updated successfully', vehicle });
  } catch (error) {
    res.status(500).json({ message: 'Error updating vehicle location', error: error.message });
  }
};

// Get vehicles by vendor
const getVehiclesByVendor = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ vendorId: req.params.vendorId }).populate('vendorId', 'name');
    res.status(200).json({ vehicles });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching vehicles by vendor', error: error.message });
  }
};


// Get vehicles by vendorId
const getVehiclesByVendorId = async (req, res) => {
  try {
    const { vendorId } = req.params; // Get vendorId from URL parameters
    
    // Query vehicles by the provided vendorId
    const vehicles = await Vehicle.find({ vendorId }).populate('vendorId', 'name'); // Populating vendorId with the vendor name

    // Check if any vehicles were found
    if (vehicles.length === 0) {
      return res.status(404).json({ message: `No vehicles found for vendorId: ${vendorId}` });
    }

    // Return the list of vehicles for the given vendorId
    res.status(200).json({ message:"sucessfully getAll data",data:vehicles });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching vehicles by vendorId', error: error.message });
  }
};


module.exports = { createVehicle, getAllVehicles ,getAvailableVehicles, getVehicleById, updateVehicle,deleteVehicle,getVehiclesByStatus,updateVehicleLocation,getVehiclesByVendor,getVehiclesByVendorId};