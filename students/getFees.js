const express = require('express');
const db = require('../models');
const router = express.Router();
const authenticateToken = require("../authentication/authenticate");

// Endpoint to get students and their fees details
router.get('/', authenticateToken, async (req, res) => {
    try {
        // 1. Retrieve all students whose status is 'active'
        const students = await db.Student.findAll({
            where: {
                status: 'active'
            }
        });

        if (!students || students.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No active students found.',
                statusCode: 404
            });
        }

        // 2. For each student, retrieve fees for the same year and semester
        const studentFeesPromises = students.map(async (student) => {
            const { id, admissionNumber, name, course, years, semester, fees: studentFees } = student;

            // Fetch all fee payments for the same year and semester
            const feesPayments = await db.Fees.findAll({
                where: {
                    studentId: id,
                    semester: semester,
                    year: years
                }
            });

            // Calculate the total fees paid in this semester
            const totalFeesPaid = feesPayments.reduce((total, fee) => total + fee.amount, 0);

            // Calculate arrears (difference between student fees and total fees paid)
            const arrears = studentFees - totalFeesPaid;

            // Return the student data with the total fees paid and arrears
            return {
                studentId: id,
                admissionNumber,
                name,
                course,
                year: years,
                semester,
                feesPaidThisSemester: totalFeesPaid,
                arrears: arrears > 0 ? arrears : 0 // Arrears cannot be negative
            };
        });

        // 3. Wait for all promises to resolve
        const studentsWithFees = await Promise.all(studentFeesPromises);

        // 4. Send the response with the calculated data
        return res.status(200).json({
            success: true,
            message: 'Students and their fees details retrieved successfully.',
            data: studentsWithFees,
            statusCode: 200
        });

    } catch (error) {
        console.error('Error retrieving students and their fees:', error);
        return res.status(500).json({
            success: false,
            message: 'Error retrieving students and their fees.',
            statusCode: 500
        });
    }
});

module.exports = router;
