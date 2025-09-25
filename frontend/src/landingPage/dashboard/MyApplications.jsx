import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MyApplication.css'; 

const MyApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const token = localStorage.getItem('authToken');
    const config = { headers: { Authorization: `Bearer ${token}`, role: "user" } };

    // Fetch applications when the component mounts
    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const { data } = await axios.get('http://localhost:3002/api/applications/my-applications', config);
                setApplications(data);
            } catch (err) {
                setError('Failed to fetch applications.');
            } finally {
                setLoading(false);
            }
        };
        fetchApplications();
    }, []);

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
                        const appliedDate = app.appliedDate ? new Date(app.appliedDate).toLocaleDateString() : 'Not available';
                        const currentRoundLabel = app.currentRound?.roundName || 'Not assigned yet';

                        return (
                            <div key={app._id} className="application-card">
                                <div className="card-content">
                                    <h3>{app.job?.jobTitle || 'Job Title Not Available'}</h3>
                                    <p className="company-name">{app.job?.companyName || 'Company Not Available'}</p>
                                    <p className="applied-date">Applied on: {appliedDate}</p>
                                    <p className="round-status">Current round: {currentRoundLabel}</p>
                                    {app.job?.jobDescription && (
                                        <p className="job-description">
                                            {app.job.jobDescription.substring(0, 100)}...
                                        </p>
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