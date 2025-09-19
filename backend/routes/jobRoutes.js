const express = require('express');
const router = express.Router();
const { createJob, getEligibleJobs } = require('../controller/job.controller');
const { protect, authorize } = require('../middleware/auth');

// Admin route to create a new job
router.route('/').post(protect, authorize('admin'), createJob);

// Student route to see jobs they are eligible for
router.route('/eligible').get(protect, authorize('student'), getEligibleJobs);

module.exports = router;