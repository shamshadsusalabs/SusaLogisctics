const Trip = require("../Schema/Trip");

// Create a new trip or multiple trips
const createTrip = async (req, res) => {
  console.log(req.body);

  try {
    // Check if the request body is an array (for multiple trips) or a single trip object
    const trips = Array.isArray(req.body) ? req.body : [req.body];

    // Validate each trip data in the array
    const tripData = trips.map(({ driverNumber, pickupLocation, dropLocation, distanceInKm }) => {
      if (!driverNumber || !pickupLocation || !dropLocation || !distanceInKm) {
        throw new Error("Missing required fields in trip data");
      }
      return {
        driverNumber,
        pickupLocation,
        dropLocation,
        distanceInKm,
      };
    });

    // Insert trips into the database (use `insertMany` for multiple trips)
    const savedTrips = await Trip.insertMany(tripData);

    // Return the response
    res.status(201).json({
      message: "Trip(s) created successfully",
      data: savedTrips,
    });

  } catch (error) {
    console.error("Error creating trip(s):", error.message);
    res.status(500).json({
      message: "Error creating trip(s)",
      error: error.message,
    });
  }
};

// Get all trips
const getAllTrips = async (req, res) => {
  try {
    const trips = await Trip.find();
    res.status(200).json({ message: "Trips retrieved successfully", data: trips });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving trips", error: error.message });
  }
};

// Get a single trip by ID
const getTripById = async (req, res) => {
  try {
    const { id } = req.params;
    const trip = await Trip.findById(id);

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    res.status(200).json({ message: "Trip retrieved successfully", data: trip });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving trip", error: error.message });
  }
};

// Update a trip by ID
const updateTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTrip = await Trip.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedTrip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    res.status(200).json({ message: "Trip updated successfully", data: updatedTrip });
  } catch (error) {
    res.status(500).json({ message: "Error updating trip", error: error.message });
  }
};

// Delete a trip by ID
const deleteTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTrip = await Trip.findByIdAndDelete(id);

    if (!deletedTrip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    res.status(200).json({ message: "Trip deleted successfully", data: deletedTrip });
  } catch (error) {
    res.status(500).json({ message: "Error deleting trip", error: error.message });
  }
};

// Get trips by driver number
const getTripsByDriverNumber = async (req, res) => {
  const { driverNumber } = req.params; // Extract driverNumber from route parameters
  try {
    const trips = await Trip.find({ driverNumber }); // Find trips by driverNumber
    if (trips.length === 0) {
      return res.status(404).json({ message: "No trips found for this driver" });
    }
    res.status(200).json({ message: "Trips retrieved successfully", data: trips });
  } catch (error) {
    res.status(500).json({ message: "Error fetching trips by driver number", error: error.message });
  }
};

// Export all functions individually
module.exports = {
  createTrip,
  getAllTrips,
  getTripById,
  updateTrip,
  deleteTrip,
  getTripsByDriverNumber,
};
