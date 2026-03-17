const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true, trim: true, match: [/^[a-zA-Z]+$/, 'First name can only contain alphabets.'] },
    middleName: { type: String, trim: true, match: [/^[a-zA-Z]*$/, 'Middle name can only contain alphabets.'] },
    lastName: { type: String, required: true, trim: true, match: [/^[a-zA-Z]+$/, 'Last name can only contain alphabets.'] },
    fullName: { type: String, trim: true },
    collegeEmail: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^[a-zA-Z0-9.]+@kpriet\.ac\.in$/, 'Please use your official KPRIET email.']
    },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ['student', 'admin'], default: 'student' },
    isProfileComplete: { type: Boolean, default: false },
    universityRegNumber: {
        type: String,
        unique: true,
       sparse: true,
        match: [/^\d{16}$/, 'University Reg Number must be exactly 16 digits.'],
        required: true
    },
    rollNo: { type: String,unique: true,
        sparse: true, trim: true, required: true },
    dob: { type: Date, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    nationality: { type: String, trim: true, required: true },
    panNumber: { type: String, trim: true, uppercase: true },
    aadharNumber: { type: String, trim: true, required: true },
    mobileNumber: { type: String, required: true },
    personalEmail: { type: String, unique: true, sparse: true, lowercase: true, required: true },
    dept: {
        type: String,
        enum: ['AI&DS', 'BME', 'CHEM', 'CIVIL', 'CSE', 'CSE(AIML)', 'Cyber Security', 'CSBS', 'ECE', 'EEE', 'IT', 'Mechanical', 'Mechatronics'],
        required: true
    },
    cutoff12: { type: Number },
    quota: { type: String, enum: ['Management Quota(MQ)', 'Government Quota(GQ)'], required: true },
    passoutYear: { type: Number, required: true },
    historyOfArrears: { type: Number, default: 0 },
    currentArrears: { type: Number, default: 0 },
    ugCgpa: { type: Number, required: true },
    residence: { type: String, enum: ['Hostel', 'Day Scholar'], required: true },
    education: {
        tenth: {
            percentage: { type: Number, required: true },
            board: { type: String, enum: ['State', 'CBSE', 'ICSC', 'NEB', 'others'], required: true },
            passingYear: { type: Number, required: true }
        },
        twelth: {
            percentage: { type: Number },
            board: { type: String, enum: ['State', 'CBSE', 'ICSC', 'NEB', 'others'] },
            passingYear: { type: Number }
        },
        diploma: {
            percentage: { type: Number },
            passingYear: { type: Number }
        }
    },
    languages: {
        japanese: {
            knows: { type: Boolean, default: false },
            level: { type: String, enum: ['N5', 'N4', 'N3', 'N2', 'N1', 'Not Applicable'] }
        },
        german: {
            knows: { type: Boolean, default: false },
            level: { type: String, enum: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'Not Applicable'] }
        },
    },
    address: {
        street:{type:String, trim:true, required: true},
        pincode:{type:Number, required: true},
        city: { type: String, trim: true, required: true },
        state: { type: String, trim: true, required: true }
    },
    photoUrl: { type: String, required: true },
    resumeUrl: { type: String, required: true },
    codingProfiles: {
        leetcode: { type: String, trim: true, required: true },
        codeforces: { type: String, trim: true },
        hackerrank: { type: String, trim: true, required: true },
        geeksforgeeks: { type: String, trim: true },
        github: { type: String, trim: true, required: true }
    },
    isPlaced: { type: Boolean, default: false },
    company: { type: String, trim: true },
    package: { type: Number },
    isProfileComplete : { type: Boolean, default: false },
    placementDate: { type: Date },
    rejectionHistory: [{
        job: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Job'
        },
        round: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Round'
        },
        application: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Application'
        },
        reason: { type: String, trim: true },
        rejectedAt: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

userSchema.pre('save', async function() {
    if (this.isModified('firstName') || this.isModified('middleName') || this.isModified('lastName')) {
        this.fullName = [this.firstName, this.middleName, this.lastName].filter(Boolean).join(' ');
    }
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.pre('save', function(next) {
    const twelthProvided = this.education?.twelth && this.education.twelth.percentage && this.education.twelth.board && this.education.twelth.passingYear;
    const diplomaProvided = this.education?.diploma && this.education.diploma.percentage && this.education.diploma.passingYear;

    if (!twelthProvided && !diplomaProvided) {
        return next(new Error('Please provide either 12th grade or diploma details.'));
    }

    if (twelthProvided && diplomaProvided) {
        return next(new Error('You can only provide either 12th grade or diploma details, not both.'));
    }

    next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;