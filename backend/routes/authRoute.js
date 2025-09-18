const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');


// POST /api/auth/register (JSON only)
router.post('/register', authController.register);

// POST /api/auth/login
router.post('/login', authController.login);

module.exports = router;