const mongoose = require('mongoose');
const Event = require('../models/event.model');
const Round = require('../models/round.model');
const Job = require('../models/job.model');
const Application = require('../models/application.model');

const DEFAULT_WINDOW_DAYS = 30;
const VISIBILITY_MAP = {
    admin: ['admin', 'student', 'all'],
    student: ['student', 'all']
};

const ensureDates = (start, end) => {
    const now = new Date();
    const rangeStart = start ? new Date(start) : now;
    const rangeEnd = end
        ? new Date(end)
        : new Date(rangeStart.getTime() + DEFAULT_WINDOW_DAYS * 24 * 60 * 60 * 1000);

    return { rangeStart, rangeEnd };
};

const buildDateQuery = (rangeStart, rangeEnd) => ({
    $or: [
        {
            startAt: { $gte: rangeStart, $lte: rangeEnd }
        },
        {
            endAt: { $exists: true, $ne: null, $gte: rangeStart, $lte: rangeEnd }
        },
        {
            startAt: { $lte: rangeStart },
            endAt: { $exists: true, $ne: null, $gte: rangeStart }
        }
    ]
});

const mapEventDocument = (eventDoc) => ({
    id: eventDoc._id.toString(),
    title: eventDoc.title,
    description: eventDoc.description,
    startAt: eventDoc.startAt,
    endAt: eventDoc.endAt,
    type: eventDoc.type,
    visibility: eventDoc.visibility,
    status: eventDoc.status,
    location: eventDoc.location,
    job: eventDoc.job,
    round: eventDoc.round,
    links: eventDoc.links || [],
    targets: eventDoc.targets || [],
    metadata: eventDoc.metadata || {},
    calendarOptions: eventDoc.calendarOptions || {},
    source: 'event',
    createdBy: eventDoc.createdBy
});

const mapRoundToEvent = (round, options = {}) => {
    const job = round.job || options.job;
    return {
        id: `round:${round._id.toString()}`,
        title: round.roundName,
        description: round.instructions || '',
        startAt: round.scheduledAt,
        endAt: round.scheduledAt,
        type: 'round',
        visibility: options.visibility || 'student',
        status: round.status,
        location: round.venue,
        job: job ? {
            id: job._id.toString(),
            companyName: job.companyName,
            jobTitle: job.jobTitle,
            status: job.status
        } : undefined,
        round: {
            id: round._id.toString(),
            sequence: round.sequence,
            autoAdvanceOnAttendance: round.autoAdvanceOnAttendance,
            isAttendanceMandatory: round.isAttendanceMandatory
        },
        links: [],
        targets: [],
        metadata: {
            mode: round.mode,
            type: round.type
        },
        calendarOptions: {
            color: options.color,
            allDay: false
        },
        source: 'round'
    };
};

const filterEventsByTargets = (events, user) => {
    if (!user || !Array.isArray(events)) {
        return events || [];
    }

    const dept = user.dept ? user.dept.toUpperCase() : null;
    const passoutYear = user.passoutYear ? String(user.passoutYear) : null;

    return events.filter((event) => {
        if (!event.targets || event.targets.length === 0) {
            return true;
        }

        return event.targets.some((target) => {
            if (!target || !target.refType) return false;
            switch (target.refType) {
                case 'user':
                    return target.refId === user._id.toString();
                case 'department':
                    return dept && target.refId && target.refId.toUpperCase() === dept;
                case 'passoutYear':
                    return passoutYear && target.refId === passoutYear;
                default:
                    return false;
            }
        });
    });
};

const fetchGenericEvents = async ({ user, rangeStart, rangeEnd }) => {
    const role = user?.role === 'admin' ? 'admin' : 'student';
    const visibility = VISIBILITY_MAP[role] || ['all'];

    const events = await Event.find({
        visibility: { $in: visibility },
        status: { $ne: 'cancelled' },
        ...buildDateQuery(rangeStart, rangeEnd)
    }).sort({ startAt: 1 });

    const mapped = events.map(mapEventDocument);
    return role === 'admin' ? mapped : filterEventsByTargets(mapped, user);
};

