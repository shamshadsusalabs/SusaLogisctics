require('dotenv').config(); // Load environment variables from .env file
const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        // MongoDB URI (Replace with your MongoDB connection string)
        const dbURI = process.env.MONGODB_URI;

        // Connect to MongoDB using mongoose
        await mongoose.connect(dbURI); // No need to pass options like useNewUrlParser or useUnifiedTopology

        console.log("MongoDB connected successfully.");
    } catch (err) {
        console.error("MongoDB connection error:", err.message);
        process.exit(1); // Exit the process with failure
    }
};

module.exports = connectDB;
