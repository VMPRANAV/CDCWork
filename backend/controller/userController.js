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
        const fieldsToUpdate = {};
        if (req.body.fullName) fieldsToUpdate.fullName = req.body.fullName;
        if (req.body.email) fieldsToUpdate.email = req.body.email;
        if (req.body.year) fieldsToUpdate.year = req.body.year;
        if (req.body.department) fieldsToUpdate.department = req.body.department;
        if (req.body.cgpa) fieldsToUpdate.cgpa = req.body.cgpa;
        if (req.body.arrears !== undefined) fieldsToUpdate.arrears = req.body.arrears;
        if (req.body.codingLinks) fieldsToUpdate.codingLinks = req.body.codingLinks;

        // --- FIX: This block now handles both strings and arrays ---
        if (req.body.skills !== undefined) {
            if (typeof req.body.skills === 'string') {
                // If it's a string from the input field, split it
                fieldsToUpdate.skills = req.body.skills.split(',').map(s => s.trim());
            } else {
                // Otherwise, assume it's already an array
                fieldsToUpdate.skills = req.body.skills;
            }
        }
        // --- End of fix ---

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { $set: fieldsToUpdate },
            { new: true, runValidators: true, context: 'query' }
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