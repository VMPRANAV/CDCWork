const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    currentRound: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Round'
    },
    currentRoundSequence: { type: Number },
    finalStatus: {
        type: String,
        enum: ['in_process', 'rejected', 'placed'],
        default: 'in_process'
    },
    roundProgress: [{
        round: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Round',
            required: true
        },
        attendance: {
            type: Boolean,
            default: false
        },
        result: {
            type: String,
            enum: ['pending', 'selected', 'rejected'],
            default: 'pending'
        },
        decidedAt: { type: Date },
        notes: { type: String },
        attendanceMethod: {
            type: String,
            enum: ['admin_toggle', 'qr_code', 'offline_code','admin_advance'],
            default: 'admin_toggle'
        },
        attendanceMarkedAt: { type: Date }
    }],
    notes: { type: String }
}, { timestamps: true });

applicationSchema.index({ job: 1, student: 1 }, { unique: true });
applicationSchema.index({ 'roundProgress.round': 1, job: 1 });

const Application = mongoose.model('Application', applicationSchema);
module.exports = Application;