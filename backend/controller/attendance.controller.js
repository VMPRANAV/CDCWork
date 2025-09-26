const crypto = require('crypto');
const Round = require('../models/round.model');
const Application = require('../models/application.model');
const User = require('../models/user.model');

const ALLOWED_REFRESH_INTERVALS = [30, 45, 60, 90];
const CODE_LENGTH = 6;
const OFFLINE_CODE_LENGTH = 6;
const CODE_CHARSET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

const generateCode = (length = CODE_LENGTH) => {
    let code = '';
    for (let i = 0; i < length; i += 1) {
        const index = Math.floor(Math.random() * CODE_CHARSET.length);
        code += CODE_CHARSET[index];
    }
    return code;
};

const hashCode = (code = '') => crypto
    .createHash('sha256')
    .update(code.toUpperCase())
    .digest('hex');

const ensureSessionObject = (round) => {
    if (!round.attendanceSession) {
        round.attendanceSession = {
            status: 'inactive',
            startedAt: null,
            startedBy: null,
            refreshIntervalSeconds: null,
            currentCode: null,
            currentCodeHash: null,
            codeExpiresAt: null,
            sessionSecret: null,
            offlineCodeHash: null,
            offlineCodeUsedAt: null
        };
    }
    return round.attendanceSession;
};

const issueNewCode = (round) => {
    const session = ensureSessionObject(round);
    const interval = session.refreshIntervalSeconds || ALLOWED_REFRESH_INTERVALS[0];
    const code = generateCode(CODE_LENGTH);
    const expiresAt = new Date(Date.now() + interval * 1000);

    session.currentCode = code;
    session.currentCodeHash = hashCode(code);
    session.codeExpiresAt = expiresAt;

    return { code, expiresAt };
};

exports.startAttendanceSession = async (req, res) => {
    try {
        const { roundId } = req.params;
        const { refreshIntervalSeconds, enableOfflineCode } = req.body;

        if (!ALLOWED_REFRESH_INTERVALS.includes(refreshIntervalSeconds)) {
            return res.status(400).json({
                message: `refreshIntervalSeconds must be one of ${ALLOWED_REFRESH_INTERVALS.join(', ')}`
            });
        }

        const round = await Round.findById(roundId);
        if (!round) {
            return res.status(404).json({ message: 'Round not found.' });
        }

        const session = ensureSessionObject(round);
        if (session.status === 'active') {
            return res.status(400).json({ message: 'Attendance session is already active for this round.' });
        }

        const now = new Date();
        session.status = 'active';
        session.startedAt = now;
        session.startedBy = req.user?._id;
        session.refreshIntervalSeconds = refreshIntervalSeconds;
        session.sessionSecret = crypto.randomBytes(24).toString('hex');
        session.offlineCodeHash = null;
        session.offlineCodeUsedAt = null;

        let offlineCode = null;
        if (enableOfflineCode) {
            offlineCode = generateCode(OFFLINE_CODE_LENGTH);
            session.offlineCodeHash = hashCode(offlineCode);
        }

        const { code, expiresAt } = issueNewCode(round);
        round.markModified('attendanceSession');
        await round.save();

        return res.status(200).json({
            status: session.status,
            currentCode: code,
            expiresAt,
            refreshIntervalSeconds: session.refreshIntervalSeconds,
            offlineCode
        });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to start attendance session.', error: error.message });
    }
};

exports.stopAttendanceSession = async (req, res) => {
    try {
        const { roundId } = req.params;
        const round = await Round.findById(roundId);
        if (!round) {
            return res.status(404).json({ message: 'Round not found.' });
        }

        const session = ensureSessionObject(round);
        if (session.status !== 'active') {
            return res.status(400).json({ message: 'No active attendance session to stop.' });
        }

        round.attendanceSession = {
            status: 'inactive',
            startedAt: null,
            startedBy: null,
            refreshIntervalSeconds: null,
            currentCode: null,
            currentCodeHash: null,
            codeExpiresAt: null,
            sessionSecret: null,
            offlineCodeHash: null,
            offlineCodeUsedAt: null
        };

        round.markModified('attendanceSession');
        await round.save();

        return res.status(200).json({ message: 'Attendance session ended.' });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to stop attendance session.', error: error.message });
    }
};

