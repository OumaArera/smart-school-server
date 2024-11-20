// routes/student.js
const express = require('express');
const db = require('../models');
const router = express.Router();
const authenticateToken = require("../authentication/authenticate");
require('dotenv').config();

// GET endpoint for retrieving all active students
router.get('/', authenticateToken, async (req, res) => {
    try {
        // Fetch all students whose status is 'active'
        const students = await db.Student.findAll({
            where: {
                status: 'active'  // Only retrieve students with 'active' status
            }
        });

        // Return response with student data
        return res.status(200).json({
            success: true,
            message: 'Active students retrieved successfully.',
            data: students,
            statusCode: 200
        });

    } catch (error) {
        console.error('Error retrieving students:', error);
        return res.status(500).json({
            success: false,
            message: 'Error retrieving students.',
            statusCode: 500
        });
    }
});

module.exports = router;
