const mongoose = require('mongoose');
const Event = require('../models/event.model');
const User = require('../models/user.model');

// Helper function to handle async errors
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// Helper function to send success response
const sendSuccess = (res, data, message = 'Success', statusCode = 200) => {
    res.status(statusCode).json({
        success: true,
        message,
        data
    });
};

// Helper function to send error response
const sendError = (res, message = 'Server Error', statusCode = 500) => {
    res.status(statusCode).json({
        success: false,
        message
    });
};

// Create new event (Admin only)
const createEvent = asyncHandler(async (req, res) => {
    const {
        title,
        description,
        start,
        end,
        type,
        participants,
        company,
        jobPosting,
        location,
        meetingLink,
        isPublic,
        maxParticipants,
        priority
    } = req.body;

    // Validate required fields
    if (!title || !start || !end || !type) {
        return sendError(res, 'Title, start time, end time, and type are required', 400);
    }

    // Validate date logic
    if (new Date(start) >= new Date(end)) {
        return sendError(res, 'End time must be after start time', 400);
    }

    // Prepare participants array
    let participantsArray = [];
    if (participants && participants.length > 0) {
        // Validate participants exist and get their info
        const users = await User.find({ _id: { $in: participants } });
        if (users.length !== participants.length) {
            return sendError(res, 'Some participants not found', 400);
        }

        participantsArray = participants.map(userId => ({
            user: userId,
            status: 'PENDING',
            invitedAt: new Date()
        }));
    }

    const event = await Event.create({
        title,
        description,
        start: new Date(start),
        end: new Date(end),
        type,
        participants: participantsArray,
        createdBy: req.user._id,
        company,
        jobPosting,
        location,
        meetingLink,
        isPublic: isPublic || false,
        maxParticipants,
        priority
    });

    const populatedEvent = await Event.findById(event._id)
        .populate('participants.user', 'firstName lastName collegeEmail')
        .populate('createdBy', 'firstName lastName');

    sendSuccess(res, populatedEvent, 'Event created successfully', 201);
});

// Get all events with filtering
const getEvents = asyncHandler(async (req, res) => {
    const {
        startDate,
        endDate,
        type,
        companyId,
        limit = 50,
        page = 1
    } = req.query;

    const query = {};

    // Add date filters
    if (startDate || endDate) {
        query.start = {};
        if (startDate) query.start.$gte = new Date(startDate);
        if (endDate) query.start.$lte = new Date(endDate);
    }

    // Add type filter
    if (type) {
        query.type = type;
    }

    // Add company filter
    if (companyId) {
        query.company = companyId;
    }

    // Add status filter (only active events)
    query.status = 'ACTIVE';

    const skip = (page - 1) * limit;

    const events = await Event.find(query)
        .populate('participants.user', 'firstName lastName collegeEmail role')
        .populate('createdBy', 'firstName lastName collegeEmail role')
        .populate('company', 'companyName jobTitle')
        .sort({ start: 1 })
        .limit(parseInt(limit))
        .skip(skip);

    const total = await Event.countDocuments(query);

    sendSuccess(res, {
        events,
        pagination: {
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
            limit: parseInt(limit)
        }
    });
});

// Get specific event by ID
const getEventById = asyncHandler(async (req, res) => {
    const { eventId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
        return sendError(res, 'Invalid event ID', 400);
    }

    const event = await Event.findById(eventId)
        .populate('participants.user', 'firstName lastName collegeEmail role dept')
        .populate('createdBy', 'firstName lastName collegeEmail role')
        .populate('company', 'companyName jobTitle');

    if (!event) {
        return sendError(res, 'Event not found', 404);
    }

    sendSuccess(res, event);
});

