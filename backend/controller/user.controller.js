const User = require('../models/user.model');
const { cloudinary } = require('../.config/config');
const fs = require('fs');

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

        // Upload to Cloudinary as raw file
        const result = await cloudinary.uploader.upload(req.file.path, {
            resource_type: "raw",
            folder: "resumes",
            public_id: `resume_${req.user._id}_${Date.now()}`,
        });

        // Find the user and update their resumeUrl field
        const user = await User.findById(req.user._id);
        user.resumeUrl = result.secure_url;
        await user.save();

        // Clean up temporary file
        fs.unlinkSync(req.file.path);

        res.status(200).json({ 
            message: 'Resume uploaded successfully', 
            resumeUrl: user.resumeUrl 
        });
    } catch (error) {
        console.error('Resume upload error:', error);
        // Clean up temporary file if it exists
        if (req.file && req.file.path) {
            try {
                fs.unlinkSync(req.file.path);
            } catch (unlinkError) {
                console.error('Error deleting temporary file:', unlinkError);
            }
        }
        res.status(500).json({ message: 'Server error during resume upload' });
    }
};

// @desc    Upload a profile photo
// @route   POST /api/users/upload-photo
exports.uploadPhoto = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded.' });
        }

        // Upload to Cloudinary as image
        const result = await cloudinary.uploader.upload(req.file.path, {
            resource_type: "image",
            folder: "profile_photos",
            public_id: `photo_${req.user._id}_${Date.now()}`,
            transformation: [
                { width: 400, height: 400, crop: "limit" },
                { quality: "auto" }
            ]
        });

        // Find the user and update their photoUrl field
        const user = await User.findById(req.user._id);
        user.photoUrl = result.secure_url;
        await user.save();

        // Clean up temporary file
        fs.unlinkSync(req.file.path);

        res.status(200).json({ 
            message: 'Photo uploaded successfully', 
            photoUrl: user.photoUrl 
        });
    } catch (error) {
        console.error('Photo upload error:', error);
        // Clean up temporary file if it exists
        if (req.file && req.file.path) {
            try {
                fs.unlinkSync(req.file.path);
            } catch (unlinkError) {
                console.error('Error deleting temporary file:', unlinkError);
            }
        }
        res.status(500).json({ message: 'Server error during photo upload' });
    }
};

// @desc    Get user by ID (Admin only)
// @route   GET /api/users/:id
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user by ID:', error); 
        res.status(500).json({ message: 'Server error while fetching user.' });
    }
};

// @desc    Update user role (Admin only)
// @route   PUT /api/users/:id/role
exports.updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User role updated successfully', user });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update placement status (Admin only)
// @route   PUT /api/users/:id/placement-status
exports.updatePlacementStatus = async (req, res) => {
    try {
        const { isPlaced, company, package: packageAmount, placementDate } = req.body;
        
        const updateData = { isPlaced };
        if (isPlaced) {
            updateData.company = company;
            updateData.package = packageAmount;
            updateData.placementDate = placementDate || new Date();
        } else {
            updateData.company = undefined;
            updateData.package = undefined;
            updateData.placementDate = undefined;
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'Placement status updated successfully', user });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Admin update of student record
// @route   PUT /api/users/:id
exports.adminUpdateStudent = async (req, res) => {
    try {
        const updates = { ...req.body };
        delete updates.password;
        delete updates._id;
        delete updates.createdAt;
        delete updates.updatedAt;

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.role !== 'student') {
            return res.status(400).json({ message: 'Only student accounts can be updated through this endpoint.' });
        }

        // Apply updates safely
        user.set(updates, { strict: false });

        if (updates.isPlaced === false) {
            user.company = undefined;
            user.package = undefined;
            user.placementDate = undefined;
        }

        if (updates.isPlaced === true && !user.placementDate) {
            user.placementDate = new Date();
        }

        await user.save();
        const sanitized = user.toObject();
        delete sanitized.password;

        res.status(200).json({ message: 'Student updated successfully', user: sanitized });
    } catch (error) {
        console.error('Error updating student:', error);
        res.status(400).json({ message: error.message });
    }
};

