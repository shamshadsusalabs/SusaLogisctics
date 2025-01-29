const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const xss = require("xss-clean");
const connectDB = require("./dbconnection/dbconnection"); 
const app = express();
connectDB()
// Middleware for security headers
app.use(helmet());

// Middleware for parsing cookies
app.use(cookieParser());

// Middleware for CORS
app.use(cors());

// Middleware to sanitize user input and prevent XSS attacks
app.use(xss());

// Rate Limiter to prevent brute force attacks

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: "Too many requests, please try again later."
  });
  
  app.use(limiter);

// Body parser to handle JSON data (if needed)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



const SuperAdmin = require('./Router/SuperAdmin');  // Import the User router
app.use('/api/v1/superAdmin', SuperAdmin );

const driver = require('./Router/Driver');  // Import the User router
app.use('/api/v1/driver', driver);

const vendor = require('./Router/Vendor');  // Import the User router
app.use('/api/v1/vendor', vendor);

const operator = require('./Router/Operator');  // Import the User router
app.use('/api/v1/operator',  operator);

const  vehicalorder = require('./Router/VehicalOrder');  // Import the User router
app.use('/api/v1/vehicalorder',  vehicalorder);

const vehical = require('./Router/Vehical');  // Import the User router
app.use('/api/v1/vehical',  vehical);

const patner = require('./Router/Patner');  // Import the User router
app.use('/api/v1/patner',   patner);
// Sample route


const patnerVehicalOrder = require('./Router/PatnerVehicalOrder');  // Import the User router
app.use('/api/v1/patnerVehicalOrder', patnerVehicalOrder);

const confirmorder = require('./Router/ConfirmOrder');  // Import the User router
app.use('/api/v1/confirmorder', confirmorder);

const vendorInvoice = require('./Router/VendorInvoice');  // Import the User router
app.use('/api/v1/vendorInvoice', vendorInvoice);

const trip = require('./Router/Trip');  // Import the User router
app.use('/api/v1/trip', trip);

app.get("/", (req, res) => {
    res.send("Secure Server: Hello, world!");
});

// Catch all unknown routes
app.use((req, res, next) => {
    res.status(404).send("Route not found.");
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Secure server running on port ${port}`);
});
