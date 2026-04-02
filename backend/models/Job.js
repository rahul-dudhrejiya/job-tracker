const mongoose = require('mongoose')

const JobSchema = new mongoose.Schema(
    {
        // Which user does this job belong to?
        user: {
            type: mongoose.Schema.Types.ObjectId, //store user id
            ref: 'User',
            required: true,
        },
        company: {
            type: String,
            required: [true, 'Company name is required'],
            trim: true,
        },
        role: {
            type: String,
            required: [true, 'Job role is required'],
            trim: true,
        },
        location: {
            type: String,
            default: 'Remote',
        },
        status: {
            type: String,
            // only these values allowed!
            enum: ['Wishlist', 'Applied', 'Interview', 'Offer', 'Rejected'],
            default: 'Applied',
        },
        salary: {
            type: String,
            default: '',
        },
        jobUrl: {
            type: String,
            default: '',
        },
        notes: {
            type: String,
            default: '',
        },
        appliedData: {
            type: Date,
            default: Date.now,
        },
        priority: {
            type: String,
            enum: ['Low', 'Medium', 'High'], // only these values allowed
            default: 'Medium',
        },
    },
    {
        timestamps: true, // auto adds createdAt, updatedAt
    }
)

module.exports = mongoose.model('Job', JobSchema)