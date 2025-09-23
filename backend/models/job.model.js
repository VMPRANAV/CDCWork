const mongoose = require('mongoose');

const roundSchema = new mongoose.Schema({
    roundName: { type: String, required: true },
    date: { type: Date },
    venue: { type: String },
    attendance: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

const jobSchema = new mongoose.Schema({
    // --- Core Details ---
    companyName: { type: String, required: true, trim: true },
    jobTitle: { type: String, required: true, trim: true },
    jobDescription: { type: String, required: true },
    salary: { type: String, trim: true },
    locations: [{ type: String }],
    fileLink: { type: String }, // For attaching PDFs or other documents
    
    // --- Eligibility Criteria ---
    eligibility: {
        minCgpa: { type: Number, default: 0 },
        minTenthPercent: { type: Number, default: 0 },
        minTwelfthPercent: { type: Number, default: 0 }, // Renamed for consistency
        passoutYear: { type: Number, required: true },
        allowedDepartments: [{ type: String }],
        maxArrears: { type: Number, default: 0 }
    },

    // --- Application Rounds ---
    rounds: [{
        roundName: { type: String, required: true },
        date: { type: Date },
        venue: { type: String },
        attendance: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
    }],
    
    // --- Management & Status ---
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Links to the admin User
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