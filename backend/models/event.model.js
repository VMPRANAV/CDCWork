const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    startAt: { type: Date, required: true },
    endAt: { type: Date },
    type: {
        type: String,
        enum: ['round', 'generic'],
        default: 'generic'
    },
    visibility: {
        type: String,
        enum: ['admin', 'student', 'all'],
        default: 'admin'
    },
    status: {
        type: String,
        enum: ['scheduled', 'cancelled', 'completed'],
        default: 'scheduled'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job'
    },
    round: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Round'
    },
    location: { type: String, trim: true },
    links: [{
        label: { type: String, trim: true },
        url: { type: String, trim: true }
    }],
    targets: [{
        refType: {
            type: String,
            enum: ['user', 'department', 'passoutYear'],
            default: 'user'
        },
        refId: { type: String, trim: true }
    }],
    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    calendarOptions: {
        color: { type: String, trim: true },
        allDay: { type: Boolean, default: false },
        isDraft: { type: Boolean, default: false }
    }
}, { timestamps: true });

eventSchema.index({ startAt: 1, visibility: 1 });
eventSchema.index({ round: 1 }, { unique: true, sparse: true });

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;
