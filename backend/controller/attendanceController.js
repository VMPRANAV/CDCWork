const Attendance = require('../models/Attendance');
const User = require('../models/user');

// @desc    Get user's attendance data
// @route   GET /api/attendance
exports.getAttendance = async (req, res) => {
    try {
        // ✅ For now, we'll use a default user ID since auth is removed
        const userId = req.body.userId || '673c88f4f2e03bb82fb6cf44'; // Default for testing
        
        let attendance = await Attendance.findOne({ 
            userId: userId,
            academicYear: '2025-26',
            semester: 'Odd'
        });

        if (!attendance) {
            attendance = new Attendance({
                userId: userId,
                academicYear: '2025-26',
                semester: 'Odd',
                totalClasses: 0,
                presentClasses: 0,
                onDutyClasses: 0,
                absentClasses: 0,
                dailySchedule: []
            });
            
            await attendance.save();
        }

        res.status(200).json({
            status: 'success',
            data: attendance
        });

    } catch (error) {
        console.error('Get attendance error:', error);
        res.status(500).json({ 
            status: 'error',
            message: 'Server error while fetching attendance data.' 
        });
    }
};

// @desc    Update attendance for a specific day
// @route   PUT /api/attendance/daily
exports.updateDailyAttendance = async (req, res) => {
    try {
        const { userId, date, dailySchedule } = req.body;
        const targetUserId = userId || '673c88f4f2e03bb82fb6cf44'; // Default for testing

        let attendance = await Attendance.findOne({ 
            userId: targetUserId,
            academicYear: '2025-26',
            semester: 'Odd'
        });

        if (!attendance) {
            return res.status(404).json({
                status: 'error',
                message: 'Attendance record not found'
            });
        }

        attendance.dailySchedule = dailySchedule.map(session => ({
            session: session.session,
            status: session.status,
            subject: session.subject || '',
            faculty: session.faculty || '',
            topic: session.topic || '',
            date: date || new Date()
        }));

        await attendance.save();

        res.status(200).json({
            status: 'success',
            message: 'Daily attendance updated successfully',
            data: attendance
        });

    } catch (error) {
        console.error('Update attendance error:', error);
        res.status(500).json({ 
            status: 'error',
            message: 'Server error while updating attendance.' 
        });
    }
};

// @desc    Update overall attendance stats (Admin only)
// @route   PUT /api/attendance/stats
exports.updateAttendanceStats = async (req, res) => {
    try {
        const userId = req.body.userId || '673c88f4f2e03bb82fb6cf44';
        const { 
            totalClasses, 
            presentClasses, 
            onDutyClasses, 
            absentClasses 
        } = req.body;

        let attendance = await Attendance.findOne({ 
            userId: userId,
            academicYear: '2025-26',
            semester: 'Odd'
        });

        if (!attendance) {
            attendance = new Attendance({
                userId: userId,
                academicYear: '2025-26',
                semester: 'Odd',
                dailySchedule: []
            });
        }

        if (totalClasses !== undefined) attendance.totalClasses = totalClasses;
        if (presentClasses !== undefined) attendance.presentClasses = presentClasses;
        if (onDutyClasses !== undefined) attendance.onDutyClasses = onDutyClasses;
        if (absentClasses !== undefined) attendance.absentClasses = absentClasses;

        await attendance.save();

        res.status(200).json({
            status: 'success',
            message: 'Attendance statistics updated successfully',
            data: attendance
        });

    } catch (error) {
        console.error('Update attendance stats error:', error);
        res.status(500).json({ 
            status: 'error',
            message: 'Server error while updating attendance statistics.' 
        });
    }
};

// @desc    Get attendance statistics
// @route   GET /api/attendance/stats
exports.getAttendanceStats = async (req, res) => {
    try {
        const userId = req.body.userId || '673c88f4f2e03bb82fb6cf44';
        
        const attendance = await Attendance.findOne({ 
            userId: userId,
            academicYear: '2025-26',
            semester: 'Odd'
        });

        if (!attendance) {
            return res.status(200).json({
                status: 'success',
                data: {
                    overall: {
                        totalPercentage: 0,
                        presentPercentage: 0,
                        onDutyPercentage: 0,
                        absentPercentage: 0
                    },
                    classData: {
                        totalClasses: 0,
                        presentClasses: 0,
                        onDutyClasses: 0,
                        absentClasses: 0
                    },
                    lastUpdated: null
                }
            });
        }

        res.status(200).json({
            status: 'success',
            data: {
                overall: attendance.overallStats,
                classData: {
                    totalClasses: attendance.totalClasses,
                    presentClasses: attendance.presentClasses,
                    onDutyClasses: attendance.onDutyClasses,
                    absentClasses: attendance.absentClasses
                },
                lastUpdated: attendance.updatedAt
            }
        });

    } catch (error) {
        console.error('Get attendance stats error:', error);
        res.status(500).json({ 
            status: 'error',
            message: 'Server error while fetching attendance statistics.' 
        });
    }
};

// @desc    Get all students attendance (Admin only)
// @route   GET /api/attendance/all
exports.getAllStudentsAttendance = async (req, res) => {
    try {
        const attendanceRecords = await Attendance.find({
            academicYear: '2025-26',
            semester: 'Odd'
        }).populate('userId', 'fullName email');

        res.status(200).json({
            status: 'success',
            data: attendanceRecords
        });

    } catch (error) {
        console.error('Get all attendance error:', error);
        res.status(500).json({ 
            status: 'error',
            message: 'Server error while fetching all attendance data.' 
        });
    }
};

// @desc    Delete attendance record (Admin only)
// @route   DELETE /api/attendance/:userId
exports.deleteAttendance = async (req, res) => {
    try {
        const { userId } = req.params;

        const attendance = await Attendance.findOneAndDelete({
            userId: userId,
            academicYear: '2025-26',
            semester: 'Odd'
        });

        if (!attendance) {
            return res.status(404).json({
                status: 'error',
                message: 'Attendance record not found'
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Attendance record deleted successfully'
        });

    } catch (error) {
        console.error('Delete attendance error:', error);
        res.status(500).json({ 
            status: 'error',
            message: 'Server error while deleting attendance record.' 
        });
    }
};