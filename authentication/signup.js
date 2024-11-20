const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models'); 
const router = express.Router();
require('dotenv').config();

// Validation functions
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const validateRole = (role) => ['accountant', 'manager', 'director'].includes(role);

const validateString = (value) => typeof value === 'string' && value.trim().length > 0;

// POST endpoint for user registration
router.post('/', async (req, res) => {
    let { name, username, nationalId, pfNo, role } = req.body;

    // Convert username to lowercase
    if (username) {
        username = username.toLowerCase();
    }

    // Validate input
    if (!validateString(name)) {
        return res.status(400).json({ 
            success: false, 
            message: 'Invalid or missing name.', 
            statusCode: 400 
        });
    }

    if (!validateEmail(username)) {
        return res.status(400).json({ 
            success: false, 
            message: 'Invalid username. Must be a valid email.', 
            statusCode: 400 
        });
    }

    if (!validateString(nationalId)) {
        return res.status(400).json({ 
            success: false, 
            message: 'Invalid or missing national ID.', 
            statusCode: 400 
        });
    }

    if (!validateString(pfNo)) {
        return res.status(400).json({ 
            success: false, 
            message: 'Invalid or missing PF number.', 
            statusCode: 400 
        });
    }

    if (!validateRole(role)) {
        return res.status(400).json({ 
            success: false, 
            message: `Invalid role. Must be one of: accountant, manager, or director.`, 
            statusCode: 400 
        });
    }

    try {
        // Check if username (email) or PF number already exists
        const existingUser = await db.User.findOne({ 
            where: { username }
        });
        
        if (existingUser) {
            return res.status(409).json({ 
                success: false, 
                message: 'Username already exists.', 
                statusCode: 409 
            });
        }

        const existingPfNo = await db.User.findOne({
            where: { pfNo }
        });

        if (existingPfNo) {
            return res.status(409).json({ 
                success: false, 
                message: 'PF number is already assigned to another user.', 
                statusCode: 409 
            });
        }

        // Default password
        const password = 'Complex2024!';
        
        // Salt and hash the password
        const saltKey = process.env.SALTING_KEY || ''; 
        const saltedPassword = password + saltKey;
        const hashedPassword = await bcrypt.hash(saltedPassword, 10);

        // Create new user
        const newUser = await db.User.create({
            name,
            username,
            nationalId,
            pfNo,
            role,
            password: hashedPassword,
        });

        // Generate JWT token
        const token = jwt.sign(
            { 
                id: newUser.id, 
                username: newUser.username, 
                role: newUser.role 
            },
            process.env.JWT_SECRET, 
            { expiresIn: '8h' } 
        );

        return res.status(201).json({
            success: true,
            message: 'User created successfully.',
            statusCode: 201,
            token, 
        });
    } catch (error) {
        console.error('Error creating user:', error);
        return res.status(500).json({
            success: false,
            message: 'Error creating user.',
            statusCode: 500,
        });
    }
});

module.exports = router;
