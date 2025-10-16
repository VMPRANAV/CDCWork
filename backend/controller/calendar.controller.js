const calendarService = require('../services/calendar.service');

exports.getCalendar = async (req, res) => {
    try {
        const { start, end, scope } = req.query;
        const events = await calendarService.getCalendarEvents({
            user: req.user,
            start,
            end,
            scope
        });
        res.status(200).json(events);
    } catch (error) {
        console.error('Calendar fetch error:', error);
        res.status(500).json({ message: 'Failed to load calendar events.', error: error.message });
    }
};

exports.getRoundCalendar = async (req, res) => {
    try {
        const { start, end } = req.query;
        const { rangeStart, rangeEnd } = (() => {
            const now = new Date();
            const s = start ? new Date(start) : now;
            const e = end ? new Date(end) : new Date(s.getTime() + 30 * 24 * 60 * 60 * 1000);
            return { rangeStart: s, rangeEnd: e };
        })();

        const rounds = await calendarService.fetchRoundEventsForAdmin({
            rangeStart,
            rangeEnd
        });
        res.status(200).json(rounds);
    } catch (error) {
        console.error('Calendar rounds error:', error);
        res.status(500).json({ message: 'Failed to load round events.', error: error.message });
    }
};

exports.createEvent = async (req, res) => {
    try {
        const event = await calendarService.createEvent({
            payload: req.body,
            user: req.user
        });
        res.status(201).json(event);
    } catch (error) {
        console.error('Create event error:', error);
        res.status(400).json({ message: error.message || 'Failed to create event.' });
    }
};

exports.updateEvent = async (req, res) => {
    try {
        const event = await calendarService.updateEvent({
            eventId: req.params.eventId,
            payload: req.body
        });
        res.status(200).json(event);
    } catch (error) {
        const status = error.statusCode || 400;
        res.status(status).json({ message: error.message || 'Failed to update event.' });
    }
};

exports.updateEventVisibility = async (req, res) => {
    try {
        const { visibility } = req.body;
        const event = await calendarService.updateEventVisibility({
            eventId: req.params.eventId,
            visibility
        });
        res.status(200).json(event);
    } catch (error) {
        const status = error.statusCode || 400;
        res.status(status).json({ message: error.message || 'Failed to update visibility.' });
    }
};

exports.deleteEvent = async (req, res) => {
    try {
        await calendarService.deleteEvent({ eventId: req.params.eventId });
        res.status(200).json({ message: 'Event removed successfully.' });
    } catch (error) {
        const status = error.statusCode || 400;
        res.status(status).json({ message: error.message || 'Failed to delete event.' });
    }
};
