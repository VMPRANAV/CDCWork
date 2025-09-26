const express = require('express');
const { getDepartmentStats, getAllDepartmentStats } = require('../controller/department.controller.js');
const { protect, authorize } = require('../middleware/auth.middleware.js');

const router = express.Router();

// e.g., GET /api/departments/CSE/stats
router.get('/:deptName/stats', protect, authorize('admin'), getDepartmentStats);
router.get('/all-stats', protect, authorize('admin'), getAllDepartmentStats);

module.exports = router;