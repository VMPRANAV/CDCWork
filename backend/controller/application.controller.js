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
        const applications = await Application.find({ student: req.user.id })
            .populate('job', 'companyName jobTitle jobDescription')
            .sort({ appliedDate: -1 });
        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a new application
// @route   POST /api/applications
exports.createApplication = async (req, res) => {
    try {
        const { jobId } = req.body;

        if (!jobId) {
            return res.status(400).json({ message: 'Please provide jobId.' });
        }

        // Check if student is eligible for this job
        const job = await require('../models/job.model').findById(jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job not found.' });
        }

        // Check if student is in the eligible students list
        if (!job.eligibleStudents.includes(req.user.id)) {
            return res.status(403).json({ message: 'You are not eligible for this job.' });
        }

        // Check if student has already applied to this job
        const existingApplication = await Application.findOne({
            student: req.user.id,
            job: jobId
        });

        if (existingApplication) {
            return res.status(400).json({ message: 'You have already applied to this job.' });
        }

        const application = new Application({
            student: req.user.id,
            job: jobId
        });

        const createdApplication = await application.save();

        // Populate job details for response
        await createdApplication.populate('job', 'companyName jobTitle');

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
            .populate('student', 'fullName collegeEmail dept') // This gets the student's name from the User collection
            .populate('job', 'companyName jobTitle') // This gets job details
            .sort({ createdAt: -1 });
        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
