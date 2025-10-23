const express = require('express');
const router = express.Router();
const {
    createEvent,
    getEvents,
    getEventById,
    updateEvent,
    deleteEvent,
    getUpcomingEvents,
    updateEventRSVP,
    getEventsForUser,
    getEventsForAdmin
} = require('../controller/event.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

// Get upcoming events (for dashboard) - accessible to all authenticated users
router.route('/upcoming').get(protect, getUpcomingEvents);

// Get events for current user (student view)
router.route('/my-events').get(protect, authorize('student'), getEventsForUser);

// Get all events for admin management
router.route('/admin').get(protect, authorize('admin'), getEventsForAdmin);

// Create new event (admin only)
router.route('/').post(protect, authorize('admin'), createEvent);

// Get all events with optional filtering
router.route('/').get(protect, getEvents);

// Get specific event by ID
router.route('/:eventId').get(protect, getEventById);

// Update event (admin only)
router.route('/:eventId').put(protect, authorize('admin'), updateEvent);

// Delete event (admin only)
router.route('/:eventId').delete(protect, authorize('admin'), deleteEvent);

// Update RSVP status for an event (students)
router.route('/:eventId/rsvp').put(protect, authorize('student'), updateEventRSVP);

module.exports = router;
