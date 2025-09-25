const mongoose = require('mongoose');

const roundSchema = new mongoose.Schema({
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    sequence: {
        type: Number,
        required: true
    },
    roundName: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        trim: true
    },
    mode: {
        type: String,
        enum: ['online', 'offline', 'hybrid'],
        default: 'offline'
    },
    scheduledAt: { type: Date },
    venue: { type: String },
    instructions: { type: String },
    isAttendanceMandatory: {
        type: Boolean,
        default: true
    },
    autoAdvanceOnAttendance: {
        type: Boolean,
        default: false
    },
    autoRejectAbsent: {
        type: Boolean,
        default: true
    },
    attendance: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    processedAt: { type: Date },
    status: {
        type: String,
        enum: ['scheduled', 'in_progress', 'completed', 'closed'],
        default: 'scheduled'
    }
}, { timestamps: true });

roundSchema.index({ job: 1, sequence: 1 }, { unique: true });

const Round = mongoose.model('Round', roundSchema);

module.exports = Round;