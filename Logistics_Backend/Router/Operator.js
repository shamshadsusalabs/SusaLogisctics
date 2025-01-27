const express = require('express');
const router = express.Router();
const { signup, login, logout, refreshAccessToken ,  getAllOperators,ApprovedStatus,getTotalOperatorCount} = require('../Controller/Operator');
const verifyAccessToken = require("../MiddileWare/authMiddeware"); 


// Signup route
router.post('/signup', signup);

// Login route
router.post('/login', login);

// Logout route
router.post('/logout', logout);

// Refresh Token route
router.post('/refresh-token', refreshAccessToken);


router.get('/getAlls', getAllOperators);

// Approve Vendor Status
router.put('/approval/:_id', verifyAccessToken, ApprovedStatus);

router.get('/total-count',verifyAccessToken, getTotalOperatorCount);
module.exports = router;
