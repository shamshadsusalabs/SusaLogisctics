const express = require('express');
const router = express.Router();
const { createVehicleOrder ,getAllVehicleOrders,getVehicleOrderById,updateVehicleOrder,deleteVehicleOrder }  = require('../Controller/VehicalOrder'); // Adjust path as necessary

// Routes
router.post('/Create', createVehicleOrder);
router.get('/getAll', getAllVehicleOrders);
router.get('/getById/:id', getVehicleOrderById);
router.put('/updateById/:id', updateVehicleOrder);
router.delete('/deletById/:id',deleteVehicleOrder);

module.exports = router;
