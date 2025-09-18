const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile, getAllStudents} = require('../controller/userController.js');
const { protect, authorize } = require('../middleware/auth');

// All routes here are protected
router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

// This route is for admins to get all students
router.route('/')
    .get(protect, authorize('admin'), getAllStudents);

module.exports = router;