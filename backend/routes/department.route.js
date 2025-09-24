const express = require('express');
const { getDepartmentStats } = require('../controller/department.controller.js');
const { protect, authorize } = require('../middleware/auth.middleware.js');

const router = express.Router();

// e.g., GET /api/departments/CSE/stats
router.get('/:deptName/stats', protect, authorize('admin'), getDepartmentStats);

module.exports = router;