const fetchRoundEventsForAdmin = async ({ rangeStart, rangeEnd }) => {
    const rounds = await Round.find({
        scheduledAt: { $gte: rangeStart, $lte: rangeEnd },
        status: { $nin: ['cancelled', 'postponed', 'archived'] }
    })
        .populate({
            path: 'job',
            select: 'companyName jobTitle status'
        })
        .sort({ scheduledAt: 1 });

    return rounds.map((round) => mapRoundToEvent(round, { visibility: 'admin' }));
};

const fetchRoundEventsForStudent = async ({ user, rangeStart, rangeEnd }) => {
    if (!user) {
        return [];
    }

    const applications = await Application.find({
        student: user._id
    })
        .populate({
            path: 'job',
            select: 'companyName jobTitle status'
        })
        .populate({
            path: 'roundProgress.round',
            populate: {
                path: 'job',
                select: 'companyName jobTitle status'
            }
        });

    const roundIds = new Set();
    const results = [];

    for (const application of applications) {
        const job = application.job;
        if (!job || job.status !== 'public') {
            continue;
        }

        for (const progress of application.roundProgress || []) {
            const round = progress.round;
            if (!round || !round.scheduledAt) continue;
            if (round.status && ['cancelled', 'postponed', 'archived'].includes(round.status)) continue;

            const inRange = round.scheduledAt >= rangeStart && round.scheduledAt <= rangeEnd;
            if (!inRange) continue;

            const key = round._id.toString();
            if (roundIds.has(key)) continue;
            roundIds.add(key);

            results.push(
                mapRoundToEvent(round, { job, visibility: 'student' })
            );
        }
    }

    return results.sort((a, b) => new Date(a.startAt) - new Date(b.startAt));
};

const getCalendarEvents = async ({ user, start, end, scope }) => {
    const { rangeStart, rangeEnd } = ensureDates(start, end);
    const role = user?.role === 'admin' ? 'admin' : 'student';
    const includeRounds = !scope || scope === 'all' || scope === 'rounds';
    const includeGeneric = !scope || scope === 'all' || scope === 'generic';

    const [genericEvents, roundEvents] = await Promise.all([
        includeGeneric ? fetchGenericEvents({ user, rangeStart, rangeEnd }) : [],
        includeRounds
            ? (role === 'admin'
                ? fetchRoundEventsForAdmin({ rangeStart, rangeEnd })
                : fetchRoundEventsForStudent({ user, rangeStart, rangeEnd }))
            : []
    ]);

    return [...genericEvents, ...roundEvents].sort(
        (a, b) => new Date(a.startAt) - new Date(b.startAt)
    );
};

const createEvent = async ({ payload, user }) => {
    const data = {
        ...payload,
        createdBy: user._id,
        type: payload.type || 'generic'
    };

    if (data.type === 'round') {
        if (!data.round || !mongoose.Types.ObjectId.isValid(data.round)) {
            throw new Error('Round event must include a valid round ID.');
        }
        const existing = await Event.findOne({ round: data.round });
        if (existing) {
            throw new Error('Calendar event already exists for this round.');
        }
    }

    const event = new Event(data);
    await event.save();
    return mapEventDocument(event);
};

const updateEvent = async ({ eventId, payload }) => {
    const event = await Event.findById(eventId);
    if (!event) {
        const error = new Error('Event not found');
        error.statusCode = 404;
        throw error;
    }

    Object.assign(event, payload);
    await event.save();
    return mapEventDocument(event);
};

const updateEventVisibility = async ({ eventId, visibility }) => {
    const event = await Event.findById(eventId);
    if (!event) {
        const error = new Error('Event not found');
        error.statusCode = 404;
        throw error;
    }
    event.visibility = visibility;
    await event.save();
    return mapEventDocument(event);
};

const deleteEvent = async ({ eventId }) => {
    const event = await Event.findById(eventId);
    if (!event) {
        const error = new Error('Event not found');
        error.statusCode = 404;
        throw error;
    }
    await event.deleteOne();
    return { success: true };
};

module.exports = {
    getCalendarEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    updateEventVisibility,
    fetchRoundEventsForAdmin
};
