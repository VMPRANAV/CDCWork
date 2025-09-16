const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    academicYear: {
        type: String,
        required: true,
        default: '2025-26'
    },
    semester: {
        type: String,
        enum: ['Odd', 'Even'],
        required: true,
        default: 'Odd'
    },
    
    totalClasses: {
        type: Number,
        default: 0
    },
    presentClasses: {
        type: Number,
        default: 0
    },
    onDutyClasses: {
        type: Number,
        default: 0
    },
    absentClasses: {
        type: Number,
        default: 0
    },
    
    dailySchedule: [{
        session: {
            type: String,
            enum: ['FN', 'AN'], // Forenoon, Afternoon
            required: true
        },
        status: {
            type: String,
            enum: ['PRESENT', 'ON-DUTY', 'ABSENT'],
            required: true
        },
        subject: {
            type: String,
            default: ''
        },
        faculty: {
            type: String,
            default: ''
        },
        topic: {
            type: String,
            default: ''
        },
        date: {
            type: Date,
            default: Date.now
        }
    }],
    overallStats: {
        totalPercentage: {
            type: Number,
            default: 0
        },
        presentPercentage: {
            type: Number,
            default: 0
        },
        onDutyPercentage: {
            type: Number,
            default: 0
        },
        absentPercentage: {
            type: Number,
            default: 0
        }
    }
}, {
    timestamps: true
});

// Calculate overall stats before saving
attendanceSchema.pre('save', function(next) {
    // Calculate percentages based on class data
    if (this.totalClasses > 0) {
        this.overallStats.presentPercentage = Math.round((this.presentClasses / this.totalClasses) * 100 * 100) / 100;
        this.overallStats.onDutyPercentage = Math.round((this.onDutyClasses / this.totalClasses) * 100 * 100) / 100;
        this.overallStats.absentPercentage = Math.round((this.absentClasses / this.totalClasses) * 100 * 100) / 100;
        this.overallStats.totalPercentage = Math.round(((this.presentClasses + this.onDutyClasses) / this.totalClasses) * 100 * 100) / 100;
    } else {
        // If no classes, set all percentages to 0
        this.overallStats.presentPercentage = 0;
        this.overallStats.onDutyPercentage = 0;
        this.overallStats.absentPercentage = 0;
        this.overallStats.totalPercentage = 0;
    }
    next();
});

const Attendance = mongoose.model('Attendance', attendanceSchema);
module.exports = Attendance;