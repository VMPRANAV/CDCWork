const Application = require('../models/application.model');
const Job = require('../models/job.model');
const Round = require('../models/round.model');
const User = require('../models/user.model');

const populateApplication = (query) =>
    query
        .populate('job', 'companyName jobTitle status')
        .populate('currentRound', 'roundName sequence')
        .populate('roundProgress.round', 'roundName sequence');

// @desc    Get all applications for a specific student (for admin view)
// @route   GET /api/applications/student/:studentId
exports.getStudentApplications = async (req, res) => {
    try {
        const applications = await populateApplication(
            Application.find({ student: req.params.studentId })
        ).sort({ createdAt: -1 });

        if (!applications.length) {
            return res.status(404).json({ message: 'No applications found for this student.' });
        }
        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get all applications for the logged-in student (for their own view)
// @route   GET /api/applications/my-applications
exports.getMyApplications = async (req, res) => {
    try {
        // req.user.id comes from your 'protect' middleware
        const applications = await populateApplication(
            Application.find({ student: req.user.id })
        ).sort({ createdAt: -1 });
        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
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
        const job = await Job.findById(jobId).populate('rounds');
        if (!job) {
            return res.status(404).json({ message: 'Job not found.' });
        }

        if (job.status !== 'public') {
            return res.status(403).json({ message: 'This job is not yet published.' });
        }

        if (!job.rounds || job.rounds.length === 0) {
            return res.status(400).json({ message: 'This job has no rounds configured.' });
        }

        const isEligible = job.eligibleStudents.some((id) => id.toString() === req.user.id.toString());
        if (!isEligible) {
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

        const firstRound = await Round.findOne({ job: jobId }).sort({ sequence: 1 });
        if (!firstRound) {
            return res.status(400).json({ message: 'Unable to determine the first round for this job.' });
        }

        const application = new Application({
            student: req.user.id,
            job: jobId,
            currentRound: firstRound._id,
            currentRoundSequence: firstRound.sequence,
            roundProgress: [{
                round: firstRound._id,
                attendance: false,
                result: 'selected'
            }]
        });

        if (req.body.notes) {
            application.notes = req.body.notes;
        }

        const createdApplication = await application.save();

        // Track applicants in job document for quick reference
        const alreadyApplicant = job.applicants.some((id) => id.toString() === req.user.id.toString());
        if (!alreadyApplicant) {
            job.applicants.push(req.user.id);
            await job.save();
        }

        const populated = await populateApplication(
            Application.findById(createdApplication._id)
        );

        res.status(201).json(await populated);

    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

exports.updateApplication = async (req, res) => {
    try {
        const { finalStatus, notes } = req.body;
        const application = await Application.findById(req.params.id);

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        if (finalStatus) {
            if (!['in_process', 'rejected', 'placed'].includes(finalStatus)) {
                return res.status(400).json({ message: 'Invalid finalStatus value.' });
            }
            application.finalStatus = finalStatus;
            if (finalStatus !== 'in_process') {
                application.currentRound = undefined;
                application.currentRoundSequence = undefined;
            }
        }

        if (notes !== undefined) {
            application.notes = notes;
        }

        await application.save();

        const updatedApplication = await populateApplication(
            Application.findById(application._id)
        ).populate('student', 'fullName');

        res.status(200).json(await updatedApplication);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get all applications (admin only)
// @route   GET /api/applications
exports.getAllApplications = async (req, res) => {
    try {
        const applications = await populateApplication(
            Application.find({})
        )
            .populate('student', 'fullName collegeEmail dept')
            .sort({ createdAt: -1 });
        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Mark attendance for a given round in an application
// @route   PUT /api/applications/:id/attendance
exports.markAttendance = async (req, res) => {
    try {
        const { roundId, attended } = req.body;

        if (!roundId || typeof attended !== 'boolean') {
            return res.status(400).json({ message: 'roundId and attended(boolean) are required.' });
        }

        const application = await Application.findById(req.params.id);
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        const progress = application.roundProgress.find((entry) => entry.round.toString() === roundId.toString());
        if (!progress) {
            return res.status(404).json({ message: 'Round progress not found for this application.' });
        }

        const round = await Round.findById(roundId);
        if (!round) {
            return res.status(404).json({ message: 'Round not found.' });
        }

        progress.attendance = attended;
        progress.attendanceMethod = 'admin_toggle';
        progress.attendanceMarkedAt = attended ? new Date() : undefined;

        if (!attended && round.isAttendanceMandatory) {
            progress.result = 'rejected';
            progress.decidedAt = new Date();
            application.finalStatus = 'rejected';
            application.currentRound = undefined;
            application.currentRoundSequence = undefined;

            await User.findByIdAndUpdate(application.student, {
                $push: {
                    rejectionHistory: {
                        job: application.job,
                        round: round._id,
                        application: application._id,
                        reason: 'Absent from round',
                        rejectedAt: new Date()
                    }
                }
            });
        } else if (attended) {
            if (progress.result === 'pending') {
                progress.result = 'selected';
                progress.decidedAt = new Date();
            }

            await User.findByIdAndUpdate(application.student, {
                $pull: {
                    rejectionHistory: {
                        application: application._id,
                        round: round._id
                    }
                }
            });
        }

        await application.save();

        const populated = await populateApplication(
            Application.findById(application._id)
        ).populate('student', 'fullName');

        res.status(200).json(await populated);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Advance an application to the next round
// @route   POST /api/applications/:id/advance
exports.advanceApplication = async (req, res) => {
    try {
        const { nextRoundId } = req.body;

        if (!nextRoundId) {
            return res.status(400).json({ message: 'nextRoundId is required.' });
        }

        const application = await Application.findById(req.params.id);
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        const nextRound = await Round.findById(nextRoundId);
        if (!nextRound) {
            return res.status(404).json({ message: 'Next round not found.' });
        }

        if (nextRound.job.toString() !== application.job.toString()) {
            return res.status(400).json({ message: 'Next round does not belong to this job.' });
        }

        const currentRoundId = application.currentRound?.toString();
        if (!currentRoundId) {
            return res.status(400).json({ message: 'Application is not currently in a round. Set status back to in_process before advancing.' });
        }

        const currentProgress = application.roundProgress.find((entry) => entry.round.toString() === currentRoundId);
        if (!currentProgress) {
            return res.status(404).json({ message: 'Current round progress not found.' });
        }
currentProgress.attendance = true;
currentProgress.attendanceMethod = 'admin_advance';
currentProgress.attendanceMarkedAt = new Date();
        currentProgress.result = 'selected';
        currentProgress.decidedAt = new Date();

        const alreadyExists = application.roundProgress.some((entry) => entry.round.toString() === nextRoundId.toString());
        if (!alreadyExists) {
            application.roundProgress.push({
                round: nextRound._id,
                attendance: false,
                result: 'pending'
            });
        }

        application.currentRound = nextRound._id;
        application.currentRoundSequence = nextRound.sequence;
        application.finalStatus = 'in_process';

        await application.save();

        const populated = await populateApplication(
            Application.findById(application._id)
        ).populate('student', 'fullName');

        res.status(200).json(await populated);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Finalize an application with placed/rejected outcome
// @route   POST /api/applications/:id/finalize
exports.finalizeApplication = async (req, res) => {
    try {
        const { outcome, roundId, notes } = req.body;

        if (!['placed', 'rejected'].includes(outcome)) {
            return res.status(400).json({ message: 'Outcome must be either placed or rejected.' });
        }

        const application = await Application.findById(req.params.id);
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        if (roundId) {
            const progress = application.roundProgress.find((entry) => entry.round.toString() === roundId.toString());
            if (progress) {
                progress.result = outcome === 'placed' ? 'selected' : 'rejected';
                progress.decidedAt = new Date();
            }
        }

        application.finalStatus = outcome;
        application.currentRound = undefined;
        application.currentRoundSequence = undefined;

        if (notes !== undefined) {
            application.notes = notes;
        }

        await application.save();

        const populated = await populateApplication(
            Application.findById(application._id)
        ).populate('student', 'fullName');

        res.status(200).json(await populated);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
exports.bulkAdvanceApplications = async (req, res) => {
    const jobId = req.params.id;
    const { fromRoundId, toRoundId, emails, rollNos } = req.body;

    if (!jobId || !fromRoundId || !toRoundId || (!emails && !rollNos)) {
        return res.status(400).json({ message: 'jobId, fromRoundId, toRoundId, and at least one of emails or rollNos are required.' });
    }

    try {
        const toRound = await Round.findById(toRoundId);
        if (!toRound) {
            return res.status(404).json({ message: 'Target round (toRoundId) not found.' });
        }

        // 1. Parse emails and rollNos and find corresponding users
        let emailList = [];
        let rollNoList = [];

        if (emails) {
            emailList = emails
                .split(/[\n,]+/)
                .map((email) => email.trim().toLowerCase())
                .filter((email) => email);
        }

        if (rollNos) {
            rollNoList = rollNos
                .split(/[\n,]+/)
                .map((roll) => roll.trim())
                .filter((roll) => roll);
        }

        if (emailList.length === 0 && rollNoList.length === 0) {
            return res.status(400).json({ message: 'No valid email addresses or roll numbers provided.' });
        }

        const uniqueEmails = [...new Set(emailList)];
        const uniqueRollNos = [...new Set(rollNoList)];

        // --- FIX: Create a Set of emails for efficient lookup later ---
        const uniqueEmailSet = new Set(uniqueEmails);

        // Find users by email and/or rollNo
        const userQuery = [];
        if (uniqueEmails.length) userQuery.push({ collegeEmail: { $in: uniqueEmails } });
        if (uniqueRollNos.length) userQuery.push({ rollNo: { $in: uniqueRollNos } });

        const users = await User.find(userQuery.length > 1 ? { $or: userQuery } : userQuery[0]).select('_id collegeEmail rollNo');
        const userMapByEmail = new Map(users.map(user => [user.collegeEmail, user._id]));
        const userMapByRollNo = new Map(users.map(user => [user.rollNo, user._id]));

        // 2. Process applications in a loop
        let successCount = 0;
        const failures = [];

        // Collect all user IDs to query applications
        const userIds = [
            ...Array.from(userMapByEmail.values()),
            ...Array.from(userMapByRollNo.values())
        ].map(id => id.toString());
        const uniqueUserIds = [...new Set(userIds)];

        const applications = await Application.find({
            job: jobId,
            student: { $in: uniqueUserIds }
        });

        const applicationMap = new Map(applications.map(app => [app.student.toString(), app]));

        // Process by email
        for (const email of uniqueEmails) {
            const userId = userMapByEmail.get(email);
            if (!userId) {
                failures.push({ identifier: email, type: 'email', reason: 'User with this email not found in the system.' });
                continue;
            }

            const application = applicationMap.get(userId.toString());
            if (!application) {
                failures.push({ identifier: email, type: 'email', reason: 'No application found for this job.' });
                continue;
            }

            if (application.finalStatus !== 'in_process') {
                failures.push({ identifier: email, type: 'email', reason: `Application status is already '${application.finalStatus}'.` });
                continue;
            }

            if (application.currentRound?.toString() !== fromRoundId) {
                failures.push({ identifier: email, type: 'email', reason: `Application is not in the specified 'Current Round'.` });
                continue;
            }

            const currentProgress = application.roundProgress.find(
                (entry) => entry.round.toString() === fromRoundId
            );

            if (currentProgress) {
                currentProgress.result = 'selected';
                currentProgress.decidedAt = new Date();
                if (!currentProgress.attendance) {
                    currentProgress.attendance = true;
                    currentProgress.attendanceMethod = 'admin_advance';
                    currentProgress.attendanceMarkedAt = new Date();
                }
            }

            const alreadyInNextRound = application.roundProgress.some(
                (entry) => entry.round.toString() === toRoundId
            );

            if (!alreadyInNextRound) {
                application.roundProgress.push({
                    round: toRound._id,
                    result: 'pending'
                });
            }

            application.currentRound = toRound._id;
            application.currentRoundSequence = toRound.sequence;

            await application.save();
            successCount += 1;
        }

        // Process by rollNo (skip if already processed by email)
        for (const rollNo of uniqueRollNos) {
            const userId = userMapByRollNo.get(rollNo);
            if (!userId) {
                failures.push({ identifier: rollNo, type: 'rollNo', reason: 'User with this roll number not found in the system.' });
                continue;
            }

            // --- FIX: Check if this user's email was in the *original input list* ---
            const userForRollNo = users.find(u => u._id.equals(userId));
            if (userForRollNo && uniqueEmailSet.has(userForRollNo.collegeEmail)) {
                // This user's email was in the input list, so they were already processed.
                continue;
            }
            // --- END FIX ---

            const application = applicationMap.get(userId.toString());
            if (!application) {
                failures.push({ identifier: rollNo, type: 'rollNo', reason: 'No application found for this job.' });
                continue;
            }

            if (application.finalStatus !== 'in_process') {
                failures.push({ identifier: rollNo, type: 'rollNo', reason: `Application status is already '${application.finalStatus}'.` });
                continue;
            }

            if (application.currentRound?.toString() !== fromRoundId) {
                failures.push({ identifier: rollNo, type: 'rollNo', reason: `Application is not in the specified 'Current Round'.` });
                continue;
            }

            const currentProgress = application.roundProgress.find(
                (entry) => entry.round.toString() === fromRoundId
            );

            if (currentProgress) {
                currentProgress.result = 'selected';
                currentProgress.decidedAt = new Date();
                if (!currentProgress.attendance) {
                    currentProgress.attendance = true;
                    currentProgress.attendanceMethod = 'admin_advance';
                    currentProgress.attendanceMarkedAt = new Date();
                }
            }

            const alreadyInNextRound = application.roundProgress.some(
                (entry) => entry.round.toString() === toRoundId
            );

            if (!alreadyInNextRound) {
                application.roundProgress.push({
                    round: toRound._id,
                    result: 'pending'
                });
            }

            application.currentRound = toRound._id;
            application.currentRoundSequence = toRound.sequence;

            await application.save();
            successCount += 1;
        }

        // 5. Send detailed response
        res.status(200).json({
            message: 'Bulk advance process completed.',
            successCount,
            failureCount: failures.length,
            failures
        });

    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};