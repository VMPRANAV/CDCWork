const express = require('express');
const router = express.Router();
const { createJob, deleteJob,getEligibleJobs, getJobs, getEligibleStudentsForJob, updateJob, publishJob, updateEligibleStudents, downloadEligibleStudents, uploadJobFiles, uploadJobAttachmentFiles, getJobRounds } = require('../controller/job.controller');
const { protect, authorize } = require('../middleware/auth.middleware');
const { uploadJobFiles: uploadJobFilesMiddleware } = require('../middleware/multer.middleware');

// Admin route to create a new job
router.route('/').post(protect, authorize('admin'), createJob);
router.route('/').get(protect, authorize('admin'), getJobs);
router.route('/:jobId').delete(protect,authorize('admin'),deleteJob);
// Admin route to update a job
router.route('/:jobId').put(protect, authorize('admin'), updateJob);

// Admin route to update eligible students list
router.route('/:jobId/eligible-students').put(protect, authorize('admin'), updateEligibleStudents);

// Admin route to get eligible students for a specific job
router.route('/:jobId/eligible-students').get(protect, authorize('admin'), getEligibleStudentsForJob);
router.get(
  '/:jobId/eligible-students/download', protect, authorize('admin'), downloadEligibleStudents);

// Admin route to publish a job
router.route('/:jobId/publish').post(protect, authorize('admin'), publishJob);
router.route('/:jobId/rounds').get(protect, authorize('admin'), getJobRounds);

// Student route to see jobs they are eligible for
router.route('/eligible').get(protect, authorize('student'), getEligibleJobs);

// Add routes for file uploads
router.post('/upload-files', protect, authorize('admin'), uploadJobFilesMiddleware.array('jobFiles', 10), uploadJobFiles);
router.post('/upload-attachment-files', protect, authorize('admin'), uploadJobFilesMiddleware.array('attachmentFiles', 10), uploadJobAttachmentFiles);

module.exports = router;