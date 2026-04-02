const jwt = require('jsonwebtoken')
const User = require('../models/User')

const protect = async (req, res, next) => {

    let token;

    // Step 1: Check if token exists in header
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Step 2: Extract token
            // "Bearer eyJhbGci..." → split by space → take index 1
            token = req.headers.authorization.split(' ')[1]

            // Step 3: Verify token is valid 
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            // decoded = { id: "64abc123...", iat: ..., exp: ... }

            // Step 4: Find user and attach to request
            req.user = await User.findById(decoded.id).select('-password')
            // Now every route can use req.user to know WHO is logged in!

            next(); // Token valid → continue to route

        } catch (error) {
            //Token exists but is invalid or expired
            return res.status(401).json({
                success: false,
                message: 'Not authorized, token failed'
            })
        }
    }

    // No token found at all
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized, no token provided'
        })
    }
}

module.exports = { protect }