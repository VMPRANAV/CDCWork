import React, { useState } from 'react';
import axios from 'axios';
// You can reuse your profile CSS for the forms
import '../profile/Profile.css';

const CreateJob = () => {
    const [formData, setFormData] = useState({
        companyName: '',
        jobTitle: '',
        jobDescription: '',
        eligibility: {
            minCgpa: 0,
            minTenthMarks: 0,
            minTwelfthMarks: 0,
            passoutYear: new Date().getFullYear() + 1,
            maxArrears: 0
        }
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleEligibilityChange = (e) => {
        setFormData({
            ...formData,
            eligibility: { ...formData.eligibility, [e.target.name]: e.target.value }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            const token = localStorage.getItem('authToken');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.post('http://localhost:3002/api/jobs', formData, config);
            setSuccess('Job posted successfully!');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to post job.');
        }
    };

    return (
        <div className="profile-card">
            <div className="card-header">
                <h3>Post a New Job Opening</h3>
            </div>
            <form onSubmit={handleSubmit} className="profile-form">
                <div className="form-row">
                    <label htmlFor="companyName">Company Name</label>
                    <input id="companyName" name="companyName" value={formData.companyName} onChange={handleChange} placeholder="e.g., Acme Corp" required />
                </div>
                <div className="form-row">
                    <label htmlFor="jobTitle">Job Title</label>
                    <input id="jobTitle" name="jobTitle" value={formData.jobTitle} onChange={handleChange} placeholder="e.g., Software Engineer" required />
                </div>
                <div className="form-row full-width">
                    <label htmlFor="jobDescription">Job Description</label>
                    <textarea id="jobDescription" name="jobDescription" value={formData.jobDescription} onChange={handleChange} placeholder="Describe responsibilities, requirements, and any additional info" rows="5" required />
                </div>
                
                <fieldset className="full-width">
                    <legend>Eligibility Criteria</legend>
                    <div className="form-row">
                        <label htmlFor="minCgpa">Minimum CGPA</label>
                        <input id="minCgpa" type="number" step="0.01" name="minCgpa" value={formData.eligibility.minCgpa} onChange={handleEligibilityChange} placeholder="e.g., 7.0" />
                    </div>
                    <div className="form-row">
                        <label htmlFor="minTenthMarks">Minimum 10th %</label>
                        <input id="minTenthMarks" type="number" name="minTenthMarks" value={formData.eligibility.minTenthMarks} onChange={handleEligibilityChange} placeholder="e.g., 75" />
                    </div>
                    <div className="form-row">
                        <label htmlFor="minTwelfthMarks">Minimum 12th %</label>
                        <input id="minTwelfthMarks" type="number" name="minTwelfthMarks" value={formData.eligibility.minTwelfthMarks} onChange={handleEligibilityChange} placeholder="e.g., 75" />
                    </div>
                    <div className="form-row">
                        <label htmlFor="passoutYear">Passout Year</label>
                        <input id="passoutYear" type="number" name="passoutYear" value={formData.eligibility.passoutYear} onChange={handleEligibilityChange} placeholder="e.g., 2026" required />
                    </div>
                    <div className="form-row">
                        <label htmlFor="maxArrears">Max Current Arrears</label>
                        <input id="maxArrears" type="number" name="maxArrears" value={formData.eligibility.maxArrears} onChange={handleEligibilityChange} placeholder="e.g., 0" />
                    </div>
                </fieldset>

                <div className="form-actions">
                    <button type="submit" className="save-button">Post Job</button>
                </div>
                {success && <p style={{ color: 'green' }}>{success}</p>}
                {error && <p className="error-message">{error}</p>}
            </form>
        </div>
    );
};

export default CreateJob;