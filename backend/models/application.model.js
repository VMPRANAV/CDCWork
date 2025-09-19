const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    // Link to the Job model instead of storing duplicate text
    job: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Job' },
    status: {
        type: String,
        required: true,
        enum: ['Applied', 'Attended Round 1', 'Shortlisted', 'Offer Received', 'Rejected'],
        default: 'Applied'
    },
    appliedDate: { type: Date, default: Date.now }
}, { timestamps: true });

const Application = mongoose.model('Application', applicationSchema);
module.exports = Application;