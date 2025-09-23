const express = require('express');
const router = express.Router();
const { getMyApplications, createApplication, updateApplication, getAllApplications } = require('../controller/application.controller');
const { protect,authorize } = require('../middleware/auth.middleware');

// We protect both routes to ensure a user is logged in
router.route('/').post(protect, createApplication);
router.route('/my-applications').get(protect, getMyApplications);
router.route('/:id').put(protect, authorize('admin'), updateApplication);
router.route('/').get(protect, authorize('admin'), getAllApplications);

module.exports = router;