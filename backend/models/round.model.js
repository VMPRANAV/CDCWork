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
    isAttendanceMandatory: { type: Boolean, default: true },
    autoAdvanceOnAttendance: { type: Boolean, default: false },
    attendance: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    attendanceSession: {
        status: {
            type: String,
            enum: ['inactive', 'active'],
            default: 'inactive'
        },
        startedAt: { type: Date },
        startedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        refreshIntervalSeconds: { type: Number },
        currentCode: { type: String },
        currentCodeHash: { type: String },
        codeExpiresAt: { type: Date },
        sessionSecret: { type: String },
        offlineCodeHash: { type: String },
        offlineCodeUsedAt: { type: Date }
    },
    processedAt: { type: Date },
    status: {
        type: String,
        enum: ['scheduled', 'in-progress', 'completed', 'cancelled', 'postponed'],
        default: 'scheduled'
    }
}, { timestamps: true });

roundSchema.index({ job: 1, sequence: 1 }, { unique: true });

const Round = mongoose.model('Round', roundSchema);

module.exports = Round;