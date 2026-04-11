require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express() // create app first

app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://job-tracker-backend-oslv.onrender.com',
        'https://job-tracker-ten-mauve.vercel.app'
    ],
    credentials: true
}))

//Create Express Application

//Setup Middleware
app.use(express.json())

//Import Routes (we make these later)
//now we will comment because file doesen't exist yet so further server won't run and crashed thats why
const authRoutes = require('./routes/auth')
const jobRoutes = require('./routes/jobs')

app.use('/api/auth', authRoutes)
app.use('/api/jobs', jobRoutes)

//Test Route
app.get('/', (req, res) => {
    res.json({
        message: 'Job Tracker API is running!',
        status: 'success'
    })
})

//Connect MongoDB then Start Server
const PORT = process.env.PORT || 5000
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Mongodb connect succesfully")
        app.listen(PORT, () => {
            console.log(`server is running on port ${PORT}`)
        })
    })
    .catch((error) => {
        console.log('MongoDB connection failed!')
        console.log('Error:', error.message)
        process.exit(1)
    })