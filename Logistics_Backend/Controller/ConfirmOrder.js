
const fs = require('fs');
const path = require('path');
const cloudinary = require('../config'); // Import your Cloudinary configuration
const ConfirmOrder = require('../Schema/ConfirmOrder'); // Adjust the path to your model

async function createConfirmOrder(req, res) {
  try {
 

    const { pickupLocation, dropLocation, totalKilometer, vehicles, partnerId } = req.body;

    // Validate required fields
    if (!pickupLocation || !dropLocation || !vehicles || vehicles.length === 0 || !partnerId || totalKilometer === undefined) {
      return res.status(400).json({
        message: 'Pickup location, drop location, vehicles array, partnerId, and totalKilometer are required.',
      });
    }

    // Ensure ratePerKilometerAdmin is passed correctly as a number
    vehicles.forEach(vehicle => {
      // Ensure ratePerKilometerAdmin is a valid number (it might be passed as a string)
      vehicle.ratePerKilometerAdmin = parseFloat(vehicle.RatePerkilometerAdmin);

      // Ensure it's a valid number before calculating
      if (isNaN(vehicle.ratePerKilometerAdmin)) {
        throw new Error(`Invalid ratePerKilometerAdmin for vehicle: ${vehicle.vehicleNumber}`);
      }
    });

    // Calculate total amount and apply GST and TDS
    let totalAmount = 0;

    vehicles.forEach(vehicle => {
      const ratePerKilometerAdmin = vehicle.ratePerKilometerAdmin; // Now it's already a number
      const vehicleTotalKilometer = totalKilometer;  // Use totalKilometer from the root

      // Calculate total amount for each vehicle
      const vehicleAmount = ratePerKilometerAdmin * vehicleTotalKilometer;
      totalAmount += vehicleAmount;

      // Store the calculated totalAmount in the vehicle object
      vehicle.totalAmount = vehicleAmount;
    });

    // Calculate GST (18%) and TDS (10%)
    const gstAmount = (totalAmount * 18) / 100;
    const tdsAmount = (totalAmount * 10) / 100;
    const finalAmount = totalAmount + gstAmount - tdsAmount;

    // Formatting to two decimal places
    const formattedGstAmount = gstAmount.toFixed(2);
    const formattedTdsAmount = tdsAmount.toFixed(2);
    const formattedFinalAmount = finalAmount.toFixed(2);

    // Generate dynamic HTML content for the invoice
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invoice</title>
        <style>
            body {
                font-family: 'Arial', sans-serif;
                margin: 0;
                padding: 0;
                background-color: #f4f4f4;
                color: #333;
            }
            .container {
                width: 80%;
                margin: 0 auto;
                padding: 20px;
                background: #fff;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                border-radius: 10px;
            }
            .header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 2px solid #eee;
                padding-bottom: 20px;
                margin-bottom: 20px;
            }
            .company-details {
                text-align: left;
                font-size: 14px;
            }
            .company-details h2 {
                margin: 0;
                font-size: 28px;
                color: #007bff;
            }
            .company-details p {
                margin: 5px 0;
            }
            .invoice-info {
                text-align: right;
                font-size: 14px;
            }
            .invoice-info p {
                margin: 5px 0;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 30px;
            }
            table th, table td {
                border: 1px solid #ddd;
                padding: 10px;
                text-align: left;
            }
            table th {
                background-color: #007bff;
                color: white;
            }
            table tr:nth-child(even) {
                background-color: #f9f9f9;
            }
            table tr:hover {
                background-color: #f1f1f1;
            }
            .totals {
                margin-top: 20px;
                display: flex;
                justify-content: flex-end;
            }
            .totals div {
                margin-left: 20px;
                font-size: 16px;
            }
            .footer {
                text-align: center;
                font-size: 12px;
                color: #888;
                margin-top: 20px;
            }
            .footer p {
                margin: 5px 0;
            }
            .address {
                display: flex;
                justify-content: space-between;
                margin-top: 20px;
            }
            .address div {
                width: 45%;
            }
            .address h3 {
                font-size: 16px;
                margin: 5px 0;
            }
            .address p {
                font-size: 14px;
                margin: 5px 0;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <!-- Header Section -->
            <div class="header">
                <div class="company-details">
                    <h2>Susa Logistics</h2>
                    <p>123, Logistic Street, Delhi, India, 110001</p>
                    <p>GST Number: 07AABCS1234C1Z5</p>
                </div>
                <div class="invoice-info">
                    <p><strong>Invoice</strong></p>
                    <p>Order Date: ${new Date().toLocaleDateString()}</p>
                    <p>Pickup Location: ${pickupLocation}</p>
                    <p>Drop Location: ${dropLocation}</p>
                </div>
            </div>

            <!-- Seller and Buyer Details -->
            <div class="address">
                <div class="seller">
                    <h3>Seller Details</h3>
                    <p><strong>Susa Logistics</strong></p>
                    <p>GST Number: 07AABCS1234C1Z5</p>
                    <p>Address: 123, Logistic Street, Delhi, India, 110001</p>
                </div>
                <div class="buyer">
                    <h3>Buyer Details</h3>
                    <p><strong>XYZ Corporation</strong></p>
                    <p>GST Number: 09AABCD9876E1Z4</p>
                    <p>Address: 456, Business Avenue, Gurugram, Haryana, 122018</p>
                </div>
            </div>

            <!-- Vehicle Details Table -->
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Vehicle Number</th>
                        <th>Vehicle Name</th>
                        <th>Driver Name</th>
                        <th>Driver Contact</th>
                        <th>Driver Number</th>
                        <th>Capacity</th>
                        <th>Total Amount</th>
                    </tr>
                </thead>
                <tbody>
                    ${vehicles.map((v, i) => `
                        <tr>
                            <td>${i + 1}</td>
                            <td>${v.vehicleNumber}</td>
                            <td>${v.vehicleName}</td>
                            <td>${v.driverName}</td>
                            <td>${v.driverContactNumber}</td>
                            <td>${v.driverNumber}</td>
                            <td>${v.capacity}</td>
                            <td>₹ ${v.totalAmount.toFixed(2)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>

            <!-- Totals Section (GST, TDS) -->
            <div class="totals">
                <div><strong>GST (18%):</strong> ₹ ${formattedGstAmount}</div>
                <div><strong>TDS (10%):</strong> ₹ ${formattedTdsAmount}</div>
                <div><strong>Total Amount:</strong> ₹ ${formattedFinalAmount}</div>
            </div>

            <!-- Footer Section -->
            <div class="footer">
                <p>Thank you for doing business with us!</p>
                <p>For any queries, please contact us at support@company.com</p>
            </div>
        </div>
    </body>
    </html>
`;



    // Save the HTML content to a temporary file
    const tempFilePath = path.join(__dirname, 'tempInvoice.html');
    fs.writeFileSync(tempFilePath, htmlContent);

    // Upload the file to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(tempFilePath, {
      resource_type: 'raw', // Use 'raw' for non-media files like HTML
      folder: 'invoices', // Optional folder in Cloudinary
    });

    console.log('Cloudinary Upload Result:', uploadResult);

    // Remove the temporary file after upload
    fs.unlinkSync(tempFilePath);

    // Ensure the invoiceUrl is properly passed and saved
    const invoiceUrl = uploadResult.secure_url;  // Make sure this is correct
    console.log('Cloudinary invoice URL:', invoiceUrl);

    // Save the ConfirmOrder with the Cloudinary URL
    const newConfirmOrder = new ConfirmOrder({
      pickupLocation,
      dropLocation,
      totalKilometer,  // Ensure totalKilometer is included
      partnerId,  // Ensure partnerId is included
      vehicles,
      invoiceUrl,  // Ensure invoiceUrl is passed here
    });

    const savedOrder = await newConfirmOrder.save();
    console.log('Order saved to database:', savedOrder);

    res.status(201).json({
      message: 'Confirm Order created successfully with invoice',
      data: savedOrder,
    });
  } catch (err) {
    console.error('Error creating confirm order:', err);
    res.status(500).json({
      message: 'Internal server error while creating the confirm order.',
      error: err.message,
    });
  }
}

async function getSortedOrders(req, res) {
  try {
    const orders = await ConfirmOrder.find()
      .select('orderDate invoiceUrl') // Select only the orderDate and invoiceUrl fields
      .sort({ orderDate: -1 }); // Sort by orderDate in descending order (use 1 for ascending)

    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
}

const getOrdersByPartnerId = async (req, res) => {
    const { partnerId } = req.params;
    console.log('Received partnerId:', partnerId); // Log specific value of partnerId

    try {
        // Fetch only the 'invoiceUrl' and 'orderDate' fields for orders related to the given partnerId
        const orders = await ConfirmOrder.find({ partnerId }).select('invoiceUrl orderDate');

        // Check if orders exist
        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: 'No orders found for this partner.' });
        }

        // Return the orders with selected fields in the response
        res.status(200).json({ orders });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


module.exports = {
  createConfirmOrder,
  getSortedOrders,
  getOrdersByPartnerId
};
