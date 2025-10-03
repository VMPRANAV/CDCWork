const mongoose = require('mongoose');
const Job = require('../models/job.model');
const Round = require('../models/round.model');
const User = require('../models/user.model');

// --- No changes needed in helper functions ---
const checkStudentEligibility = (student, criteria) => {
    if (!student.isProfileComplete) {
        return false;
    }
    const minCgpa = Number(criteria.minCgpa) || 0;
    const minTenthMarks = Number(criteria.minTenthMarks) || 0;
    const minTwelfthMarks = Number(criteria.minTwelfthMarks) || 0;
    const passoutYear = Number(criteria.passoutYear);
    const maxArrears = Number(criteria.maxArrears) || 0;
    if (!student.ugCgpa || Number(student.ugCgpa) < minCgpa) {
        return false;
    }
    if ((student.currentArrears || 0) > maxArrears) {
        return false;
    }
    if (!student.education?.tenth?.percentage || Number(student.education.tenth.percentage) < minTenthMarks) {
        return false;
    }
    if (!student.education?.twelth?.percentage || Number(student.education.twelth.percentage) < minTwelfthMarks) {
        return false;
    }
    if (student.passoutYear !== passoutYear) {
        return false;
    }
    if (criteria.allowedDepartments && criteria.allowedDepartments.length > 0) {
        if (!criteria.allowedDepartments.includes(student.dept)) {
            return false;
        }
    }
    return true;
};

const normalizeRoundPayload = (roundData, sequence) => ({
    roundName: roundData.roundName?.trim() || '',
    type: roundData.type?.trim() || '',
    mode: roundData.mode || 'offline',
    status: roundData.status || 'scheduled',
    scheduledAt: roundData.scheduledAt ? new Date(roundData.scheduledAt) : null,
    venue: roundData.venue?.trim() || '',
    instructions: roundData.instructions?.trim() || '',
    sequence: roundData.sequence ?? sequence,
    isAttendanceMandatory: roundData.isAttendanceMandatory ?? true,
    autoAdvanceOnAttendance: roundData.autoAdvanceOnAttendance ?? false
});

const syncJobRounds = async (jobId, roundsData) => {
  try {
    await Round.deleteMany({ job: jobId });
    if (!roundsData || roundsData.length === 0) {
      return [];
    }
    const roundsToCreate = roundsData.map((roundData, index) => {
      const normalizedData = normalizeRoundPayload(roundData, index + 1);
      return {
        job: jobId,
        ...normalizedData
      };
    });
    const createdRounds = await Round.insertMany(roundsToCreate);
    return createdRounds;
  } catch (error) {
    console.error('Error syncing job rounds:', error);
    throw error;
  }
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
            const newRounds = await syncJobRounds(job._id, roundsPayload);
            // **FIX STARTS HERE**: Update the job with the new round IDs
            job.rounds = newRounds.map(round => round._id);
            await job.save(session ? { session } : undefined); // Save the job again to persist the round IDs
            // **FIX ENDS HERE**
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
            const newRounds = await syncJobRounds(job._id, roundsPayload);
            // **FIX STARTS HERE**: Update the job's rounds array with the new ObjectIDs
            job.rounds = newRounds.map(round => round._id);
            // **FIX ENDS HERE**
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


// --- No changes needed in remaining functions ---

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

exports.getEligibleJobs = async (req, res) => {
    try {
        const eligibleJobs = await Job.find({
            eligibleStudents: req.user.id,
            status: 'public'
        }).populate('postedBy', 'fullName').populate('rounds');
        res.status(200).json(eligibleJobs);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

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