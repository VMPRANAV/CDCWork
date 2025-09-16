const express = require('express');
const router = express.Router();
const { getMyApplications, createApplication, updateApplication, getAllApplications } = require('../controller/application.controller');

// ✅ Simple routes without complex auth
router.post('/', createApplication);
router.get('/', getAllApplications);
router.get('/my-applications', getMyApplications);
router.put('/:id', updateApplication);

module.exports = router;