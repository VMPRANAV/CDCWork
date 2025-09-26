import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import './MyApplication.css';
import { Scanner as QrScanner } from '@yudiel/react-qr-scanner';

const MyApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [attendanceInputs, setAttendanceInputs] = useState({});
    const [attendanceFeedback, setAttendanceFeedback] = useState({});
    const [attendanceSubmitting, setAttendanceSubmitting] = useState({});
    const [scannerVisible, setScannerVisible] = useState({});

    const token = localStorage.getItem('authToken');
    const config = useMemo(() => ({
        headers: { Authorization: `Bearer ${token}`, role: 'student' }
    }), [token]);

    // Fetch applications when the component mounts
    const fetchRoundStatus = useCallback(async (roundId) => {
        try {
            const { data } = await axios.get(`http://localhost:3002/api/rounds/${roundId}/attendance-session/status`, config);
            return data;
        } catch (err) {
            return { status: 'inactive' };
        }
    }, [config]);

    const enrichApplicationsWithAttendance = useCallback(async (apps) => {
        const requests = apps.map(async (app) => {
            const roundId = app.currentRound?._id;
            if (!roundId) {
                return { ...app, attendanceSession: { status: 'inactive' } };
            }
            const status = await fetchRoundStatus(roundId);
            return { ...app, attendanceSession: status };
        });
        return Promise.all(requests);
    }, [fetchRoundStatus]);

    const fetchApplications = useCallback(async () => {
        try {
            const { data } = await axios.get('http://localhost:3002/api/applications/my-applications', config);
            const enriched = await enrichApplicationsWithAttendance(data);
            setApplications(enriched);
            setError('');
        } catch (err) {
            setError('Failed to fetch applications.');
        } finally {
            setLoading(false);
        }
    }, [config, enrichApplicationsWithAttendance]);

    useEffect(() => {
        fetchApplications();
    }, [fetchApplications]);

    const handleInputChange = (applicationId, value) => {
        setAttendanceInputs((prev) => ({
            ...prev,
            [applicationId]: value.toUpperCase()
        }));
    };

    const updateFeedback = (applicationId, type, message) => {
        setAttendanceFeedback((prev) => ({
            ...prev,
            [applicationId]: { type, message }
        }));
    };

    const handleSubmitAttendance = async (applicationId, roundId) => {
        const code = (attendanceInputs[applicationId] || '').trim();

        if (!code) {
            updateFeedback(applicationId, 'error', 'Enter the code shown by the coordinator.');
            return;
        }

        setAttendanceSubmitting((prev) => ({ ...prev, [applicationId]: true }));
        updateFeedback(applicationId, 'info', 'Submitting attendance...');

        try {
            await axios.post(
                `http://localhost:3002/api/rounds/${roundId}/attendance-checkin`,
                { code },
                config
            );
            updateFeedback(applicationId, 'success', 'Attendance recorded successfully.');
            setAttendanceInputs((prev) => ({ ...prev, [applicationId]: '' }));
            setScannerVisible((prev) => ({ ...prev, [applicationId]: false }));
            fetchApplications();
        } catch (err) {
            const message = err.response?.data?.message || 'Failed to record attendance.';
            updateFeedback(applicationId, 'error', message);
        } finally {
            setAttendanceSubmitting((prev) => ({ ...prev, [applicationId]: false }));
        }
    };

    const toggleScanner = (applicationId) => {
        setScannerVisible((prev) => ({
            ...prev,
            [applicationId]: !prev[applicationId]
        }));
        setAttendanceFeedback((prev) => ({
            ...prev,
            [applicationId]: null
        }));
    };

    const handleScanDecode = (applicationId, roundId, text) => {
        if (!text) {
            return;
        }

        const decodedText = text.trim();
        if (!decodedText) {
            return;
        }

        let capturedCode = '';

        try {
            const payload = JSON.parse(decodedText);

            if (payload.roundId && payload.roundId !== roundId) {
                updateFeedback(applicationId, 'error', 'This QR belongs to another round.');
                return;
            }

            capturedCode = (payload.code || payload.currentCode || '').toString().trim();
            if (!capturedCode && typeof payload === 'string') {
                capturedCode = payload.trim();
            }
        } catch (err) {
            capturedCode = decodedText;
        }

        if (!capturedCode) {
            updateFeedback(applicationId, 'error', 'The QR did not contain a valid code.');
            return;
        }

        setAttendanceInputs((prev) => ({ ...prev, [applicationId]: capturedCode.toUpperCase() }));
        updateFeedback(applicationId, 'info', 'Code captured from QR. Review and submit.');
    };

    const handleScanError = (error) => {
        if (error) {
            // eslint-disable-next-line no-console
            console.debug('QR scan error', error);
        }
    };

    if (loading) return <p>Loading your applications...</p>;

    return (
        <div className="applications-container">
            <div className="applications-header">
                <h2>My Job Applications</h2>
            </div>
            
            {error && <p className="error-message">{error}</p>}

            <div className="applications-list">
                {applications.length > 0 ? (
                    applications.map((app) => {
                        const statusRaw = app.currentRound?.roundName ? 'in_process' : (app.finalStatus || app.status || 'in_process');
                        const statusLabel = app.currentRound?.roundName
                            ? `In ${app.currentRound.roundName}`
                            : (statusRaw.replace(/_/g, ' '));
                        const statusClass = `status-${statusRaw.toLowerCase().replace(/\s+/g, '-')}`;
                        const appliedDate = app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'Not available';
                        const currentRoundLabel = app.currentRound?.roundName || 'Not assigned yet';
                        const lastUpdatedAt = app.updatedAt ? new Date(app.updatedAt).toLocaleString() : null;
                        const currentRoundId = app.currentRound?._id;
                        const roundProgress = app.roundProgress || [];
                        const currentProgress = currentRoundId
                            ? roundProgress.find((progress) => progress.round === currentRoundId || progress.round?._id === currentRoundId)
                            : null;
                        const attendanceMarked = currentProgress?.attendance;
                        const attendanceFeedbackEntry = attendanceFeedback[app._id];
                        const attendanceCodeValue = attendanceInputs[app._id] || '';
                        const isSubmitting = Boolean(attendanceSubmitting[app._id]);
                        const scannerOpen = Boolean(scannerVisible[app._id]);
                        const sessionStatus = app.attendanceSession || { status: 'inactive' };
                        const sessionActive = sessionStatus.status === 'active';
                        const offlineEnabled = Boolean(sessionStatus.offlineCodeEnabled || sessionStatus.offlineCode);
                        const offlineUsedAt = sessionStatus.offlineCodeUsedAt;

                        return (
                            <div key={app._id} className="application-card">
                                <div className="card-content">
                                    <h3>{app.job?.jobTitle || 'Job Title Not Available'}</h3>
                                    <p className="company-name">{app.job?.companyName || 'Company Not Available'}</p>
                                    <p className="applied-date">Applied on: {appliedDate}</p>
                                    <p className="round-status">Current round: {currentRoundLabel}</p>
                                    {lastUpdatedAt && (
                                        <p className="last-updated">Last updated: {lastUpdatedAt}</p>
                                    )}
                                    {app.job?.jobDescription && (
                                        <p className="job-description">
                                            {app.job.jobDescription.substring(0, 100)}...
                                        </p>
                                    )}
                                    {currentRoundId && (
                                        <div className="attendance-box">
                                            <div className="attendance-box-header">
                                                <h4>Attendance for {currentRoundLabel}</h4>
                                                {attendanceMarked && (
                                                    <span className="attendance-status-tag">Recorded</span>
                                                )}
                                            </div>
                                            {sessionActive ? (
                                                <p className="attendance-session-pill">Session live</p>
                                            ) : (
                                                <p className="attendance-session-pill inactive">Session not active</p>
                                            )}
                                            {offlineEnabled && (
                                                <p className="attendance-offline-hint">
                                                    Offline fallback enabled
                                                    {offlineUsedAt && (
                                                        <span className="offline-used-at">
                                                            {' '}(used {new Date(offlineUsedAt).toLocaleString()})
                                                        </span>
                                                    )}
                                                </p>
                                            )}
                                            {attendanceMarked ? (
                                                <p className="attendance-status-text">Your attendance for this round has already been marked.</p>
                                            ) : (
                                                <>
                                                    <p className="attendance-instructions">
                                                        Enter the code shown by the coordinator or scan the displayed QR to mark your presence.
                                                    </p>
                                                    <div className="attendance-input-row">
                                                        <input
                                                            type="text"
                                                            value={attendanceCodeValue}
                                                            maxLength={8}
                                                            placeholder="Enter code"
                                                            onChange={(event) => handleInputChange(app._id, event.target.value)}
                                                            disabled={isSubmitting || !sessionActive}
                                                        />
                                                        <button
                                                            type="button"
                                                            className="btn-secondary"
                                                            onClick={() => handleSubmitAttendance(app._id, currentRoundId)}
                                                            disabled={isSubmitting || !sessionActive}
                                                        >
                                                            {sessionActive ? (isSubmitting ? 'Submitting...' : 'Submit Code') : 'Session Idle'}
                                                        </button>
                                                    </div>
                                                    <div className="attendance-action-buttons">
                                                        <button
                                                            type="button"
                                                            className="btn-link"
                                                            onClick={() => toggleScanner(app._id)}
                                                            disabled={!sessionActive}
                                                        >
                                                            {scannerOpen ? 'Close QR Scanner' : 'Scan QR instead'}
                                                        </button>
                                                    </div>
                                                    {scannerOpen && (
                                                        <div className="qr-scanner-container">
                                                            <QrScanner
                                                                constraints={{ facingMode: 'environment' }}
                                                                scanDelay={500}
                                                                onDecode={(decodedText) => handleScanDecode(app._id, currentRoundId, decodedText)}
                                                                onError={handleScanError}
                                                                style={{ width: '100%' }}
                                                            />
                                                        </div>
                                                    )}
                                                    {attendanceFeedbackEntry && (
                                                        <p className={`attendance-feedback ${attendanceFeedbackEntry.type}`}>
                                                            {attendanceFeedbackEntry.message}
                                                        </p>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <div className={`status-pill ${statusClass}`}>
                                    {statusLabel}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    !loading && <p>You have not applied to any jobs yet. Visit the Available Jobs section to find opportunities.</p>
                )}
            </div>
        </div>
    );
};

export default MyApplications;