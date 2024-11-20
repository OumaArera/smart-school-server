const express = require('express');
const db = require('../models');
const router = express.Router();
const authenticateToken = require("../authentication/authenticate");

// GET endpoint for retrieving all budgets with status 'pending'
router.get('/', authenticateToken, async (req, res) => {
    try {
        // Retrieve all budgets with status 'pending'
        const pendingBudgets = await db.Budget.findAll({
            where: {
                status: 'pending'
            }
        });

        // If no budgets found
        if (pendingBudgets.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No pending budgets found.',
                statusCode: 404
            });
        }

        // Convert 'items' field from JSON to array
        const budgets = pendingBudgets.map(budget => {
            const budgetData = budget.toJSON(); // Convert model instance to plain object
            budgetData.items = JSON.parse(budgetData.items); // Parse JSON string to array
            return budgetData;
        });

        // Return the budgets with their items as arrays
        return res.status(200).json({
            success: true,
            message: 'Pending budgets retrieved successfully.',
            data: budgets,
            statusCode: 200
        });
    } catch (error) {
        console.error('Error retrieving pending budgets:', error);
        return res.status(500).json({
            success: false,
            message: 'Error retrieving pending budgets.',
            statusCode: 500
        });
    }
});

module.exports = router;
