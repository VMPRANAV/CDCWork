import React, { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import axios from 'axios';
import './AdminDashboard.css';
import { QRCodeCanvas } from 'qrcode.react';

const POLL_INTERVAL_MS = 5000;
const REFRESH_INTERVAL_OPTIONS = [30, 45, 60, 90];

const AttendanceManager = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedJobId, setSelectedJobId] = useState('');
    const [selectedRoundId, setSelectedRoundId] = useState('');

    const [sessionState, setSessionState] = useState({ status: 'inactive' });
    const [sessionLoading, setSessionLoading] = useState(false);
    const [sessionError, setSessionError] = useState('');
    const [refreshInterval, setRefreshInterval] = useState(60);
    const [enableOfflineCode, setEnableOfflineCode] = useState(false);
    const [offlineCodeValue, setOfflineCodeValue] = useState(null);
    const [countdown, setCountdown] = useState('');
    const [showOfflineCode, setShowOfflineCode] = useState(false);
    const [isQrFullscreen, setIsQrFullscreen] = useState(false);

    const statusPollRef = useRef(null);
    const token = localStorage.getItem('authToken');
    const config = useMemo(() => ({ headers: { Authorization: `Bearer ${token}` } }), [token]);

    const fetchJobs = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const { data } = await axios.get('http://localhost:3002/api/jobs', config);
            const combined = [
                ...(data.private || []),
                ...(data.public || [])
            ];
            setJobs(combined);
            if (combined.length > 0) {
                setSelectedJobId((prev) => {
                    if (prev && combined.some((job) => job._id === prev)) {
                        return prev;
                    }
                    return combined[0]._id;
                });
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load jobs.');
        } finally {
            setLoading(false);
        }
    }, [config]);

    useEffect(() => {
        fetchJobs();
    }, [fetchJobs]);

    const selectedJob = useMemo(() => jobs.find((job) => job._id === selectedJobId) || null, [jobs, selectedJobId]);

    useEffect(() => {
        if (!selectedJob) {
            setSelectedRoundId('');
            return;
        }
        const firstRound = selectedJob.rounds?.[0]?._id || '';
        setSelectedRoundId((prev) => {
            if (prev && selectedJob.rounds?.some((round) => round._id === prev)) {
                return prev;
            }
            return firstRound;
        });
    }, [selectedJob]);

    const clearStatusPoll = useCallback(() => {
        if (statusPollRef.current) {
            clearInterval(statusPollRef.current);
            statusPollRef.current = null;
        }
    }, []);

    const fetchSessionStatus = useCallback(async (roundId) => {
        if (!roundId) {
            return null;
        }
        const { data } = await axios.get(
            `http://localhost:3002/api/rounds/${roundId}/attendance-session/status`,
            config
        );
        return data;
    }, [config]);

    const startPollingStatus = useCallback((roundId) => {
        clearStatusPoll();
        statusPollRef.current = setInterval(() => {
            fetchSessionStatus(roundId)
                .then((status) => {
                    if (!status) {
                        return;
                    }
                    setSessionState(status);
                    setSessionError('');
                    setEnableOfflineCode(Boolean(status.offlineCode));
                    if (status.refreshIntervalSeconds) {
                        setRefreshInterval(status.refreshIntervalSeconds);
                    }
                    if (status.offlineCode) {
                        setOfflineCodeValue(status.offlineCode);
                    }
                    if (status.status !== 'active') {
                        clearStatusPoll();
                    }
                })
                .catch((err) => {
                    setSessionError(err.response?.data?.message || 'Failed to refresh session status.');
                    clearStatusPoll();
                });
        }, POLL_INTERVAL_MS);
    }, [clearStatusPoll, fetchSessionStatus]);

    const loadSessionStatus = useCallback(async (roundId) => {
        if (!roundId) {
            setSessionState({ status: 'inactive' });
            setOfflineCodeValue(null);
            setEnableOfflineCode(false);
            clearStatusPoll();
            return;
        }

        setSessionLoading(true);
        setSessionError('');
        try {
            const status = await fetchSessionStatus(roundId);
            if (status) {
                setSessionState(status);
                if (status.refreshIntervalSeconds) {
                    setRefreshInterval(status.refreshIntervalSeconds);
                }
                setOfflineCodeValue(status.offlineCode || null);
                setEnableOfflineCode(status.status === 'active' ? Boolean(status.offlineCode) : false);
                if (status.status === 'active') {
                    startPollingStatus(roundId);
                } else {
                    clearStatusPoll();
                    setShowOfflineCode(false);
                    setIsQrFullscreen(false);
                }
            } else {
                setSessionState({ status: 'inactive' });
                setOfflineCodeValue(null);
                setEnableOfflineCode(false);
                setShowOfflineCode(false);
                setIsQrFullscreen(false);
            }
        } catch (err) {
            setSessionError(err.response?.data?.message || 'Failed to fetch session status.');
            setSessionState({ status: 'inactive' });
            setOfflineCodeValue(null);
            setEnableOfflineCode(false);
            setShowOfflineCode(false);
            setIsQrFullscreen(false);
            clearStatusPoll();
        } finally {
            setSessionLoading(false);
        }
    }, [fetchSessionStatus, startPollingStatus, clearStatusPoll]);

    useEffect(() => {
        loadSessionStatus(selectedRoundId);
        return () => clearStatusPoll();
    }, [selectedRoundId, loadSessionStatus, clearStatusPoll]);

    const handleStartSession = async () => {
        if (!selectedRoundId || sessionLoading) {
            return;
        }
        setSessionLoading(true);
        setSessionError('');
        try {
            const { data } = await axios.post(
                `http://localhost:3002/api/rounds/${selectedRoundId}/attendance-session/start`,
                {
                    refreshIntervalSeconds: Number(refreshInterval),
                    enableOfflineCode
                },
                config
            );
            setSessionState(data);
            setOfflineCodeValue(data.offlineCode || null);
            setEnableOfflineCode(Boolean(data.offlineCode));
            setSessionError('');
            startPollingStatus(selectedRoundId);
            setShowOfflineCode(false);
        } catch (err) {
            setSessionError(err.response?.data?.message || 'Failed to start attendance session.');
        } finally {
            setSessionLoading(false);
        }
    };

    const handleStopSession = async () => {
        if (!selectedRoundId || sessionLoading) {
            return;
        }
        setSessionLoading(true);
        setSessionError('');
        try {
            await axios.post(
                `http://localhost:3002/api/rounds/${selectedRoundId}/attendance-session/stop`,
                {},
                config
            );
            setSessionState({ status: 'inactive' });
            setOfflineCodeValue(null);
            setEnableOfflineCode(false);
            clearStatusPoll();
            setShowOfflineCode(false);
            setIsQrFullscreen(false);
        } catch (err) {
            setSessionError(err.response?.data?.message || 'Failed to stop attendance session.');
        } finally {
            setSessionLoading(false);
        }
    };

    const handleCloseFullscreen = useCallback(() => {
        setIsQrFullscreen(false);
    }, []);

    useEffect(() => {
        if (sessionState.status === 'active' && sessionState.expiresAt) {
            const updateCountdown = () => {
                const expires = new Date(sessionState.expiresAt).getTime();
                if (Number.isNaN(expires)) {
                    setCountdown('');
                    return;
                }
                const diffMs = expires - Date.now();
                if (diffMs <= 0) {
                    setCountdown('Expired');
                    return;
                }
                const totalSeconds = Math.floor(diffMs / 1000);
                const minutes = Math.floor(totalSeconds / 60);
                const seconds = totalSeconds % 60;
                setCountdown(`${minutes}m ${seconds.toString().padStart(2, '0')}s`);
            };

            updateCountdown();
            const interval = setInterval(updateCountdown, 1000);
            return () => clearInterval(interval);
        }
        setCountdown('');
        setShowOfflineCode(false);
        setIsQrFullscreen(false);
        return () => {};
    }, [sessionState.status, sessionState.expiresAt]);

    if (loading) {
        return <p className="students-container">Loading jobs...</p>;
    }

    return (
        <>
            <div className="students-container">
                <div className="students-header">
                    <h2>Attendance Sessions</h2>
                    <p className="muted-text">Select a job and round to control QR code attendance sessions.</p>
                </div>

                {error && <p className="error-message">{error}</p>}

                <div className="attendance-manager-layout">
                    <div className="attendance-manager-column">
                        <h3>Job Postings</h3>
                        {jobs.length === 0 ? (
                            <p className="muted-text">No jobs available.</p>
                        ) : (
                            <ul className="simple-list">
                                {jobs.map((job) => (
                                    <li key={job._id}>
                                        <button
                                            type="button"
                                            className={`list-btn ${selectedJobId === job._id ? 'active' : ''}`}
                                            onClick={() => {
                                                setSelectedJobId(job._id);
                                                setSessionError('');
                                            }}
                                        >
                                            <span className="list-title">{job.jobTitle}</span>
                                            <span className={`status-badge status-${job.status?.toLowerCase?.() || 'unknown'}`}>
                                                {job.status?.replace('_', ' ') || 'Unknown'}
                                            </span>
                                            <span className="list-subtitle">{job.companyName}</span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="attendance-manager-column session-column">
                        {selectedJob ? (
                            <>
                                <h3>{selectedJob.jobTitle} Rounds</h3>
                                {selectedJob.rounds && selectedJob.rounds.length > 0 ? (
                                    <div className="session-rounds">
                                        <div className="session-rounds-list">
                                            {selectedJob.rounds.map((round) => (
                                                <button
                                                    key={round._id}
                                                    type="button"
                                                    className={`list-btn ${selectedRoundId === round._id ? 'active' : ''}`}
                                                    onClick={() => {
                                                        setSelectedRoundId(round._id);
                                                        setSessionError('');
                                                    }}
                                                >
                                                    <span className="list-title">{round.roundName || 'Round'}</span>
                                                    <span className="list-subtitle">
                                                        Sequence {round.sequence ?? '-'} • {round.mode || 'Mode'}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>

                                        {selectedRoundId ? (
                                            <div className="session-controls-card">
                                                <div className="session-controls-grid">
                                                    <label>
                                                        Refresh Interval
                                                        <select
                                                            value={refreshInterval}
                                                            onChange={(e) => setRefreshInterval(Number(e.target.value))}
                                                            disabled={sessionLoading || sessionState.status === 'active'}
                                                        >
                                                            {REFRESH_INTERVAL_OPTIONS.map((value) => (
                                                                <option key={value} value={value}>
                                                                    {value} seconds
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </label>
                                                    <label className="checkbox-inline">
                                                        <input
                                                            type="checkbox"
                                                            checked={enableOfflineCode}
                                                            onChange={(e) => setEnableOfflineCode(e.target.checked)}
                                                            disabled={sessionLoading || sessionState.status === 'active'}
                                                        />
                                                        Enable offline fallback code
                                                    </label>
                                                </div>
                                                <div className="session-actions">
                                                    <button
                                                        type="button"
                                                        className="btn-primary"
                                                        onClick={handleStartSession}
                                                        disabled={
                                                            sessionLoading ||
                                                            !selectedRoundId ||
                                                            sessionState.status === 'active'
                                                        }
                                                    >
                                                        {sessionLoading && sessionState.status !== 'active' ? 'Starting...' : 'Start Session'}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="btn-danger"
                                                        onClick={handleStopSession}
                                                        disabled={sessionLoading || sessionState.status !== 'active'}
                                                    >
                                                        {sessionLoading && sessionState.status === 'active' ? 'Stopping...' : 'Stop Session'}
                                                    </button>
                                                    {sessionState.status === 'active' && (
                                                        <button
                                                            type="button"
                                                            className="btn-secondary btn-compact"
                                                            onClick={() => setIsQrFullscreen(true)}
                                                        >
                                                            Present
                                                        </button>
                                                    )}
                                                    {sessionState.status === 'active' && offlineCodeValue && (
                                                        <button
                                                            type="button"
                                                            className="btn-link"
                                                            onClick={() => setShowOfflineCode((prev) => !prev)}
                                                        >
                                                            {showOfflineCode ? 'Hide offline code' : 'Show offline code'}
                                                        </button>
                                                    )}
                                                </div>
                                                {sessionError && <p className="session-error">{sessionError}</p>}
                                                {sessionState.status === 'active' && (
                                                    <div className="session-active-card">
                                                        <div className="session-active-header">
                                                            <div className="session-meta">
                                                                <span>
                                                                    <strong>Current Code:</strong> {sessionState.currentCode || '—'}
                                                                </span>
                                                                {countdown && (
                                                                    <span>
                                                                        <strong>Expires In:</strong> {countdown}
                                                                    </span>
                                                                )}
                                                                {sessionState.refreshIntervalSeconds && (
                                                                    <span>
                                                                        <strong>Interval:</strong> {sessionState.refreshIntervalSeconds} seconds
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="session-active-actions">
                                                                <div className="session-active-actions-grid">
                                                                    <button
                                                                        type="button"
                                                                        className="btn-secondary btn-compact"
                                                                        onClick={() => setIsQrFullscreen(true)}
                                                                    >
                                                                        Present
                                                                    </button>
                                                                    {offlineCodeValue && (
                                                                        <button
                                                                            type="button"
                                                                            className="btn-link"
                                                                            onClick={() => setShowOfflineCode((prev) => !prev)}
                                                                        >
                                                                            {showOfflineCode ? 'Hide offline code' : 'Show offline code'}
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {sessionState.currentCode && (
                                                            <div className="qr-wrapper">
                                                                <QRCodeCanvas
                                                                    value={JSON.stringify({
                                                                        jobId: selectedJobId,
                                                                        roundId: selectedRoundId,
                                                                        code: sessionState.currentCode
                                                                    })}
                                                                    size={220}
                                                                />
                                                            </div>
                                                        )}
                                                        {offlineCodeValue && showOfflineCode && (
                                                            <div className="offline-code-toggle">
                                                                <p className="offline-code-text">
                                                                    <strong>Offline Code:</strong> {offlineCodeValue}
                                                                    {sessionState.offlineCodeUsedAt && (
                                                                        <span className="offline-used-at">
                                                                            {' '}(used {new Date(sessionState.offlineCodeUsedAt).toLocaleString()})
                                                                        </span>
                                                                    )}
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="no-rounds">Select a round to manage its attendance session.</div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="no-rounds">This job has no rounds configured yet.</div>
                                )}
                            </>
                        ) : (
                            <p className="muted-text">Select a job to manage its attendance sessions.</p>
                        )}
                    </div>
                </div>
            </div>

            {sessionState.status === 'active' && isQrFullscreen && (
                <div
                    className="fullscreen-overlay"
                    role="dialog"
                    aria-modal="true"
                    onClick={handleCloseFullscreen}
                >
                    <div className="fullscreen-card" onClick={(event) => event.stopPropagation()}>
                        <div className="fullscreen-card-header">
                            <h3>Attendance QR Code</h3>
                            <button
                                type="button"
                                className="btn-secondary btn-compact"
                                onClick={handleCloseFullscreen}
                            >
                                Close
                            </button>
                        </div>
                        <div className="fullscreen-qr-wrapper">
                            <QRCodeCanvas
                                value={JSON.stringify({
                                    jobId: selectedJobId,
                                    roundId: selectedRoundId,
                                    code: sessionState.currentCode
                                })}
                                size={320}
                            />
                        </div>
                        <div className="fullscreen-meta">
                            <span className="fullscreen-code-value">{sessionState.currentCode}</span>
                            {countdown && <span className="fullscreen-countdown">Expires in {countdown}</span>}
                            {offlineCodeValue && showOfflineCode && (
                                <span className="offline-code-text">
                                    Offline Code: {offlineCodeValue}
                                    {sessionState.offlineCodeUsedAt && (
                                        <span className="offline-used-at">
                                            {' '}(used {new Date(sessionState.offlineCodeUsedAt).toLocaleString()})
                                        </span>
                                    )}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AttendanceManager;
