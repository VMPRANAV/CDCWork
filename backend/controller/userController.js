const User = require('../models/user.js');

// @desc    Get user profile
// @route   GET /api/users/profile
exports.getUserProfile = async (req, res) => {
    // req.user is available from the protect middleware
    res.status(200).json(req.user);
};

// @desc    Update user profile
// @route   PUT /api/users/profile
exports.updateUserProfile = async (req, res) => {
    try {
        // We use findByIdAndUpdate for efficiency.
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id, // User ID from the 'protect' middleware
            req.body,    // The request body contains all the new data
            {
                new: true, // Return the updated document
                runValidators: true, // Ensure the new data passes schema validation
                context: 'query'
            }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(updatedUser);
    } catch (error) {
        console.error('PROFILE UPDATE ERROR:', error);
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all students
// @route   GET /api/users
exports.getAllStudents = async (req, res) => {
    try {
        const students = await User.find({ role: 'student' }).select('-password');
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching students.' });
    }
};

// @desc    Upload a resume
// @route   POST /api/users/upload-resume
exports.uploadResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded.' });
        }
        // Find the user and update their resumeUrl field
        const user = await User.findById(req.user._id);
        user.resumeUrl = req.file.path; // The path where multer saved the file
        await user.save();
        res.status(200).json({ 
            message: 'Resume uploaded successfully', 
            resumeUrl: user.resumeUrl 
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Upload a profile photo
// @route   POST /api/users/upload-photo
exports.uploadPhoto = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded.' });
        }
        const user = await User.findById(req.user._id);
        user.photoUrl = req.file.path;
        await user.save();
        res.status(200).json({ 
            message: 'Photo uploaded successfully', 
            photoUrl: user.photoUrl 
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};