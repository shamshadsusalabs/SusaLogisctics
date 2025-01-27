const express = require('express');
const router = express.Router();
const { createVehicle, getAllVehicles,getAvailableVehicles,  getVehicleById,  updateVehicle, deleteVehicle, getVehiclesByStatus, updateVehicleLocation, getVehiclesByVendor,getVehiclesByVendorId } = require('../Controller/Vehical'); // Assuming the controller is in controllers/vehicleController.js
const { upload, cloudinaryUpload } = require('../MiddileWare/vehicalCloudnary');
// Route to create a new vehicle
router.post('/add-vehical', upload, cloudinaryUpload,createVehicle);

 

// Route to get a vehicle by ID
router.get('/vehicles/:id', getVehicleById);

// Route to update a vehicle by ID
router.put('/vehicles/:id', updateVehicle);

// Route to delete a vehicle by ID
router.delete('/vehicles/:id', deleteVehicle);

// Route to get vehicles by status
router.get('/vehicles/status/:status',getVehiclesByStatus);

// Route to update vehicle location
router.put('/vehicles/:id/location',updateVehicleLocation);

// Route to get vehicles by vendor
router.get('/vehicles/vendor/:vendorId',getVehiclesByVendor);

// Route to get all vehicles
router.get('/getAlls', getAllVehicles);
router.get('/vendorID/:vendorId', getVehiclesByVendorId);

router.get('/available', getAvailableVehicles);
module.exports = router;
