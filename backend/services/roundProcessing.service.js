const mongoose = require('mongoose');
const Round = require('../models/round.model');
const Application = require('../models/application.model');

let timer = null;

const supportsSessions = () => {
    try {
        return mongoose.connection?.client?.topology?.hasSessionSupport?.() ?? false;
    } catch (error) {
        return false;
    }
};

const processExpiredRounds = async () => {
    const now = new Date();

    try {
        const rounds = await Round.find({
            isAttendanceMandatory: true,
            scheduledAt: { $lte: now },
            processedAt: { $exists: false },
          
            status: { $in: ['scheduled', 'in-progress'], $nin: ['cancelled', 'postponed'] }
        }).sort({ scheduledAt: 1 });

        const canUseSessions = supportsSessions();

        for (const round of rounds) {
            const session = canUseSessions ? await mongoose.startSession() : null;
            if (session) {
                session.startTransaction();
            }
            try {
                let applicationQuery = Application.find({
                    job: round.job,
                    'roundProgress.round': round._id,
                    finalStatus: 'in_process'
                });
                if (session) {
                    applicationQuery = applicationQuery.session(session);
                }
                const applications = await applicationQuery;

                const updates = [];

                for (const application of applications) {
                    const progress = application.roundProgress.find(
                        (entry) => entry.round.toString() === round._id.toString()
                    );

                    if (!progress) {
                        continue;
                    }

                    // Process attendance-based rejections
                    if (round.isAttendanceMandatory && !progress.attendance) {
                        progress.result = 'rejected';
                        progress.decidedAt = new Date();
                        application.finalStatus = 'rejected';
                        application.currentRound = undefined;
                        application.currentRoundSequence = undefined;
                        updates.push(application.save(session ? { session } : undefined));
                        continue;
                    }

                    // Auto-advance based on attendance
                    if (round.autoAdvanceOnAttendance && progress.attendance && progress.result === 'pending') {
                        progress.result = 'selected';
                        progress.decidedAt = new Date();
                        updates.push(application.save(session ? { session } : undefined));
                    }
                }

                await Promise.all(updates);

                // Mark round as processed and completed
                round.processedAt = new Date();
                round.status = 'completed';
                await round.save(session ? { session } : undefined);

                if (session) {
                    await session.commitTransaction();
                }

                console.log(`Processed expired round: ${round.roundName} (${round._id})`);
            } catch (error) {
                if (session) {
                    await session.abortTransaction();
                }
                console.error('Error processing round attendance', {
                    roundId: round._id.toString(),
                    roundName: round.roundName,
                    error: error.message
                });
            } finally {
                session?.endSession();
            }
        }
    } catch (error) {
        console.error('Error fetching rounds for processing', error);
    }
};

const startRoundProcessing = (intervalMs = 15 * 60 * 1000) => {
    if (timer) {
        console.log('Round processing timer already running');
        return;
    }
    
    const invokeProcessor = () => {
        processExpiredRounds().catch((error) =>
            console.error('Round processing execution failed', error)
        );
    };

    // Kick off immediately once
    console.log('Starting round processing service...');
    invokeProcessor();

    timer = setInterval(invokeProcessor, intervalMs);
    console.log(`Round processing timer set to run every ${intervalMs / 1000} seconds`);
};

// Function to stop the processing (useful for cleanup)
const stopRoundProcessing = () => {
    if (timer) {
        clearInterval(timer);
        timer = null;
        console.log('Round processing timer stopped');
    }
};

module.exports = {
    startRoundProcessing,
    stopRoundProcessing,
    processExpiredRounds
};
