const express = require('express');
const router = express.Router();
// ✅ Fix the import - use the correct filename
const { 
    getAttendance, 
    updateDailyAttendance, 
    getAttendanceStats,
    updateAttendanceStats,
    getAllStudentsAttendance,
    deleteAttendance 
} = require('../controller/attendanceController'); // Changed from attendance.controller

// ✅ Simple routes without auth middleware
router.get('/', getAttendance);
router.put('/daily', updateDailyAttendance);
router.get('/stats', getAttendanceStats);
router.put('/stats', updateAttendanceStats);
router.get('/all', getAllStudentsAttendance);
router.delete('/:userId', deleteAttendance);

module.exports = router;