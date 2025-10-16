const express = require('express');
const {
    getCalendar,
    getRoundCalendar,
    createEvent,
    updateEvent,
    deleteEvent,
    updateEventVisibility
} = require('../controller/calendar.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/', protect, authorize('admin', 'student'), getCalendar);
router.get('/rounds', protect, authorize('admin'), getRoundCalendar);
router.post('/events', protect, authorize('admin'), createEvent);
router.put('/events/:eventId', protect, authorize('admin'), updateEvent);
router.patch('/events/:eventId/visibility', protect, authorize('admin'), updateEventVisibility);
router.delete('/events/:eventId', protect, authorize('admin'), deleteEvent);

module.exports = router;
