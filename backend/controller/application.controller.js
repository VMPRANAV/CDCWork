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
        // req.user.id comes from your 'protect' middleware
        const applications = await Application.find({ student: req.user.id });
        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a new application
// @route   POST /api/applications
exports.createApplication = async (req, res) => {
    try {
        const { companyName, jobTitle } = req.body;

        if (!companyName || !jobTitle) {
            return res.status(400).json({ message: 'Please provide company name and job title.' });
        }

        const application = new Application({
            companyName,
            jobTitle,
            student: req.user.id // Assign to the logged-in student
        });

        const createdApplication = await application.save();
        res.status(201).json(createdApplication);

    } catch (error) {
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
        application.notes = notes ?? application.notes; // Use ?? to allow empty strings

        await application.save();

        // --- FIX: Add this line to populate the student name before sending ---
        await application.populate('student', 'fullName')
        const updatedApplication = await application.save();
        res.status(200).json(updatedApplication);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all applications (admin only)
// @route   GET /api/applications
exports.getAllApplications = async (req, res) => {
    try {
        const applications = await Application.find({})
            .populate('student', 'fullName') // This gets the student's name from the User collection
            .sort({ createdAt: -1 });
        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
