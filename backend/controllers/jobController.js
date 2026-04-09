const Job = require('../models/Job')

// @route   GET /api/jobs
// @desc    Get all jobs for logged in user
// @access  Private
const getJobs = async (req, res) => {
    try {

        // Only get jobs that belong to THIS user
        const jobs = await Job.find({ user: req.user._id })
            .sort({ createdAt: -1 }) //newest first

        res.status(200).json({
            success: true,
            count: jobs.length,
            jobs
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


// @route   POST /api/jobs
// @desc    Create a new job
// @access  Private
const createJob = async (req, res) => {
    try {
        // Attach logged in user's id to the job
        // req.user._id comes from protect middleware
        const job = await Job.create({
            ...req.body,  // spread all fields from request
            user: req.user._id,  // add user id to link job to user
            // Save first status in history automatically!
            statusHistory: [{
                status: req.body.status || 'Applied',
                date: new Date(),
                note: 'Application created'
            }]
        })

        res.status(201).json({
            success: true,
            job
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}



// @route   GET /api/jobs/:id
// @desc    Get single job by ID
// @access  Private
const getJob = async (req, res) => {
    try {

        // req.params.id = the :id from URL
        // Example: /api/jobs/64abc123 → id = "64abc123"
        const job = await Job.findById(req.params.id)

        // Check if job exists
        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'You can only access your own jobs'
            })
        }


        // Check if this job belongs to logged in user
        // job.user is ObjectId → convert to string to compare
        if (job.user.toString() != req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You can only access your own jobs'
            })
        }

        res.status(200).json({
            success: true,
            job
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}



// @route   PUT /api/jobs/:id
// @desc    Update a job
// @access  Private
const updateJob = async (req, res) => {
    try {

        let job = await Job.findById(req.params.id)

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            })
        }

        // Security check — is this user's job?
        if (job.user.toString() != req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You can only update your own jobs'
            })
        }

        // Update the job
        // { new: true } → return updated job (not old one!)
        // { runValidators: true } → check schema rules on update too

        // Remove empty interviewDate so it doesn't break validation
        const updateData = { ...req.body }
        if (updateData.interviewDate === '') {
            delete updateData.interviewDate
        }

        // ── Track status change ──────────────────
        // If status changed → add to history!
        if (req.body.status && req.body.status !== job.status) {
            updateData.statusHistory = [
                ...job.statusHistory,
                {
                    status: req.body.status,
                    date: new Date(),
                    note: req.body.statusNote || ''
                }
            ]
        }

        job = await Job.findByIdAndUpdate(
            req.params.id,
            updateData,   //change by req.body
            { new: true, runValidators: true }
        )

        res.status(200).json({
            success: true,
            job
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


// @route   DELETE /api/jobs/:id
// @desc    Delete a job
// @access  Private
const deleteJob = async (req, res) => {
    try {

        const job = await Job.findById(req.params.id)

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            })
        }

        // Security check — is this user's job?
        if (job.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You can only delete your own jobs'
            })
        }

        await job.deleteOne()

        res.status(200).json({
            success: true,
            message: 'Job deleted successfully'
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = { getJobs, createJob, getJob, updateJob, deleteJob }
