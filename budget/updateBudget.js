const express = require('express');
const db = require('../models');
const router = express.Router();
const authenticateToken = require("../authentication/authenticate");

// Validation function for status
const validateStatus = (status) => ['approved', 'declined', 'pending'].includes(status);

// PUT endpoint to update the status and reason of a budget
router.put('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params; // Extract the budget ID from the URL
    const { status, reason } = req.body; // Extract status and reason from the request body

    // Validate input fields
    if (!validateStatus(status)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid status. Allowed values are: approved, declined, or pending.',
            statusCode: 400
        });
    }

    if (reason && reason.length > 1000) {
        return res.status(400).json({
            success: false,
            message: 'Reason is too long. It must not exceed 1000 characters.',
            statusCode: 400
        });
    }

    try {
        // Check if the budget exists
        const budget = await db.Budget.findByPk(id);

        if (!budget) {
            return res.status(404).json({
                success: false,
                message: 'Budget not found.',
                statusCode: 404
            });
        }

        // Update the budget
        budget.status = status;
        budget.reason = reason || null; // Allow null for the reason if it's not provided
        await budget.save();

        return res.status(200).json({
            success: true,
            message: 'Budget updated successfully.',
            data: budget, // Return the updated budget
            statusCode: 200
        });
    } catch (error) {
        console.error('Error updating budget:', error);
        return res.status(500).json({
            success: false,
            message: 'Error updating budget.',
            statusCode: 500
        });
    }
});

module.exports = router;