const Application = require('../models/application.model');

// @desc    Get all applications for a specific student (for admin view)
// @route   GET /api/applications/student/:studentId
exports.getStudentApplications = async (req, res) => {
    try {
        const applications = await Application.find({ student: req.params.studentId });
        if (!applications) {
            return res.status(404).json({ message: 'No applications found for this student.' });
        }
        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all applications for the logged-in student (for their own view)
// @route   GET /api/applications/my-applications
exports.getMyApplications = async (req, res) => {
    try {
        // ✅ Since we removed auth middleware, we'll get all applications for now
        // You can add user filtering later if needed
        const applications = await Application.find({})
            .populate('student', 'fullName')
            .sort({ createdAt: -1 });
        res.status(200).json(applications);
    } catch (error) {
        console.error('Get my applications error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a new application
// @route   POST /api/applications
exports.createApplication = async (req, res) => {
    try {
        const { companyName, jobTitle, studentId } = req.body;

        if (!companyName || !jobTitle) {
            return res.status(400).json({ message: 'Please provide company name and job title.' });
        }

        const application = new Application({
            companyName,
            jobTitle,
            student: studentId || '673c88f4f2e03bb82fb6cf44' // Default student ID for testing
        });

        const createdApplication = await application.save();
        await createdApplication.populate('student', 'fullName');
        
        res.status(201).json(createdApplication);

    } catch (error) {
        console.error('Create application error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.updateApplication = async (req, res) => {
    try {
        const { status, notes } = req.body;
        const application = await Application.findById(req.params.id);

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        application.status = status || application.status;
        application.notes = notes ?? application.notes;

        const updatedApplication = await application.save();
        await updatedApplication.populate('student', 'fullName');
        
        res.status(200).json(updatedApplication);
    } catch (error) {
        console.error('Update application error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all applications (admin only)
// @route   GET /api/applications
exports.getAllApplications = async (req, res) => {
    try {
        const applications = await Application.find({})
            .populate('student', 'fullName')
            .sort({ createdAt: -1 });
        res.status(200).json(applications);
    } catch (error) {
        console.error('Get all applications error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};
