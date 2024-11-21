// routes/student.js
const express = require('express');
const db = require('../models');
const router = express.Router();
const authenticateToken = require("../authentication/authenticate");
require('dotenv').config();

// Validation functions
const validateString = (value) => typeof value === 'string' && value.trim().length > 0;
const validateInteger = (value) => Number.isInteger(value);
const validateFloat = (value) => typeof value === 'number' && !isNaN(value);

// POST endpoint for creating a student
router.post('/', authenticateToken, async (req, res) => {
    const userId = req.user.id; // Extracting userId from the decoded token

    let { name, admissionNumber, nationalId, sex, course, department, years, semester, fees } = req.body;

    // Convert years and semester into integers
    years = parseInt(years, 10);
    semester = parseInt(semester, 10);
    fess = parseInt(fees, 10);

    // Validate input fields
    if (!validateString(name) || !validateString(admissionNumber) || !validateString(course) || !validateString(department)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid input: name, admissionNumber, course, and department must be non-empty strings.',
            statusCode: 400
        });
    }

    if (nationalId && !validateString(nationalId)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid input: nationalId must be a valid string if provided.',
            statusCode: 400
        });
    }

    if (!['male', 'female'].includes(sex)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid input: sex must be either "male" or "female".',
            statusCode: 400
        });
    }

    if (!validateInteger(years) || !validateInteger(semester)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid input: years and semester must be valid integers.',
            statusCode: 400
        });
    }

    if (!validateFloat(fees)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid input: fees must be a valid number.',
            statusCode: 400
        });
    }

    try {
        // Check if the admissionNumber already exists
        const existingStudent = await db.Student.findOne({
            where: { admissionNumber }
        });

        if (existingStudent) {
            return res.status(400).json({
                success: false,
                message: 'Error: A student with this admission number already exists.',
                statusCode: 400
            });
        }

        // Create a new student record
        const student = await db.Student.create({
            name,
            admissionNumber,
            nationalId,
            sex,
            course,
            department,
            years,
            semester,
            fees,
            userId: userId // The userId is extracted from the token
        });

        return res.status(201).json({
            success: true,
            message: 'Student created successfully.',
            data: student,
            statusCode: 201
        });

    } catch (error) {
        console.error('Error creating student:', error);
        return res.status(500).json({
            success: false,
            message: 'Error creating student.',
            statusCode: 500
        });
    }
});

module.exports = router;