// Update event (Admin only)
const updateEvent = asyncHandler(async (req, res) => {
    const { eventId } = req.params;
    const updates = req.body;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
        return sendError(res, 'Invalid event ID', 400);
    }

    // Prevent updating certain fields
    const allowedUpdates = [
        'title', 'description', 'start', 'end', 'type', 'location',
        'meetingLink', 'isPublic', 'maxParticipants', 'priority', 'status'
    ];

    const filteredUpdates = {};
    Object.keys(updates).forEach(key => {
        if (allowedUpdates.includes(key)) {
            filteredUpdates[key] = updates[key];
        }
    });

    // Validate date logic if dates are being updated
    if (filteredUpdates.start && filteredUpdates.end) {
        if (new Date(filteredUpdates.start) >= new Date(filteredUpdates.end)) {
            return sendError(res, 'End time must be after start time', 400);
        }
    }

    const event = await Event.findByIdAndUpdate(
        eventId,
        { ...filteredUpdates, updatedAt: new Date() },
        { new: true, runValidators: true }
    )
    .populate('participants.user', 'firstName lastName collegeEmail')
    .populate('createdBy', 'firstName lastName');

    if (!event) {
        return sendError(res, 'Event not found', 404);
    }

    sendSuccess(res, event, 'Event updated successfully');
});

// Delete event (Admin only)
const deleteEvent = asyncHandler(async (req, res) => {
    const { eventId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
        return sendError(res, 'Invalid event ID', 400);
    }

    const event = await Event.findByIdAndUpdate(
        eventId,
        { status: 'CANCELLED' },
        { new: true }
    );

    if (!event) {
        return sendError(res, 'Event not found', 404);
    }

    sendSuccess(res, { id: eventId }, 'Event cancelled successfully');
});

// Get upcoming events for dashboard
const getUpcomingEvents = asyncHandler(async (req, res) => {
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const events = await Event.findForUser(req.user._id, now, nextWeek)
        .limit(10);

    sendSuccess(res, events);
});

// Update RSVP status (Students only)
const updateEventRSVP = asyncHandler(async (req, res) => {
    const { eventId } = req.params;
    const { status } = req.body;

    if (!['ACCEPTED', 'DECLINED', 'TENTATIVE'].includes(status)) {
        return sendError(res, 'Invalid RSVP status', 400);
    }

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
        return sendError(res, 'Invalid event ID', 400);
    }

    const event = await Event.findById(eventId);
    if (!event) {
        return sendError(res, 'Event not found', 404);
    }

    // Check if user is a participant
    const participantIndex = event.participants.findIndex(
        p => p.user.toString() === req.user._id.toString()
    );

    if (participantIndex === -1) {
        return sendError(res, 'You are not invited to this event', 403);
    }

    // Update RSVP status
    event.participants[participantIndex].status = status;
    event.participants[participantIndex].respondedAt = new Date();

    await event.save();

    const updatedEvent = await Event.findById(eventId)
        .populate('participants.user', 'firstName lastName collegeEmail');

    sendSuccess(res, updatedEvent, 'RSVP updated successfully');
});

// Get events for current user (Student view)
const getEventsForUser = asyncHandler(async (req, res) => {
    const {
        startDate,
        endDate,
        type,
        limit = 50,
        page = 1
    } = req.query;

    const start = startDate ? new Date(startDate) : new Date();
    const end = endDate ? new Date(endDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // Next 30 days

    const events = await Event.findForUser(req.user._id, start, end)
        .limit(parseInt(limit))
        .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Event.countDocuments({
        'participants.user': req.user._id,
        status: 'ACTIVE'
    });

    sendSuccess(res, {
        events,
        pagination: {
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
            limit: parseInt(limit)
        }
    });
});

// Get events for admin management
const getEventsForAdmin = asyncHandler(async (req, res) => {
    const {
        startDate,
        endDate,
        type,
        limit = 50,
        page = 1
    } = req.query;

    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;

    const events = await Event.findForAdmin(req.user._id, start, end)
        .limit(parseInt(limit))
        .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Event.countDocuments({ createdBy: req.user._id });

    sendSuccess(res, {
        events,
        pagination: {
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
            limit: parseInt(limit)
        }
    });
});

module.exports = {
    createEvent,
    getEvents,
    getEventById,
    updateEvent,
    deleteEvent,
    getUpcomingEvents,
    updateEventRSVP,
    getEventsForUser,
    getEventsForAdmin
};
