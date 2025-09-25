const express = require('express');
const router = express.Router();
const { createJob, getEligibleJobs, getJobs, getEligibleStudentsForJob, updateJob, publishJob, updateEligibleStudents } = require('../controller/job.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

// Admin route to create a new job
router.route('/').post(protect, authorize('admin'), createJob);
router.route('/').get(protect,authorize('admin'),getJobs);

// Admin route to update a job
router.route('/:jobId').put(protect, authorize('admin'), updateJob);

// Admin route to update eligible students list
router.route('/:jobId/eligible-students').put(protect, authorize('admin'), updateEligibleStudents);

// Admin route to get eligible students for a specific job
router.route('/:jobId/eligible-students').get(protect, authorize('admin'), getEligibleStudentsForJob);

// Admin route to publish a job
router.route('/:jobId/publish').post(protect, authorize('admin'), publishJob);

// Student route to see jobs they are eligible for
router.route('/eligible').get(protect, authorize('student'), getEligibleJobs);

module.exports = router;