const mongoose = require('mongoose');
const Job = require('../models/job.model');
const Round = require('../models/round.model');
const User = require('../models/user.model');

const checkStudentEligibility = (student, criteria) => {

    // Skip students with incomplete profiles
    if (!student.isProfileComplete) {
        return false;
    }

    // Convert criteria values to numbers to ensure proper comparison
    const minCgpa = Number(criteria.minCgpa) || 0;
    const minTenthMarks = Number(criteria.minTenthMarks) || 0;
    const minTwelfthMarks = Number(criteria.minTwelfthMarks) || 0;
    const passoutYear = Number(criteria.passoutYear);
    const maxArrears = Number(criteria.maxArrears) || 0;

    // Check CGPA
    if (!student.ugCgpa || Number(student.ugCgpa) < minCgpa) {
        return false;
    }

    // Check current arrears
    if ((student.currentArrears || 0) > maxArrears) {
        return false;
    }

    // Check 10th percentage
    if (!student.education?.tenth?.percentage || Number(student.education.tenth.percentage) < minTenthMarks) {
        return false;
    }

    // Check 12th percentage (note: it's "twelth" not "twelfth" in the model)
    if (!student.education?.twelth?.percentage || Number(student.education.twelth.percentage) < minTwelfthMarks) {
        return false;
    }

    // Check passout year
    if (student.passoutYear !== passoutYear) {
        return false;
    }

    // Check department if specified
    if (criteria.allowedDepartments && criteria.allowedDepartments.length > 0) {
        if (!criteria.allowedDepartments.includes(student.dept)) {
            return false;
        }
    }

    return true;
};

// --- Helpers ---
const normalizeRoundPayload = (round, jobId, fallbackSequence) => ({
    job: jobId,
    sequence: round.sequence ?? fallbackSequence,
    roundName: round.roundName,
    type: round.type,
    mode: round.mode,
    scheduledAt: round.scheduledAt,
    venue: round.venue,
    instructions: round.instructions,
    isAttendanceMandatory: round.isAttendanceMandatory ?? true,
    autoAdvanceOnAttendance: round.autoAdvanceOnAttendance ?? false
});

const syncJobRounds = async (job, roundsPayload, session) => {
    if (!Array.isArray(roundsPayload)) {
        return;
    }

    const retainedRoundIds = [];

    for (let index = 0; index < roundsPayload.length; index += 1) {
        const payload = roundsPayload[index];
        const sequence = payload.sequence ?? index + 1;

        if (payload._id) {
            let query = Round.findOne({ _id: payload._id, job: job._id });
            if (session) {
                query = query.session(session);
            }
            const roundDoc = await query;
            if (!roundDoc) {
                throw new Error('Round not found for this job');
            }

            roundDoc.set(normalizeRoundPayload(payload, job._id, sequence));
            await roundDoc.save(session ? { session } : undefined);
            retainedRoundIds.push(roundDoc._id);
        } else {
            let existingQuery = Round.findOne({ job: job._id, sequence });
            if (session) {
                existingQuery = existingQuery.session(session);
            }
            const existingRound = await existingQuery;

            if (existingRound && !retainedRoundIds.some((id) => id.equals(existingRound._id))) {
                existingRound.set(normalizeRoundPayload(payload, job._id, sequence));
                await existingRound.save(session ? { session } : undefined);
                retainedRoundIds.push(existingRound._id);
            } else {
                const roundDoc = new Round(normalizeRoundPayload(payload, job._id, sequence));
                await roundDoc.save(session ? { session } : undefined);
                retainedRoundIds.push(roundDoc._id);
            }
        }
    }

    const deleteQuery = Round.deleteMany({ job: job._id, _id: { $nin: retainedRoundIds } });
    if (session) {
        await deleteQuery.session(session);
    } else {
        await deleteQuery;
    }
    job.rounds = retainedRoundIds;
};

const getSessionIfSupported = async () => {
    const client = mongoose.connection?.client;
    const hasSupport = client?.topology?.hasSessionSupport?.();
    if (hasSupport) {
        return await client.startSession();
    }
    return null;
};

// @desc    Admin creates a new job posting
exports.createJob = async (req, res) => {
    const session = await getSessionIfSupported();
    if (session) {
        session.startTransaction();
    }
    try {
        const { rounds: roundsPayload = [], ...jobPayload } = req.body;

        // First, find all eligible students based on the criteria
        const allStudents = await User.find({ role: 'student' });

        const eligibleStudents = [];

        for (const student of allStudents) {
            if (checkStudentEligibility(student, jobPayload.eligibility)) {
                eligibleStudents.push(student._id);
            }
        }

        const job = new Job({
            ...jobPayload,
            postedBy: req.user.id,
            eligibleStudents,
            status: 'private',
            rounds: []
        });

        await job.save(session ? { session } : undefined);

        if (Array.isArray(roundsPayload) && roundsPayload.length > 0) {
            const roundDocs = await Round.create(
                roundsPayload.map((round, index) => normalizeRoundPayload(round, job._id, index + 1)),
                session ? { session } : undefined
            );

            job.rounds = roundDocs.map((round) => round._id);
            await job.save(session ? { session } : undefined);
        }

        if (session) {
            await session.commitTransaction();
        }

        const populatedJob = await Job.findById(job._id).populate('rounds');
        res.status(201).json(populatedJob);
    } catch (error) {
        if (session) {
            await session.abortTransaction();
        }
        console.error('Error creating job:', error);
        res.status(400).json({ message: error.message });
    } finally {
        session?.endSession();
    }
};

