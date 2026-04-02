const express = require('express')
const router = express.Router()
const { register, login, getMe } = require('../controllers/authController')
const { protect } = require('../middleware/auth')

// Public routes — no token needed
router.post('/register', register)
router.post('/login', login)

// Private route — token required
// protect runs FIRST, then getMe
router.get('/me', protect, getMe)

module.exports = router