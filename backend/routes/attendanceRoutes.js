const express = require('express');
const router = express.Router();
const { getAttendance, updateDailyAttendance, getAttendanceStats } = require('../controller/attendanceController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

router.route('/')
    .get(getAttendance);

router.route('/daily')
    .put(updateDailyAttendance);

router.route('/stats')
    .get(getAttendanceStats);

module.exports = router;