// @desc    Reset user password (Admin only)
// @route   PUT /api/users/:id/reset-password
exports.resetUserPassword = async (req, res) => {
    try {
        const { newPassword } = req.body;
        const user = await User.findById(req.params.id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.password = newPassword; // Will be hashed by pre-save middleware
        await user.save();
        
        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete user by ID (Admin only)
// @route   DELETE /api/users/:id
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error while deleting user.' });
    }
};

// @desc    Get students by department
// @route   GET /api/users/department/:dept
exports.getStudentsByDepartment = async (req, res) => {
    try {
        const { dept } = req.params;
        const students = await User.find({ 
            role: 'student', 
            dept: dept 
        }).select('-password');
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching students by department.' });
    }
};

// @desc    Get placed students
// @route   GET /api/users/placed
exports.getPlacedStudents = async (req, res) => {
    try {
        const placedStudents = await User.find({ 
            role: 'student', 
            isPlaced: true 
        }).select('-password');
        res.status(200).json(placedStudents);
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching placed students.' });
    }
};

// @desc    Get unplaced students
// @route   GET /api/users/unplaced
exports.getUnplacedStudents = async (req, res) => {
    try {
        const unplacedStudents = await User.find({ 
            role: 'student', 
            isPlaced: false 
        }).select('-password');
        res.status(200).json(unplacedStudents);
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching unplaced students.' });
    }
};

// @desc    Mark student as placed
// @route   PUT /api/users/:id/place
exports.markStudentAsPlaced = async (req, res) => {
    try {
        const { company, package: packageAmount, placementDate } = req.body;
        
        const user = await User.findByIdAndUpdate(
            req.params.id,
            {
                isPlaced: true,
                company,
                package: packageAmount,
                placementDate: placementDate || new Date()
            },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ 
            message: 'Student marked as placed successfully',
            user 
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get students by passout year
// @route   GET /api/users/passout/:year
exports.getStudentsByPassoutYear = async (req, res) => {
    try {
        const { year } = req.params;
        const students = await User.find({ 
            role: 'student', 
            passoutYear: parseInt(year) 
        }).select('-password');
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching students by passout year.' });
    }
};

// @desc    Get students with arrears
// @route   GET /api/users/arrears
exports.getStudentsWithArrears = async (req, res) => {
    try {
        const studentsWithArrears = await User.find({ 
            role: 'student', 
            $or: [
                { currentArrears: { $gt: 0 } },
                { historyOfArrears: { $gt: 0 } }
            ]
        }).select('-password');
        res.status(200).json(studentsWithArrears);
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching students with arrears.' });
    }
};

// @desc    Get incomplete profiles
// @route   GET /api/users/incomplete-profiles
exports.getIncompleteProfiles = async (req, res) => {
    try {
        const incompleteProfiles = await User.find({ 
            role: 'student', 
            isProfileComplete: false 
        }).select('-password');
        res.status(200).json(incompleteProfiles);
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching incomplete profiles.' });
    }
};

// @desc    Search students
// @route   GET /api/users/search
exports.searchStudents = async (req, res) => {
    try {
        const { q, dept, passoutYear, isPlaced, residence } = req.query;
        
        let query = { role: 'student' };
        
        // Text search in name, email, roll number
        if (q) {
            query.$or = [
                { fullName: { $regex: q, $options: 'i' } },
                { collegeEmail: { $regex: q, $options: 'i' } },
                { rollNo: { $regex: q, $options: 'i' } },
                { universityRegNumber: { $regex: q, $options: 'i' } }
            ];
        }
        
        // Filter by department
        if (dept) {
            query.dept = dept;
        }
        
        // Filter by passout year
        if (passoutYear) {
            query.passoutYear = parseInt(passoutYear);
        }
        
        // Filter by placement status
        if (isPlaced !== undefined) {
            query.isPlaced = isPlaced === 'true';
        }
        
        // Filter by residence
        if (residence) {
            query.residence = residence;
        }
        
        const students = await User.find(query).select('-password');
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ message: 'Server error while searching students.' });
    }
};

// @desc    Get user statistics
// @route   GET /api/users/stats
exports.getUserStats = async (req, res) => {
    try {
        const totalStudents = await User.countDocuments({ role: 'student' });
        const placedStudents = await User.countDocuments({ role: 'student', isPlaced: true });
        const incompleteProfiles = await User.countDocuments({ role: 'student', isProfileComplete: false });
        const studentsWithArrears = await User.countDocuments({ 
            role: 'student', 
            $or: [{ currentArrears: { $gt: 0 } }, { historyOfArrears: { $gt: 0 } }]
        });
        
        // Department wise count
        const departmentStats = await User.aggregate([
            { $match: { role: 'student' } },
            { $group: { _id: '$dept', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);
        // @desc    Get students by department
// @route   GET /api/users/department/:dept
        // Placement stats by department
        const placementStatsByDept = await User.aggregate([
            { $match: { role: 'student', isPlaced: true } },
            { $group: { _id: '$dept', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);
        
        res.status(200).json({
            totalStudents,
            placedStudents,
            unplacedStudents: totalStudents - placedStudents,
            incompleteProfiles,
            studentsWithArrears,
            placementPercentage: totalStudents > 0 ? ((placedStudents / totalStudents) * 100).toFixed(2) : 0,
            departmentStats,
            placementStatsByDept
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching statistics.' });
    }
};

// @desc    Bulk update users
// @route   PUT /api/users/bulk-update
exports.bulkUpdateUsers = async (req, res) => {
    try {
        const { userIds, updateData } = req.body;
        
        if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
            return res.status(400).json({ message: 'User IDs array is required' });
        }
        
        const result = await User.updateMany(
            { _id: { $in: userIds } },
            updateData,
            { runValidators: true }
        );
        
        res.status(200).json({
            message: 'Bulk update completed',
            modifiedCount: result.modifiedCount,
            matchedCount: result.matchedCount
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
