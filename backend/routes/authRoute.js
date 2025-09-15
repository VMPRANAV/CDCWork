const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');
const upload = require('../middleware/multer');

// POST /api/auth/register
// The 'upload.single('resume')' middleware processes the file upload
router.post('/register', upload.single('resume'), authController.register);

// POST /api/auth/login
router.post('/login', authController.login);

module.exports = router;