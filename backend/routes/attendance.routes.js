const express = require('express');
const {
    startAttendanceSession,
    stopAttendanceSession,
    getAttendanceSessionStatus,
    submitAttendanceCode,
    getAttendeesForRound,
    streamAttendanceSession,
    broadcastAttendance
} = require('../controller/attendance.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/:roundId/attendance-session/start', protect, authorize('admin'), startAttendanceSession);
router.post('/:roundId/attendance-session/stop', protect, authorize('admin'), stopAttendanceSession);
router.get('/:roundId/attendance-session/status', protect, authorize('admin', 'student'), getAttendanceSessionStatus);
router.get('/:roundId/attendance-session/stream', protect, authorize('admin', 'student'), streamAttendanceSession);
router.post('/:roundId/attendance-checkin', protect, authorize('student'), submitAttendanceCode);
router.get('/:roundId/attendees', protect, authorize('admin'), getAttendeesForRound);

// Export broadcastAttendance for use in controller
module.exports = { router, broadcastAttendance };
