const mongoose = require('mongoose');
const { MONGO_URL } = require('../.config/config');
const User = require('../models/user.model');
const { testStudents } = require('./testStudentsData');

const DEFAULT_URI = MONGO_URL || 'mongodb://127.0.0.1:27017/CDCWork';

async function seedStudents() {
    try {
        await mongoose.connect(DEFAULT_URI);
        console.log('[feedUser] Connected to MongoDB');

        const emails = testStudents.map((student) => student.collegeEmail.toLowerCase());
        const existingStudents = await User.find({ collegeEmail: { $in: emails } }).select('collegeEmail');
        const existingEmailSet = new Set(existingStudents.map((student) => student.collegeEmail.toLowerCase()));

        const candidates = testStudents.filter(
            (student) => !existingEmailSet.has(student.collegeEmail.toLowerCase())
        );

        if (candidates.length === 0) {
            console.log('[feedUser] No new students to insert. All test accounts already exist.');
            return;
        }

        let inserted = 0;
        for (const student of candidates) {
            try {
                const user = new User({
                    ...student,
                    role: 'student',
                });
                await user.save();
                inserted += 1;
            } catch (studentError) {
                if (studentError.code === 11000) {
                    console.warn(`[feedUser] Skipped duplicate student: ${student.collegeEmail}`);
                    continue;
                }
                console.error(`[feedUser] Failed to insert ${student.collegeEmail}:`, studentError.message);
            }
        }

        console.log(`[feedUser] Inserted ${inserted} student${inserted === 1 ? '' : 's'}.`);
    } catch (error) {
        console.error('[feedUser] Failed to seed students:', error);
    } finally {
        await mongoose.disconnect();
        console.log('[feedUser] Disconnected from MongoDB');
    }
}

if (require.main === module) {
    seedStudents().then(() => process.exit(0)).catch(() => process.exit(1));
}

module.exports = {
    seedStudents,
};
