const express = require('express')
const router = express.Router()

const {
    getJobs,
    createJob,
    getJob,
    updateJob,
    deleteJob
} = require('../controllers/jobController')
const { protect } = require('../middleware/auth')

// protect is applied to ALL routes below
// because ALL job routes need login!
router.use(protect)

router.route('/')
    .get(getJobs) // GET /api/jobs
    .post(createJob)   // POST /api/jobs

router.route('/:id')
    .get(getJob)    // GET    /api/jobs/:id
    .put(updateJob)  // PUT    /api/jobs/:id
    .delete(deleteJob)   // DELETE /api/jobs/:id

module.exports = router