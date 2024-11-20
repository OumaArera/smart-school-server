const express = require('express');
const db = require('../models');
const router = express.Router();
const authenticateToken = require("../authentication/authenticate");

// Validation function for category and items
const validateCategory = (category) => typeof category === 'string' && category.trim().length > 0;
const validateItems = (items) => Array.isArray(items) && items.length > 0;

router.post('/', authenticateToken, async (req, res) => {
    const userId = req.user.id; // Extracting userId from the decoded token
    const { category, items } = req.body;

    // Validate inputs
    if (!validateCategory(category)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid category. It must be a non-empty string.',
            statusCode: 400
        });
    }

    if (!validateItems(items)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid items. It must be a non-empty array.',
            statusCode: 400
        });
    }

    // Convert items array to JSON
    const itemsJson = JSON.stringify(items);

    try {
        // Create a new Budget record in the database
        const budget = await db.Budget.create({
            category,
            userId, // userId from the token
            items: itemsJson, // Storing items as JSON
            status: 'pending', // Default status is pending
            reason: null // Reason can be null by default
        });

        return res.status(201).json({
            success: true,
            message: 'Budget created successfully.',
            data: budget,
            statusCode: 201
        });
    } catch (error) {
        console.error('Error creating budget:', error);
        return res.status(500).json({
            success: false,
            message: 'Error creating budget.',
            statusCode: 500
        });
    }
});

module.exports = router;
