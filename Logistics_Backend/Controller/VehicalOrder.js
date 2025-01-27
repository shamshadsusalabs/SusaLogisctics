const VehicleOrder = require('../Schema/VehicalOrder'); // Adjust path as necessary

// Create a new vehicle order
const createVehicleOrder = async (req, res) => {
  try {
    const vehicleOrder = new VehicleOrder(req.body);
    const savedOrder = await vehicleOrder.save();
    res.status(201).json({
      message: 'Vehicle order created successfully',
      data: savedOrder,
    });
  } catch (error) {
    res.status(400).json({ message: 'Error creating vehicle order', error });
  }
};

// Get all vehicle orders
const getAllVehicleOrders = async (req, res) => {
  try {
    // Sort by 'createdAt' in descending order (newest first)
    const vehicleOrders = await VehicleOrder.find().sort({ createdAt: -1 });

    res.status(200).json({
      message: 'Vehicle orders retrieved successfully',
      data: vehicleOrders,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching vehicle orders', error });
  }
};


// Get a single vehicle order by ID
const getVehicleOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const vehicleOrder = await VehicleOrder.findById(id);
    if (!vehicleOrder) {
      return res.status(404).json({ message: 'Vehicle order not found' });
    }
    res.status(200).json({
      message: 'Vehicle order retrieved successfully',
      data: vehicleOrder,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching vehicle order', error });
  }
};

// Update a vehicle order by ID
const updateVehicleOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedOrder = await VehicleOrder.findByIdAndUpdate(id, req.body, {
      new: true, // Return the updated document
      runValidators: true, // Ensure validation rules are enforced
    });
    if (!updatedOrder) {
      return res.status(404).json({ message: 'Vehicle order not found' });
    }
    res.status(200).json({
      message: 'Vehicle order updated successfully',
      data: updatedOrder,
    });
  } catch (error) {
    res.status(400).json({ message: 'Error updating vehicle order', error });
  }
};

// Delete a vehicle order by ID
const deleteVehicleOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedOrder = await VehicleOrder.findByIdAndDelete(id);
    if (!deletedOrder) {
      return res.status(404).json({ message: 'Vehicle order not found' });
    }
    res.status(200).json({
      message: 'Vehicle order deleted successfully',
      data: deletedOrder,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting vehicle order', error });
  }
};

module.exports = { createVehicleOrder ,getAllVehicleOrders,getVehicleOrderById,updateVehicleOrder,deleteVehicleOrder};