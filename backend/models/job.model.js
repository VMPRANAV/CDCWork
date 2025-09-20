const mongoose = require('mongoose');

const roundSchema = new mongoose.Schema({
    roundName: { type: String, required: true },
    date: { type: Date, required: true },
    attendance: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

const jobSchema = new mongoose.Schema({
    companyName: { type: String, required: true, trim: true },
    jobTitle: { type: String, required: true, trim: true },
    jobDescription: { type: String, required: true },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Admin who posted
    
    eligibility: {
        minCgpa: { type: Number, default: 0 },
        minTenthMarks: { type: Number, default: 0 },
        minTwelfthMarks: { type: Number, default: 0 },
        passoutYear: { type: Number, required: true },
        allowedDepartments: [{ type: String }], // e.g., ['CSE', 'IT']
        maxArrears: { type: Number, default: 0 }
    },
    
    rounds: [roundSchema], // Array to store interview rounds

    applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    status : {
        type : String,
        enum : ['OPEN','IN_PROGRESS','CLOSED'],
        default : 'OPEN'
    }

}, { timestamps: true });

const Job = mongoose.model('Job', jobSchema);
module.exports = Job;