const express = require('express');
const db = require('../models');
const router = express.Router();
const authenticateToken = require('../authentication/authenticate');

// GET endpoint to retrieve budgets within a date range for the logged-in user
router.get('/', authenticateToken, async (req, res) => {
    const userId = req.user.id; // Extract userId from the decoded token
    const { start, end } = req.query; // Extract start and end dates from query parameters

    // Validate that start and end dates are provided and properly formatted
    if (!start || !end) {
        return res.status(400).json({
            success: false,
            message: 'Start and end dates are required.',
            statusCode: 400
        });
    }

    const startDate = new Date(start);
    const endDate = new Date(end);

    if (isNaN(startDate) || isNaN(endDate)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid date format. Use a valid date string (e.g., YYYY-MM-DD).',
            statusCode: 400
        });
    }

    if (startDate > endDate) {
        return res.status(400).json({
            success: false,
            message: 'Start date must be before or equal to the end date.',
            statusCode: 400
        });
    }

    try {
        // Retrieve budgets for the logged-in user within the specified date range
        const budgets = await db.Budget.findAll({
            where: {
                userId,
                createdAt: {
                    [db.Sequelize.Op.between]: [startDate, new Date(endDate.setHours(23, 59, 59, 999))] // Include entire end date
                }
            },
            order: [['createdAt', 'ASC']] // Sort results by createdAt in ascending order
        });

        // Convert `items` field from JSON to array
        const formattedBudgets = budgets.map((budget) => ({
            ...budget.toJSON(),
            items: JSON.parse(budget.items)
        }));

        return res.status(200).json({
            success: true,
            message: 'Budgets retrieved successfully.',
            data: formattedBudgets,
            statusCode: 200
        });
    } catch (error) {
        console.error('Error retrieving budgets:', error);
        return res.status(500).json({
            success: false,
            message: 'Error retrieving budgets.',
            statusCode: 500
        });
    }
});

module.exports = router;
