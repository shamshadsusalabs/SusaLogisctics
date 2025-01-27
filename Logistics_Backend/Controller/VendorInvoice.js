const fs = require('fs');
const path = require('path');
const cloudinary = require('../config');
const ConfirmOrder = require('../Schema/VendorInvoice');
const mongoose = require('mongoose');
async function createConfirmOrder(req, res) {
  try {
    console.log('Request body:', req.body);

    const { pickupLocation, dropLocation, totalKilometer, vehicles, partnerId } = req.body;

    // Validate required fields
    if (!pickupLocation || !dropLocation || !vehicles || vehicles.length === 0 || !partnerId || totalKilometer === undefined) {
      return res.status(400).json({
        message: 'Pickup location, drop location, vehicles array, partnerId, and totalKilometer are required.',
      });
    }

    const savedOrders = [];

    for (let i = 0; i < vehicles.length; i++) {
      const vehicle = vehicles[i];
      const ratePerKilometer = parseFloat(vehicle.ratePerKilometer);
      if (isNaN(ratePerKilometer)) {
        throw new Error(`Invalid ratePerKilometer for vehicle: ${vehicle.vehicleNumber}`);
      }

      // Calculate total amount, GST, and TDS
      const vehicleTotalAmount = ratePerKilometer * totalKilometer;
      const gstAmount = (vehicleTotalAmount * 18) / 100;
      const tdsAmount = (vehicleTotalAmount * 10) / 100;
      const finalAmount = vehicleTotalAmount + gstAmount - tdsAmount;

      // Generate HTML content
      const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Invoice - Vehicle ${i + 1}</title>
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
              <div class="header">
                  <h2>Susa Logistics</h2>
                  <p>Pickup Location: ${pickupLocation}</p>
                  <p>Drop Location: ${dropLocation}</p>
              </div>
              <table>
                  <tr><th>Field</th><th>Details</th></tr>
                  <tr><td>Vehicle Number</td><td>${vehicle.vehicleNumber}</td></tr>
                  <tr><td>Vehicle Name</td><td>${vehicle.vehicleName}</td></tr>
                  <tr><td>Driver Name</td><td>${vehicle.driverName}</td></tr>
                  <tr><td>Driver Contact</td><td>${vehicle.driverContactNumber}</td></tr>
                  <tr><td>Capacity</td><td>${vehicle.capacity}</td></tr>
                  <tr><td>Rate Per KM</td><td>₹ ${ratePerKilometer.toFixed(2)}</td></tr>
                  <tr><td>Total KM</td><td>${totalKilometer}</td></tr>
                  <tr><td>Total Amount</td><td>₹ ${vehicleTotalAmount.toFixed(2)}</td></tr>
              </table>
              <div class="totals">
                  <div><strong>GST (18%):</strong> ₹ ${gstAmount.toFixed(2)}</div>
                  <div><strong>TDS (10%):</strong> ₹ ${tdsAmount.toFixed(2)}</div>
                  <div><strong>Final Amount:</strong> ₹ ${finalAmount.toFixed(2)}</div>
              </div>
          </div>
      </body>
      </html>`;

      // Save the HTML content temporarily
      const tempFilePath = path.join(__dirname, `tempInvoice_vehicle${i + 1}.html`);
      fs.writeFileSync(tempFilePath, htmlContent);

      // Upload the invoice to Cloudinary
      const uploadResult = await cloudinary.uploader.upload(tempFilePath, {
        resource_type: 'raw',
        folder: 'invoices',
      });

      console.log(`Uploaded Invoice for Vehicle ${i + 1}:`, uploadResult);

      // Remove the temporary file after upload
      fs.unlinkSync(tempFilePath);

      // Save the ConfirmOrder for the vehicle
      const newConfirmOrder = new ConfirmOrder({
        pickupLocation,
        dropLocation,
        totalKilometer,
        partnerId,
        vehicles: [vehicle],
        invoiceUrl: uploadResult.secure_url,
      });

      const savedOrder = await newConfirmOrder.save();
      savedOrders.push(savedOrder);
    }

    // Respond with all saved orders
    res.status(201).json({
      message: 'Confirm Orders created successfully with invoices',
      data: savedOrders,
    });
  } catch (err) {
    console.error('Error creating confirm orders:', err);
    res.status(500).json({
      message: 'Internal server error while creating confirm orders.',
      error: err.message,
    });
  }
}


const getInvoicesByVendorId = async (req, res) => {
    const vendorId = req.params.vendorId;
  
    try {
      // Validate the vendorId format
      if (!mongoose.Types.ObjectId.isValid(vendorId)) {
        return res.status(400).json({ message: 'Invalid vendorId format' });
      }
  
      // Fetch invoices where vehicles array contains the matching vendorId
      const invoices = await ConfirmOrder.find({
        "vehicles.vendorId": new mongoose.Types.ObjectId(vendorId),  // Use 'new' here
      });
  
      // Check if any invoices were found
      if (invoices.length === 0) {
        return res.status(404).json({ message: 'No invoices found for this vendorId' });
      }
  
      // Return the found invoices
      return res.status(200).json(invoices);
  
    } catch (error) {
      console.error("Error fetching invoices:", error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
module.exports = { createConfirmOrder,getInvoicesByVendorId  };
