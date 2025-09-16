const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    // This links the application to a specific student user.
    student: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' // This tells Mongoose to look in the 'User' collection.
    },
    companyName: {
        type: String,
        required: true,
        trim: true
    },
    jobTitle: {
        type: String,
        required: true,
        trim: true
    },
    // The "enum" ensures the status can only be one of these values.
    status: {
        type: String,
        required: true,
        enum: [
            'Applied',
            'Online Assessment',
            'Technical Interview',
            'HR Interview',
            'Offer Received',
            'Rejected'
        ],
        default: 'Applied'
    },
    appliedDate: {
        type: Date,
        default: Date.now
    },
    notes: { // An optional field for admins to add notes
        type: String,
        trim: true
    }
}, {
    timestamps: true // Adds createdAt and updatedAt automatically
});

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;