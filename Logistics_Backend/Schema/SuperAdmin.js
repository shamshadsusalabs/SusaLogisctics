const mongoose = require("mongoose");

// Define the Super Admin Schema
const superAdminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, "Please use a valid email address"],
    },
    password:{
      type: String,
      required: [true, "Password number is required"],
    },
    contactNumber: {
      type: String,
      required: [true, "Contact number is required"],
      trim: true,
      match: [/^\d{10}$/, "Contact number must be 10 digits"],
    },
    profilePic: {
      type: String, // URL to the profile picture
      default: "https://example.com/default-profile-pic.png", // Replace with your default profile picture URL
    },
    refreshToken: {
      type: String,
      default: null, // Will be assigned during login
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Export the Super Admin Model
const SuperAdmin = mongoose.model("SuperAdmin", superAdminSchema);

module.exports = SuperAdmin;
