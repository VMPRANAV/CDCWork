const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile, getAllStudents, uploadResume, uploadPhoto} = require('../controller/userController.js');
const upload = require('../middleware/multer');
const { protect,authorize } = require('../middleware/auth');

// All routes here are protected
router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

// This route is for admins to get all students
router.route('/')
    .get(protect, authorize('admin'), getAllStudents);

router.route('/upload-resume').post(protect, upload.single('resume'), uploadResume);
router.route('/upload-photo').post(protect, upload.single('photo'), uploadPhoto);

module.exports = router;