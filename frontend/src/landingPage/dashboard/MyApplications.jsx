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
                    applications.map((app) => (
                        <div key={app._id} className="application-card">
                            <div className="card-content">
                                <h3>{app.job?.jobTitle}</h3>
                                <p className="company-name">{app.job?.companyName}</p>
                                <p className="applied-date">
                                    Applied on: {new Date(app.appliedDate).toLocaleDateString()}
                                </p>
                                {app.job?.jobDescription && (
                                    <p className="job-description">
                                        {app.job.jobDescription.substring(0, 100)}...
                                    </p>
                                )}
                            </div>
                            <div className={`status-pill ${app.status.toLowerCase().replace(' ', '-')}`}>
                                {app.status}
                            </div>
                        </div>
                    ))
                ) : (
                    !loading && <p>You have not applied to any jobs yet. Visit the Available Jobs section to find opportunities.</p>
                )}
            </div>
        </div>
    );
};

export default MyApplications;