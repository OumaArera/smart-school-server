const express = require('express');
const db = require('../models');
const router = express.Router();
const authenticateToken = require("../authentication/authenticate");
require('dotenv').config();

// Validation functions
const validateInteger = (value) => Number.isInteger(value);
const validateFloat = (value) => typeof value === 'number' && !isNaN(value);
const validateString = (value) => typeof value === 'string' && value.trim().length > 0;

// Function to generate transxId
const generateTransxId = () => {
    const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, '').slice(0, 14); // Format: YYYYMMDDHHMMSS
    const randomString = (Math.random().toString(36).substring(2, 4).toUpperCase() +
                          Math.floor(Math.random() * 10)).slice(0, 3); // Random letters and a number
    return `SS-${timestamp}-${randomString}`;
};

// POST endpoint for creating fees
// POST endpoint for creating fees
router.post('/', authenticateToken, async (req, res) => {
    const userId = req.user.id; // Extracting userId from the decoded token

    const { studentId, amount, paymentType, transactionId, purpose } = req.body;

    // Convert amount to float
    const amountAsFloat = parseFloat(amount);

    // Validate paymentType and purpose
    if (!validateString(paymentType)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid paymentType. It must be a non-empty string.',
            statusCode: 400
        });
    }

    if (!validateString(purpose)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid purpose. It must be a non-empty string.',
            statusCode: 400
        });
    }

    // Generate transxId
    const transxId = generateTransxId();

    // Validate input fields
    if (!validateInteger(studentId) || studentId <= 0) {
        return res.status(400).json({
            success: false,
            message: 'Invalid studentId. It must be a positive integer.',
            statusCode: 400
        });
    }

    // Validate amount after converting to float
    if (!validateFloat(amountAsFloat) || amountAsFloat <= 0) {
        return res.status(400).json({
            success: false,
            message: 'Invalid amount. It must be a valid positive number.',
            statusCode: 400
        });
    }

    try {
        // Retrieve the student's details (semester and year)
        const student = await db.Student.findOne({
            where: { id: studentId, status: 'active' || "deferred" } 
        });

        // Check if student exists
        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found or not active.',
                statusCode: 404
            });
        }

        // Extract semester and year from the student data
        const { semester, years } = student;

        // Create a new fees record
        const fees = await db.Fees.create({
            studentId,
            userId, // userId is extracted from the token
            semester,
            year: years,
            amount: amountAsFloat, // Use the float value of amount
            paymentType,
            transactionId: transactionId || null, 
            purpose,
            transxId
        });

        // Update the balance by adding the fee amount to the first available balance
        const balance = await db.Balance.findOne(); // Fetch the first available balance record

        if (balance) {
            // Update balance
            balance.balance += amountAsFloat;

            await balance.save(); // Save the updated balance
        } else {
            // If no balance exists, create a new balance entry
            await db.Balance.create({
                userId,
                balance: amountAsFloat, // Set the balance to the fee amount if no previous balance exists
            });
        }

        return res.status(201).json({
            success: true,
            message: 'Fees data created and balance updated successfully.',
            data: fees,
            statusCode: 201
        });

    } catch (error) {
        console.error('Error creating fees and updating balance:', error);
        return res.status(500).json({
            success: false,
            message: 'Error creating fees and updating balance.',
            statusCode: 500
        });
    }
});

module.exports = router;

