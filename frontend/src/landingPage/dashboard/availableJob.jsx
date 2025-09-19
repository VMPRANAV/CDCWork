import React, { useState, useEffect } from 'react';
import axios from 'axios';
// You can reuse application CSS
import './MyApplication.css';

const AvailableJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEligibleJobs = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const { data } = await axios.get('http://localhost:3002/api/jobs/eligible', config);
                setJobs(data);
            } catch (error) {
                console.error("Failed to fetch jobs", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEligibleJobs();
    }, []);

    const handleApply = async (jobId) => {
        // You would build the logic here to call your 'createApplication' endpoint
        alert(`Applying to job ${jobId}...`);
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
                            <button onClick={() => handleApply(job._id)} className="add-new-btn">Apply Now</button>
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