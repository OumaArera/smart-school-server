const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../models');
const router = express.Router();
const authenticateToken = require("../authentication/authenticate");
require('dotenv').config();

// Validation functions
const validateString = (value) => typeof value === 'string' && value.trim().length > 0;

// POST endpoint for changing user password
router.post('/', authenticateToken, async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id; // Now, we get user ID directly from decoded token

    // Validate input
    if (!currentPassword || !newPassword) {
        return res.status(400).json({
            success: false,
            message: 'Missing required fields: currentPassword or newPassword.',
            statusCode: 400
        });
    }

    try {
        // Fetch user from the database by ID
        const user = await db.User.findOne({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found.',
                statusCode: 404
            });
        }

        // Fetch the salt key from the environment variables
        const saltKey = process.env.SALTING_KEY;
        if (!saltKey) {
            throw new Error('Missing required keys');
        }

        // Append the salt to the current password and compare it with the stored password hash
        const saltedCurrentPassword = currentPassword + saltKey;
        const isCurrentPasswordValid = await bcrypt.compare(saltedCurrentPassword, user.password);

        if (!isCurrentPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid current password.',
                statusCode: 401
            });
        }

        // Salt and hash the new password
        const saltedNewPassword = newPassword + saltKey;
        const hashedNewPassword = await bcrypt.hash(saltedNewPassword, 10);

        // Update the password in the database
        user.password = hashedNewPassword;
        await user.save();

        return res.status(200).json({
            success: true,
            message: 'Password changed successfully.',
            statusCode: 200
        });

    } catch (error) {
        console.error('Error changing password:', error);
        return res.status(500).json({
            success: false,
            message: 'Error changing password.',
            statusCode: 500
        });
    }
});

module.exports = router;
