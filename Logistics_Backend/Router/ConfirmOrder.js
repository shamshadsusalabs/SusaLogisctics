const express = require('express');
const router = express.Router();
const { createConfirmOrder, getSortedOrders ,getOrdersByPartnerId} = require('../Controller/ConfirmOrder'); // Adjust the path to your controller

// POST route for creating a new ConfirmOrder
router.post('/create', createConfirmOrder);

router.get('/getAlls', getSortedOrders);
// Route to fetch orders based on partnerId
router.get('/orders/:partnerId', getOrdersByPartnerId);

module.exports = router;
