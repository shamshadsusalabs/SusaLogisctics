const express = require("express");
const {
  createTrip,
  getAllTrips,
  getTripById,
  updateTrip,
  deleteTrip,
  getTripsByDriverNumber
} = require("../Controller/Trip");

const router = express.Router();

// Routes for Trip operations

// Create a new trip
router.post("/create", createTrip);

// Get all trips
router.get("/getAll", getAllTrips);

// Get a single trip by ID
router.get("/getById/:id", getTripById);

// Update a trip by ID
router.put("/update/:id", updateTrip);

// Delete a trip by ID
router.delete("/delete/:id", deleteTrip);

// Route for getting trips by driver number
router.get('/driver/:driverNumber', getTripsByDriverNumber);

module.exports = router;
