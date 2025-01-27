// routes/vehicleOrderRouter.js
const express = require('express');
const router = express.Router();
const vehicleOrderController = require('../Controller/PatnerVehicalOrder');

// Create a new vehicle order
router.post('/create', vehicleOrderController.createVehicleOrder);

// Get all vehicle orders
router.get('/getAll', vehicleOrderController.getAllVehicleOrders);

// Get a vehicle order by ID
router.get('/patner-vehicle-orders/:id', vehicleOrderController.getVehicleOrderById);

// Update a vehicle order by ID
router.put('/patner-vehicle-orders/:id', vehicleOrderController.updateVehicleOrder);

// Delete a vehicle order by ID
router.delete('/patner-vehicle-orders/:id', vehicleOrderController.deleteVehicleOrder);

router.get('/total-count', vehicleOrderController.getTotalPatnerVehicalOrderCount);

// Define the route to get vehicle orders by partnerId
router.get('/partner/:partnerId',vehicleOrderController.getVehicleOrdersByPartnerId);

module.exports = router;
