const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1]; // Get the token after "Bearer"
    
    if (!token) {
        return res.status(403).json({
            success: false,
            message: 'Token not provided.',
            statusCode: 403
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({
                success: false,
                message: 'Invalid token.',
                statusCode: 403
            });
        }
        req.user = decoded; // Add decoded user info to the request
        next();
    });
};

module.exports = authenticateToken;