// @desc    Admin updates a job posting
exports.updateJob = async (req, res) => {
    const session = await getSessionIfSupported();
    if (session) {
        session.startTransaction();
    }
    try {
        let jobQuery = Job.findById(req.params.jobId);
        if (session) {
            jobQuery = jobQuery.session(session);
        }
        const job = await jobQuery;
        if (!job) {
            if (session) {
                await session.abortTransaction();
                session.endSession();
            }
            return res.status(404).json({ message: 'Job not found' });
        }

        const { rounds: roundsPayload, ...updatePayload } = req.body;

        if (updatePayload.eligibility) {
            const eligibilityChanged = JSON.stringify(job.eligibility) !== JSON.stringify(updatePayload.eligibility);

            if (eligibilityChanged) {
                const allStudents = await User.find({ role: 'student' });
                const eligibleStudents = [];

                for (const student of allStudents) {
                    if (checkStudentEligibility(student, updatePayload.eligibility)) {
                        eligibleStudents.push(student._id);
                    }
                }
                job.eligibleStudents = eligibleStudents;
            }
        }

        Object.assign(job, updatePayload);

        if (Array.isArray(roundsPayload)) {
            await syncJobRounds(job, roundsPayload, session);
        }

        await job.save(session ? { session } : undefined);

        if (session) {
            await session.commitTransaction();
        }

        const updatedJob = await Job.findById(job._id).populate('rounds');
        res.status(200).json(updatedJob);
    } catch (error) {
        if (session) {
            await session.abortTransaction();
        }
        console.error('Error updating job:', error);
        res.status(400).json({ message: error.message });
    } finally {
        session?.endSession();
    }
};

exports.getJobs = async (req, res) => {
    try {
        const privateJobs = await Job.find({ status: 'private' }).populate('rounds');
        const publicJobs = await Job.find({ status: 'public' }).populate('rounds');

        const addEligibleCount = (jobs) =>
            jobs.map((jobDoc) => {
                const job = typeof jobDoc.toObject === 'function' ? jobDoc.toObject() : jobDoc;
                return {
                    ...job,
                    eligibleCount: Array.isArray(job.eligibleStudents) ? job.eligibleStudents.length : 0
                };
            });

        res.status(200).json({
            private: addEligibleCount(privateJobs),
            public: addEligibleCount(publicJobs)
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching jobs', error: error.message });
    }
};

// @desc    Get eligible students for a specific job (Admin only)
exports.getEligibleStudentsForJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.jobId).select('eligibleStudents');
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        const eligibleIds = job.eligibleStudents ?? [];
        if (eligibleIds.length === 0) {
            return res.status(200).json([]);
        }

        const eligibleStudents = await User.find({
            _id: { $in: eligibleIds }
        }).select('fullName collegeEmail dept ugCgpa currentArrears isPlaced package');

        res.status(200).json(eligibleStudents);
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
            status: 'public'
        }).populate('postedBy', 'fullName').populate('rounds');

        res.status(200).json(eligibleJobs);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Publish a job (Admin only)
exports.publishJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.jobId).populate('rounds');
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        if (!job.rounds || job.rounds.length === 0) {
            return res.status(400).json({ message: 'Cannot publish a job without rounds' });
        }

        job.status = 'public';
        await job.save();

        res.status(200).json(job);
    } catch (error) {
        console.error('Error publishing job:', error);
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update eligible students list (Admin only)
exports.updateEligibleStudents = async (req, res) => {
    try {
        const { add = [], remove = [] } = req.body;
        const job = await Job.findById(req.params.jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        const currentIds = new Set(job.eligibleStudents.map((id) => id.toString()));

        add.forEach((id) => currentIds.add(id));
        remove.forEach((id) => currentIds.delete(id));

        job.eligibleStudents = Array.from(currentIds);
        await job.save();

        const eligibleIds = job.eligibleStudents ?? [];
        const eligibleStudents = eligibleIds.length === 0
            ? []
            : await User.find({ _id: { $in: eligibleIds } }).select('fullName collegeEmail dept ugCgpa currentArrears isPlaced package');

        res.status(200).json(eligibleStudents);
    } catch (error) {
        console.error('Error updating eligible students:', error);
        res.status(400).json({ message: error.message });
    }
};