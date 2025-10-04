const mongoose = require('mongoose');

const roundSchema = require('./round.model');

const jobSchema = new mongoose.Schema({
    // --- Core Details ---
    companyName: { type: String, required: true, trim: true },
    jobTitle: { type: String, required: true, trim: true },
    companyDescription: { type: String, required: true },
    jobDescription: { type: String, required: true },
    salary: { type: String, trim: true },
    locations: [{ type: String }],
    
    // Simplified to single attachment links field
    attachmentLinks: [{ type: String }], // Array of URLs/links
   
    // --- Eligibility Criteria ---
    eligibility: {
        minCgpa: { type: Number, default: 0 },
        minTenthPercent: { type: Number, default: 0 },
        minTwelfthPercent: { type: Number, default: 0 },
        passoutYear: { type: Number, required: true },
        allowedDepartments: [{ type: String }],
        maxArrears: { type: Number, default: 0 }
    },

    // --- Application Rounds ---
    rounds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Round'
    }],
    
    // --- Management & Status ---
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['private', 'public'],
        default: 'private'
    },
    
    // --- Applicant Tracking ---
    eligibleStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]

}, { timestamps: true });

const Job = mongoose.model('Job', jobSchema);
module.exports = Job;