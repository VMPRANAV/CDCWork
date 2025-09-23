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
    status: {
        type: String,
        enum: ['Applied', 'Shortlisted', 'Technical Round', 'HR Round', 'Rejected', 'Placed'],
        default: 'Applied'
    }
}, { timestamps: true });

const Application = mongoose.model('Application', applicationSchema);
module.exports = Application;