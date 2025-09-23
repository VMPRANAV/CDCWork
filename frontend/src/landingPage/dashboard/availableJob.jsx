import React, { useState, useEffect } from 'react';
import axios from 'axios';
// You can reuse application CSS
import './MyApplication.css';

const AvailableJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const config = { headers: { Authorization: `Bearer ${token}`, role : "user" } };

                // Fetch eligible jobs
                const jobsResponse = await axios.get('http://localhost:3002/api/jobs/eligible', config);
                setJobs(jobsResponse.data);

                // Fetch user's applications
                const applicationsResponse = await axios.get('http://localhost:3002/api/applications/my-applications', config);
                setApplications(applicationsResponse.data);

            } catch (error) {
                console.error("Failed to fetch data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Helper function to check if user has already applied to a job
    const hasAppliedToJob = (jobId) => {
        return applications.some(app => app.job && app.job._id === jobId);
    };

    const handleApply = async (jobId) => {
        try {
            const token = localStorage.getItem('authToken');
            const config = { headers: { Authorization: `Bearer ${token}`, role: "user" } };

            const { data } = await axios.post('http://localhost:3002/api/applications', { jobId }, config);
            alert('Application submitted successfully!');

            // Refresh applications list to update the UI
            const applicationsResponse = await axios.get('http://localhost:3002/api/applications/my-applications', config);
            setApplications(applicationsResponse.data);

        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to apply for job';
            alert(errorMessage);
            console.error('Application failed:', error);
        }
    };

    if (loading) return <p>Finding eligible jobs for you...</p>;

    return (
        <div className="applications-container">
            <div className="applications-header">
                <h2>Available Job Openings</h2>
            </div>
            <div className="applications-list">
                {jobs.length > 0 ? (
                    jobs.map(job => (
                        <div key={job._id} className="application-card">
                            <div className="card-content">
                                <h3>{job.jobTitle}</h3>
                                <p className="company-name">{job.companyName}</p>
                                <p className="applied-date">{job.jobDescription.substring(0, 100)}...</p>
                            </div>
                            {hasAppliedToJob(job._id) ? (
                                <button className="applied-btn" disabled>Already Applied</button>
                            ) : (
                                <button onClick={() => handleApply(job._id)} className="add-new-btn">Apply Now</button>
                            )}
                        </div>
                    ))
                ) : (
                    <p>No job openings currently match your profile. Please ensure your profile is fully updated.</p>
                )}
            </div>
        </div>
    );
};

export default AvailableJobs;