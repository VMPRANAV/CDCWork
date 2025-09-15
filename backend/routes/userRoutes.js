const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile } = require('../controller/userController.js');
const { protect } = require('../middleware/auth');

// All routes here are protected
router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

module.exports = router;