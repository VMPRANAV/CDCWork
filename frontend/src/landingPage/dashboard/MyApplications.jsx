import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MyApplication.css'; 

const MyApplications = () => {
    const [applications, setApplications] = useState([]);
    const [companyName, setCompanyName] = useState('');
    const [jobTitle, setJobTitle] = useState('');
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const token = localStorage.getItem('authToken');
    const config = { headers: { Authorization: `Bearer ${token}` } };

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

    // Handle form submission to add a new application
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data: newApplication } = await axios.post('http://localhost:3002/api/applications', { companyName, jobTitle }, config);
            // Add the new application to the top of the list
            setApplications([newApplication, ...applications]);
            // Reset form and hide it
            setCompanyName('');
            setJobTitle('');
            setIsFormVisible(false);
        } catch (err) {
            setError('Failed to add application. Please try again.');
        }
    };

    if (loading) return <p>Loading your applications...</p>;

    return (
        <div className="applications-container">
            <div className="applications-header">
                <h2>My Job Applications</h2>
                <button onClick={() => setIsFormVisible(!isFormVisible)} className="add-new-btn">
                    {isFormVisible ? 'Cancel' : '+ Add New Application'}
                </button>
            </div>

            {/* Conditionally render the form */}
            {isFormVisible && (
                <div className="add-application-form">
                    <form onSubmit={handleSubmit}>
                        <h3>Add a New Application</h3>
                        <div className="form-group">
                            <label htmlFor="companyName">Company Name</label>
                            <input
                                type="text"
                                id="companyName"
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="jobTitle">Job Title / Role</label>
                            <input
                                type="text"
                                id="jobTitle"
                                value={jobTitle}
                                onChange={(e) => setJobTitle(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="submit-btn">Submit Application</button>
                    </form>
                </div>
            )}
            
            {error && <p className="error-message">{error}</p>}

            <div className="applications-list">
                {applications.length > 0 ? (
                    applications.map((app) => (
                        <div key={app._id} className="application-card">
                            <div className="card-content">
                                <h3>{app.jobTitle}</h3>
                                <p className="company-name">{app.companyName}</p>
                                <p className="applied-date">
                                    Applied on: {new Date(app.appliedDate).toLocaleDateString()}
                                </p>
                            </div>
                            <div className={`status-pill ${app.status.toLowerCase().replace(' ', '-')}`}>
                                {app.status}
                            </div>
                        </div>
                    ))
                ) : (
                    !loading && <p>You have not added any applications yet.</p>
                )}
            </div>
        </div>
    );
};

export default MyApplications;