const Job = require('../models/job.model');
const User = require('../models/user.js');

// Helper function to check if a student meets job eligibility criteria
const checkStudentEligibility = (student, criteria) => {
    console.log('=== Checking student:', student.fullName, 'ID:', student._id, '===');
    console.log('Student data:', {
        isProfileComplete: student.isProfileComplete,
        dept: student.dept,
        passoutYear: student.passoutYear,
        ugCgpa: student.ugCgpa,
        currentArrears: student.currentArrears,
        tenthPercentage: student.education?.tenth?.percentage,
        twelthPercentage: student.education?.twelth?.percentage
    });

    // Skip students with incomplete profiles
    if (!student.isProfileComplete) {
        console.log('❌ FAIL: Student profile not complete');
        return false;
    }

    // Convert criteria values to numbers to ensure proper comparison
    const minCgpa = Number(criteria.minCgpa) || 0;
    const minTenthMarks = Number(criteria.minTenthMarks) || 0;
    const minTwelfthMarks = Number(criteria.minTwelfthMarks) || 0;
    const passoutYear = Number(criteria.passoutYear);
    const maxArrears = Number(criteria.maxArrears) || 0;

    console.log('Criteria:', { minCgpa, minTenthMarks, minTwelfthMarks, passoutYear, maxArrears, allowedDepartments: criteria.allowedDepartments });

    // Check CGPA
    if (!student.ugCgpa || Number(student.ugCgpa) < minCgpa) {
        console.log(`CGPA check failed: student=${student.ugCgpa}, required=${minCgpa}`);
        return false;
    }

    // Check current arrears
    if ((student.currentArrears || 0) > maxArrears) {
        console.log(`Arrears check failed: student=${student.currentArrears}, max=${maxArrears}`);
        return false;
    }

    // Check 10th percentage
    if (!student.education?.tenth?.percentage || Number(student.education.tenth.percentage) < minTenthMarks) {
        console.log(`10th marks check failed: student=${student.education?.tenth?.percentage}, required=${minTenthMarks}`);
        return false;
    }

    // Check 12th percentage (note: it's "twelth" not "twelfth" in the model)
    if (!student.education?.twelth?.percentage || Number(student.education.twelth.percentage) < minTwelfthMarks) {
        console.log(`12th marks check failed: student=${student.education?.twelth?.percentage}, required=${minTwelfthMarks}`);
        return false;
    }

    // Check passout year
    if (student.passoutYear !== passoutYear) {
        console.log(`Passout year check failed: student=${student.passoutYear}, required=${passoutYear}`);
        return false;
    }

    // Check department if specified
    if (criteria.allowedDepartments && criteria.allowedDepartments.length > 0) {
        if (!criteria.allowedDepartments.includes(student.dept)) {
            console.log(`Department check failed: student=${student.dept}, allowed=${criteria.allowedDepartments}`);
            return false;
        }
    }

    console.log('Student is eligible!');
    return true;
};

// @desc    Admin creates a new job posting
exports.createJob = async (req, res) => {
    try {
        console.log('Creating job with data:', JSON.stringify(req.body, null, 2));

        // First, find all eligible students based on the criteria
        const allStudents = await User.find({ role: 'student' });
        console.log(`Found ${allStudents.length} students total`);

        const eligibleStudents = [];

        for (const student of allStudents) {
            if (checkStudentEligibility(student, req.body.eligibility)) {
                eligibleStudents.push(student._id);
            }
        }

        console.log(`Found ${eligibleStudents.length} eligible students`);

        // Create the job with eligible students populated
        const job = new Job({
            ...req.body,
            postedBy: req.user.id, // req.user comes from 'protect' middleware
            eligibleStudents: eligibleStudents
        });

        const savedJob = await job.save();
        console.log('Job saved with eligible students:', savedJob.eligibleStudents.length);

        res.status(201).json(savedJob);
    } catch (error) {
        console.error('Error creating job:', error);
        res.status(400).json({ message: error.message });
    }
};

// @desc    Admin updates a job posting
exports.updateJob = async (req, res) => {
    try {
        console.log('Updating job:', req.params.jobId, 'with data:', JSON.stringify(req.body, null, 2));

        const job = await Job.findById(req.params.jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // If eligibility criteria changed, recalculate eligible students
        const eligibilityChanged = JSON.stringify(job.eligibility) !== JSON.stringify(req.body.eligibility);

        if (eligibilityChanged) {
            console.log('Eligibility criteria changed, recalculating eligible students...');

            // Find all eligible students based on new criteria
            const allStudents = await User.find({ role: 'student' });
            const eligibleStudents = [];

            for (const student of allStudents) {
                if (checkStudentEligibility(student, req.body.eligibility)) {
                    eligibleStudents.push(student._id);
                }
            }

            req.body.eligibleStudents = eligibleStudents;
            console.log(`Recalculated eligible students: ${eligibleStudents.length}`);
        }

        const updatedJob = await Job.findByIdAndUpdate(
            req.params.jobId,
            req.body,
            { new: true, runValidators: true }
        );

        console.log('Job updated successfully');
        res.status(200).json(updatedJob);
    } catch (error) {
        console.error('Error updating job:', error);
        res.status(400).json({ message: error.message });
    }
};

exports.getJobs = async (req, res) => {
    try {
        const open_jobs = await Job.find({
            status : 'OPEN'
        })
        const inProg_jobs = await Job.find({
          status: "IN_PROGRESS",
        });
        const closed_jobs = await Job.find({
          status: "CLOSED",
        });
        
        res.status(200).json({
            open : open_jobs,
            in_progress : inProg_jobs,
            closed : closed_jobs
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching jobs', error: error.message });
    }
}

// @desc    Get eligible students for a specific job (Admin only)
exports.getEligibleStudentsForJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.jobId).populate('eligibleStudents', 'fullName collegeEmail dept ugCgpa currentArrears');
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }
        res.status(200).json(job.eligibleStudents);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching eligible students', error: error.message });
    }
};

// @desc    Student gets a list of jobs they are eligible for
exports.getEligibleJobs = async (req, res) => {
    try {
        // More efficient: find jobs where the student is in eligibleStudents array
        const eligibleJobs = await Job.find({
            eligibleStudents: req.user.id,
            status: 'OPEN'
        }).populate('postedBy', 'fullName');

        res.status(200).json(eligibleJobs);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};