exports.getAttendanceSessionStatus = async (req, res) => {
    try {
        const { roundId } = req.params;
        const round = await Round.findById(roundId);
        if (!round) {
            return res.status(404).json({ message: 'Round not found.' });
        }

        const session = ensureSessionObject(round);
        if (session.status !== 'active') {
            return res.status(200).json({ status: 'inactive' });
        }

        const now = new Date();
        if (!session.codeExpiresAt || session.codeExpiresAt <= now) {
            const { code, expiresAt } = issueNewCode(round);
            session.currentCode = code;
            session.codeExpiresAt = expiresAt;
            round.markModified('attendanceSession');
            await round.save();
        }

        const responsePayload = {
            status: session.status,
            refreshIntervalSeconds: session.refreshIntervalSeconds,
            offlineCodeEnabled: Boolean(session.offlineCodeHash || session.offlineCodeUsedAt),
            offlineCodeUsedAt: session.offlineCodeUsedAt
        };

        if (session.codeExpiresAt) {
            responsePayload.expiresAt = session.codeExpiresAt;
        }

        if (req.user?.role === 'admin') {
            responsePayload.currentCode = session.currentCode;
        }

        return res.status(200).json(responsePayload);
    } catch (error) {
        return res.status(500).json({ message: 'Failed to fetch session status.', error: error.message });
    }
};

exports.submitAttendanceCode = async (req, res) => {
    try {
        const { roundId } = req.params;
        const { code } = req.body;

        if (!code || typeof code !== 'string') {
            return res.status(400).json({ message: 'A valid code is required.' });
        }

        if (!req.user || req.user.role !== 'student') {
            return res.status(403).json({ message: 'Only students can submit attendance codes.' });
        }

        const round = await Round.findById(roundId);
        if (!round) {
            return res.status(404).json({ message: 'Round not found.' });
        }

        const session = ensureSessionObject(round);
        if (session.status !== 'active') {
            return res.status(400).json({ message: 'Attendance session is not active for this round.' });
        }

        const now = new Date();
        const hashedInput = hashCode(code);
        let attendanceMethod = 'qr_code';
        let matched = false;

        if (session.currentCodeHash && session.codeExpiresAt && session.codeExpiresAt > now) {
            matched = session.currentCodeHash === hashedInput;
        }

        if (!matched && session.offlineCodeHash && !session.offlineCodeUsedAt && session.offlineCodeHash === hashedInput) {
            matched = true;
            attendanceMethod = 'offline_code';
            session.offlineCodeHash = null;
            session.offlineCodeUsedAt = now;
        }

        if (!matched) {
            if (session.codeExpiresAt && session.codeExpiresAt <= now) {
                return res.status(410).json({ message: 'Code has expired. Please request a fresh code from the administrator.' });
            }
            return res.status(400).json({ message: 'Invalid attendance code.' });
        }

        if (attendanceMethod === 'qr_code' && session.codeExpiresAt <= now) {
            return res.status(410).json({ message: 'Code has expired. Please request a fresh code from the administrator.' });
        }

        const application = await Application.findOne({
            student: req.user._id,
            job: round.job
        });

        if (!application) {
            return res.status(404).json({ message: 'Application not found for this student and round.' });
        }

        const progress = application.roundProgress.find((entry) => entry.round.toString() === round._id.toString());
        if (!progress) {
            return res.status(400).json({ message: 'This round is not associated with the student application.' });
        }

        if (progress.attendance) {
            return res.status(409).json({ message: 'Attendance already recorded for this round.' });
        }

        progress.attendance = true;
        progress.attendanceMethod = attendanceMethod;
        progress.attendanceMarkedAt = now;
        if (progress.result === 'pending') {
            progress.result = 'selected';
            progress.decidedAt = now;
        }

        if (!round.attendance.some((id) => id.toString() === req.user._id.toString())) {
            round.attendance.push(req.user._id);
        }

        round.markModified('attendanceSession');
        await round.save();
        await application.save();

        await User.findByIdAndUpdate(application.student, {
            $pull: {
                rejectionHistory: {
                    application: application._id,
                    round: round._id
                }
            }
        });

        return res.status(200).json({ message: 'Attendance recorded successfully.', method: attendanceMethod });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to record attendance.', error: error.message });
    }
};
