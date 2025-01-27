const express = require('express');
const router = express.Router();
const { createConfirmOrder,getInvoicesByVendorId } = require('../Controller/VendorInvoice'); // Adjust the path to your controller

// POST route for creating a new ConfirmOrder
router.post('/create', createConfirmOrder);

router.get('/invoices/by-vendor/:vendorId', getInvoicesByVendorId);

module.exports = router;
