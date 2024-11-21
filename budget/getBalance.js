const express = require('express');
const db = require('../models');
const router = express.Router();
const authenticateToken = require("../authentication/authenticate");

// GET endpoint to retrieve balance details for the logged-in user
router.get('/', authenticateToken, async (req, res) => {

    try {
        // Retrieve the balance for the logged-in user
        const balance = await db.Balance.findOne();

        if (!balance) {
            return res.status(404).json({
                success: false,
                message: 'Balance record not found for the user.',
                statusCode: 404
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Balance retrieved successfully.',
            data: balance, 
            statusCode: 200
        });
    } catch (error) {
        console.error('Error retrieving balance:', error);
        return res.status(500).json({
            success: false,
            message: 'Error retrieving balance.',
            statusCode: 500
        });
    }
});

module.exports = router;
