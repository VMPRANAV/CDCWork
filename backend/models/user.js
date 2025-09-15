const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Full name is required.'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required.'],
        unique: true,
        lowercase: true,
        trim: true,
        // Regex to validate that the email is an official college email
        match: [/^[a-zA-Z0-9.]+@kpriet\.ac\.in$/, 'Please use your official KPRIET email.']
    },
    password: {
        type: String,
        required: [true, 'Password is required.'],
        minlength: [6, 'Password must be at least 6 characters long.'],
        select: false // Prevents password from being sent in queries by default
    },
    role: {
        type: String,
        enum: ['student', 'admin'],
        default: 'student'
    },
    year: {
        type: Number,
        enum: [1, 2, 3, 4],
        required: [true, 'Year of study is required.']
    },
    department: {
        type: String,
        enum: ['IT', 'CSE', 'ECE', 'EEE', 'MECH', 'CIVIL'],
        required: [true, 'Department is required.']
    },
    cgpa: {
        type: Number,
        required: [true, 'CGPA is required.']
    },
    arrears: {
        type: Number,
        required: true,
        default: 0
    },
    resume: {
        type: String, // Will store the path or URL to the uploaded PDF
        required: [true, 'Resume is required.']
    },
    codingLinks: {
        type: String,
        trim: true
    },
    skills: {
        type: [String] // Storing skills as an array of strings
    },
    isVerified: {
        type: Boolean,
        default: false
    }
}, {
    // This option adds `createdAt` and `updatedAt` fields automatically
    timestamps: true
});

// --- Mongoose Middleware: Hashing the password before saving ---
// This function runs automatically before any 'save' operation on a User document.
userSchema.pre('save', async function(next) {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) {
        return next();
    }

    try {
        // Generate a salt and hash the password
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// --- Mongoose Instance Method: For comparing passwords ---
// This method can be called on a user instance (e.g., user.comparePassword('plainTextPassword'))
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};


// Create and export the User model
const User = mongoose.model('User', userSchema);

module.exports = User;