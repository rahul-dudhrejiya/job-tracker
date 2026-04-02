const User = require('../models/User')
const jwt = require('jsonwebtoken')

// HELPER: Generate JWT Token
// We reuse this in both register and login

const generateToken = (userId) => {
    return jwt.sign(
        { id: userId },  // payload → what to store inside
        process.env.JWT_SECRET,  // secret key → from .env
        { expiresIn: process.env.JWT_EXPIRE }  // expiry → 30d from .env
    )
}

// @route   POST /api/auth/register
// @desc    Create new user account
// @access  Public (no token needed)

const register = async (req, res) => {
    try {

        // Step 1: Get data from request body
        const { name, email, password } = req.body

        // Step 2: Validate all fields exist
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide name, email and password'
            })
        }

        //Step 3: Check user doesn't already exist
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'An account with this email already exists'
            })
        }

        // Step 4: Create user in database
        // Password gets auto-hashed by our User model pre-save hook!
        const user = await User.create({
            name,
            email,
            password
        })

        // Step 5: Generate token for this user
        const token = generateToken(user._id)

        // Step 6: Send response with token and user info
        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


// @route   POST /api/auth/login
// @desc    Login and get token
// @access  Public (no token needed)
const login = async (req, res) => {
    try {

        // Step 1: Get email and password
        const { email, password } = req.body

        // Step 2: Validate fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            })
        }

        // Step 3: Find user by email
        // .select('+password') → password has select:false in model
        // So we must EXPLICITLY ask for it here
        const user = await User.findOne({ email }).select('+password')

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email or password'
            })
        }


        // ── Step 4: Compare passwords ──
        // matchPassword is our custom method from User model
        const isPasswordCorrect = await user.matchPassword(password)

        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            })
            // NOTE: We say same message for wrong email AND wrong password
            // WHY? Security! Don't tell hackers which one was wrong!
        }

        // Step 5: Generate token
        const token = generateToken(user._id)

        // Step 6: Send response
        res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}



// @route   GET /api/auth/me
// @desc    Get currently logged in user
// @access  Private (token required)
const getMe = async (req, res) => {
    try {
        // req.user is set by our protect middleware
        // So we already have the user — just send it!
        res.status(200).json({
            success: true,
            user: req.user
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


module.exports = { register, login, getMe }