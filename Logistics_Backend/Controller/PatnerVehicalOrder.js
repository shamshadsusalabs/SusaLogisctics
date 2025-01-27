// controllers/vehicleOrderController.js
const PatnervehicleOrderSchema = require('../Schema/PatnerVehicalOrder');

// Create a new vehicle order

const createVehicleOrder = async (req, res) => {
    try {
      // Destructure incoming request body to get fields including the new ones
      const { 
        vehicleCount, 
        orderDate, 
        hubAddress, 
        vehicleType, 
        capacity, 
        pickupLocation, 
        dropLocation, 
        partnerId, 
        partnerName, 
        partnerContactNumber,
        totalKilometer
      } = req.body;
  
      // Create a new order with all the required fields
      const newOrder = new  PatnervehicleOrderSchema ({
        vehicleCount,
        orderDate,
        hubAddress,
        vehicleType,
        capacity,
        pickupLocation,
        dropLocation,
        partnerId,
        partnerName,               // Added partnerName
        partnerContactNumber,
        totalKilometer      // Added partnerContactNumber
      });
  
      // Save the new order to the database
      await newOrder.save();
  
      // Return a success response with the saved order
      res.status(201).json({
        message: 'Vehicle order created successfully',
        data: newOrder
      });
    } catch (error) {
      // Return an error response in case of failure
      res.status(500).json({
        message: 'Error creating vehicle order',
        error: error.message
      });
    }
  };

// Get all vehicle orders
const getAllVehicleOrders = async (req, res) => {
  try {
    const orders = await PatnervehicleOrderSchema.find();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching vehicle orders',
      error: error.message
    });
  }
};

// Get a vehicle order by ID
const getVehicleOrderById = async (req, res) => {
  try {
    const order = await PatnervehicleOrderSchema.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Vehicle order not found' });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching vehicle order',
      error: error.message
    });
  }
};

// Update a vehicle order by ID
const updateVehicleOrder = async (req, res) => {
  try {
    const updatedOrder = await PatnervehicleOrderSchema.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedOrder) {
      return res.status(404).json({ message: 'Vehicle order not found' });
    }
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({
      message: 'Error updating vehicle order',
      error: error.message
    });
  }
};

// Delete a vehicle order by ID
const deleteVehicleOrder = async (req, res) => {
  try {
    const deletedOrder = await PatnervehicleOrderSchema.findByIdAndDelete(req.params.id);
    if (!deletedOrder) {
      return res.status(404).json({ message: 'Vehicle order not found' });
    }
    res.status(200).json({ message: 'Vehicle order deleted successfully' });
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting vehicle order',
      error: error.message
    });
  }
};


 const getTotalPatnerVehicalOrderCount = async (req, res) => {
        try {
          const count = await  PatnervehicleOrderSchema.countDocuments(); // Count the total number of driver documents
          res.status(200).json({
            message: 'Total number of drivers fetched successfully.',
            data: { count }
          });
        } catch (error) {
          console.error('Error fetching driver count:', error);
          res.status(500).json({ message: 'Server error while fetching driver count.' });
        }
      };


      const getVehicleOrdersByPartnerId = async (req, res) => {
        try {
          const { partnerId } = req.params; // Extract `partnerId` from the request parameters
          const orders = await PatnervehicleOrderSchema.find({ partnerId });
      
          if (!orders || orders.length === 0) {
            return res.status(404).json({ message: 'No vehicle orders found for this partner ID' });
          }
      
          res.status(200).json(orders);
        } catch (error) {
          res.status(500).json({
            message: 'Error fetching vehicle orders',
            error: error.message,
          });
        }
      };
module.exports = {
  createVehicleOrder,
  getAllVehicleOrders,
  getVehicleOrderById,
  updateVehicleOrder,
  deleteVehicleOrder,
  getTotalPatnerVehicalOrderCount,
  getVehicleOrdersByPartnerId 
};
