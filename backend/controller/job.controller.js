const mongoose = require('mongoose');
const Job = require('../models/job.model');
const Round = require('../models/round.model');
const User = require('../models/user.model');
const excel = require('exceljs');
const { cloudinary } = require('../.config/config');
const fs = require('fs');
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
    const existingRounds = await Round.find({ job: jobId }).sort({ sequence: 1 });
    const updatedRounds = [];
    
    // Update or create rounds
    for (let i = 0; i < roundsData.length; i++) {
      const roundData = roundsData[i];
      const normalizedData = normalizeRoundPayload(roundData, i + 1);
      
      if (existingRounds[i]) {
 const existingRound = existingRounds[i];
 if (existingRound.status !== 'archived' || roundsData.length > i) {
        Object.assign(existingRounds[i], normalizedData);
        // Ensure it's not archived if it's part of the new list
        if (existingRounds[i].status === 'archived') {
            existingRounds[i].status = 'scheduled';
        }
        await existingRounds[i].save();
        updatedRounds.push(existingRounds[i]);
    }
      } else {
        // Create new round
        const newRound = new Round({
          job: jobId,
          ...normalizedData
        });
        await newRound.save();
        updatedRounds.push(newRound);
      }
    }
    
    // **MODIFICATION HERE: Archive extra rounds instead of deleting**
    if (existingRounds.length > roundsData.length) {
      const roundsToArchive = existingRounds.slice(roundsData.length);
      await Round.updateMany(
        { _id: { $in: roundsToArchive.map(r => r._id) } },
        { $set: { status: 'archived' } } // Set status to archived
      );
    }
    
    return updatedRounds;
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
            rounds: [] // Initialize with an empty array
        });

        await job.save(session ? { session } : undefined);

        if (Array.isArray(roundsPayload) && roundsPayload.length > 0) {
            const newRounds = await syncJobRounds(job._id, roundsPayload);
             job.rounds = newRounds.map(round => round._id);
            await job.save(session ? { session } : undefined);// Save the job again to persist the round IDs
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
exports.downloadEligibleStudents = async (req, res) => {
    try {
        const job = await Job.findById(req.params.jobId)
            .populate({
                path: 'eligibleStudents',
                select: 'fullName collegeEmail dept ugCgpa currentArrears isPlaced package',
            });

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        const workbook = new excel.Workbook();
        const worksheet = workbook.addWorksheet('Eligible Students');

        // Define columns and set header styles
        worksheet.columns = [
            { header: 'Full Name', key: 'fullName', width: 30 },
            { header: 'College Email', key: 'collegeEmail', width: 35 },
            { header: 'Department', key: 'dept', width: 15 },
            { header: 'CGPA', key: 'ugCgpa', width: 10 },
            { header: 'Current Arrears', key: 'currentArrears', width: 18 },
            { header: 'Placed', key: 'isPlaced', width: 12 },
            { header: 'Package (LPA)', key: 'package', width: 18 },
        ];
        worksheet.getRow(1).font = { bold: true };

        // Add student data to the worksheet
        const studentsData = job.eligibleStudents.map(student => ({
            fullName: student.fullName,
            collegeEmail: student.collegeEmail,
            dept: student.dept,
            ugCgpa: student.ugCgpa,
            currentArrears: student.currentArrears ?? 0,
            isPlaced: student.isPlaced ? 'Yes' : 'No',
            package: student.package,
        }));

        worksheet.addRows(studentsData);

        // Set response headers to trigger a file download in the browser
        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader(
            'Content-Disposition',
            `attachment; filename="Eligible_Students-${job.companyName.replace(/\s/g, '_')}.xlsx"`
        );

        // Write the workbook to the response stream and end the response
        await workbook.xlsx.write(res);
        res.end();

    } catch (error) {
        console.error('Error downloading eligible students:', error);
        res.status(500).json({ message: 'Server error while generating the Excel file.' });
    }
};

// @desc    Upload multiple files for job attachments
// @route   POST /api/jobs/upload-attachment-files
exports.uploadJobAttachmentFiles = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded' });
        }

        // Create an array of promises for each file upload to Cloudinary
        const uploadPromises = req.files.map(file => 
            cloudinary.uploader.upload(file.path, {
                folder: 'job_attachments', // You can organize uploads in Cloudinary folders
                resource_type: 'auto'      // Let Cloudinary detect the file type
            })
        );

        // Wait for all files to be uploaded
        const uploadResults = await Promise.all(uploadPromises);

        // IMPORTANT: Clean up and delete the temporary local files
        req.files.forEach(file => fs.unlinkSync(file.path));

        // Create the response array with Cloudinary URLs
        const uploadedFiles = uploadResults.map((result, index) => ({
            originalname: req.files[index].originalname,
            url: result.secure_url, // Use the secure URL from Cloudinary
            public_id: result.public_id
        }));

        res.status(200).json({
            message: 'Files uploaded to Cloudinary successfully',
            files: uploadedFiles
        });
    } catch (error) {
        // Error handling: if upload fails, still try to delete local files
        if (req.files) {
            req.files.forEach(file => {
                try {
                    if (fs.existsSync(file.path)) {
                        fs.unlinkSync(file.path);
                    }
                } catch (cleanupError) {
                    console.error('Error during file cleanup:', cleanupError);
                }
            });
        }
        console.error('Cloudinary upload error:', error);
        res.status(500).json({ message: 'Error uploading files to Cloudinary', error: error.message });
    }
};


// @desc    Upload multiple files for job
// @route   POST /api/jobs/upload-files
exports.uploadJobFiles = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded' });
        }

        const uploadedFiles = req.files.map(file => ({
            fieldname: file.fieldname,
            originalname: file.originalname,
            filename: file.filename,
            path: file.path,
            size: file.size,
            mimetype: file.mimetype,
            url: `${req.protocol}://${req.get('host')}/uploads/job-files/${file.filename}`
        }));

        res.status(200).json({
            message: 'Files uploaded successfully',
            files: uploadedFiles
        });
    } catch (error) {
        console.error('File upload error:', error);
        res.status(500).json({ message: 'Error uploading files', error: error.message });
    }
};

