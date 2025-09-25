import React, { useState, useEffect } from 'react';
import axios from 'axios';
// We can reuse the CSS from the AllStudents page
import './AdminDashboard.css';

// This is a new component for the Modal
const UpdateModal = ({ application, onClose, onUpdate }) => {
    const [finalStatus, setFinalStatus] = useState(application.finalStatus || 'in_process');
    const [notes, setNotes] = useState(application.notes || '');

    const handleSubmit = (e) => {
        e.preventDefault();
        onUpdate(application._id, { finalStatus, notes });
    };

    const statusLabel = (value) => {
        switch (value) {
            case 'placed':
                return 'Placed';
            case 'rejected':
                return 'Rejected';
            default:
                return 'In Process';
        }
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <h2>Update Application</h2>
                <p>
                    <strong>{application.job?.jobTitle || 'Unknown Role'}</strong> at{' '}
                    <strong>{application.job?.companyName || 'Unknown Company'}</strong>
                </p>
                <div className="round-progress-section">
                    <h3>Round Progress</h3>
                    {application.roundProgress && application.roundProgress.length > 0 ? (
                        <ul className="round-progress-list">
                            {application.roundProgress.map((entry) => (
                                <li key={`${entry.round}-${entry.result}`} className={`round-progress-item result-${entry.result}`}>
                                    <div>
                                        <strong>{entry.round?.roundName || 'Round'}</strong>
                                        {entry.round?.sequence !== undefined && ` (Round ${entry.round.sequence})`}
                                    </div>
                                    <div className="round-result">
                                        Result: {entry.result}
                                        {entry.attendance ? ' · Attended' : ' · Not Attended'}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="muted-text">No round activity recorded yet.</p>
                    )}
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Final Status</label>
                        <select value={finalStatus} onChange={(e) => setFinalStatus(e.target.value)}>
                            <option value="in_process">In Process</option>
                            <option value="rejected">Rejected</option>
                            <option value="placed">Placed</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Notes</label>
                        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows="3"></textarea>
                    </div>
                    <div className="modal-actions">
                        <button type="submit" className="btn-primary">Save Changes</button>
                        <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
                    </div>
                </form>
                <p className="muted-text small-text">
                    For attendance and round progression, use the dedicated actions within the application table.
                </p>
            </div>
        </div>
    );
};

// Create Job Modal component
const CreateJobModal = ({ onClose, onJobCreated }) => {
    const [formData, setFormData] = useState({
        companyName: '',
        jobTitle: '',
        jobDescription: '',
        salary: '',
        status: 'private',
        eligibility: {
            minCgpa: 0,
            minTenthPercent: 0,
            minTwelfthPercent: 0,
            passoutYear: new Date().getFullYear() + 1,
            maxArrears: 0,
            allowedDepartments: []
        },
        rounds: []
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

    const getDefaultRound = (index) => ({
        roundName: '',
        sequence: index + 1,
        type: '',
        mode: 'offline',
        scheduledAt: '',
        venue: '',
        instructions: '',
        isAttendanceMandatory: true,
        autoAdvanceOnAttendance: false,
        autoRejectAbsent: true
    });

    const handleAddRound = () => {
        setFormData((prev) => ({
            ...prev,
            rounds: [...prev.rounds, getDefaultRound(prev.rounds.length)]
        }));
    };

    const handleRemoveRound = (index) => {
        setFormData((prev) => ({
            ...prev,
            rounds: prev.rounds.filter((_, idx) => idx !== index).map((round, idx) => ({
                ...round,
                sequence: idx + 1
            }))
        }));
    };

    const handleRoundChange = (index, field, value) => {
        setFormData((prev) => {
            const updated = [...prev.rounds];
            updated[index] = {
                ...updated[index],
                [field]: field === 'sequence' ? Number(value) : value
            };
            return { ...prev, rounds: updated };
        });
    };

    const handleRoundToggle = (index, field, checked) => {
        setFormData((prev) => {
            const updated = [...prev.rounds];
            updated[index] = {
                ...updated[index],
                [field]: checked
            };
            return { ...prev, rounds: updated };
        });
    };

    const handleDepartmentChange = (dept) => {
        setFormData({
            ...formData,
            eligibility: {
                ...formData.eligibility,
                allowedDepartments: formData.eligibility.allowedDepartments.includes(dept)
                    ? formData.eligibility.allowedDepartments.filter(d => d !== dept)
                    : [...formData.eligibility.allowedDepartments, dept]
            }
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
            onJobCreated(); // Refresh applications or notify parent
            setTimeout(() => onClose(), 2000); // Close after success
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to post job.');
        }
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-content job-modal">
                <h2>Post a New Job Opening</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="companyName">Company Name</label>
                        <input id="companyName" name="companyName" value={formData.companyName} onChange={handleChange} placeholder="e.g., Acme Corp" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="jobTitle">Job Title</label>
                        <input id="jobTitle" name="jobTitle" value={formData.jobTitle} onChange={handleChange} placeholder="e.g., Software Engineer" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="salary">Salary / CTC</label>
                        <input id="salary" name="salary" value={formData.salary} onChange={handleChange} placeholder="e.g., 6 LPA" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="status">Visibility</label>
                        <select id="status" name="status" value={formData.status} onChange={handleChange}>
                            <option value="private">Private (Draft)</option>
                            <option value="public">Public (Published)</option>
                        </select>
                    </div>
                    <div className="form-group full-width">
                        <label htmlFor="jobDescription">Job Description</label>
                        <textarea id="jobDescription" name="jobDescription" value={formData.jobDescription} onChange={handleChange} placeholder="Describe responsibilities, requirements, and any additional info" rows="5" required />
                    </div>

                    <fieldset className="full-width">
                        <legend>Eligibility Criteria</legend>
                        <div className="form-group">
                            <label htmlFor="minCgpa">Minimum CGPA</label>
                            <input id="minCgpa" type="number" step="0.01" name="minCgpa" value={formData.eligibility.minCgpa} onChange={handleEligibilityChange} placeholder="e.g., 7.0" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="minTenthPercent">Minimum 10th %</label>
                            <input id="minTenthPercent" type="number" name="minTenthPercent" value={formData.eligibility.minTenthPercent} onChange={handleEligibilityChange} placeholder="e.g., 75" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="minTwelfthPercent">Minimum 12th %</label>
                            <input id="minTwelfthPercent" type="number" name="minTwelfthPercent" value={formData.eligibility.minTwelfthPercent} onChange={handleEligibilityChange} placeholder="e.g., 75" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="passoutYear">Passout Year</label>
                            <input id="passoutYear" type="number" name="passoutYear" value={formData.eligibility.passoutYear} onChange={handleEligibilityChange} placeholder="e.g., 2026" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="maxArrears">Max Current Arrears</label>
                            <input id="maxArrears" type="number" name="maxArrears" value={formData.eligibility.maxArrears} onChange={handleEligibilityChange} placeholder="e.g., 0" />
                        </div>
                        <div className="form-group full-width">
                            <label>Allowed Departments (leave empty for all)</label>
                            <div className="department-checkboxes">
                                {['CSE', 'IT', 'AIDS', 'AIML', 'ECE', 'EEE', 'Mechanical', 'Mechatronics', 'Civil', 'CHEM'].map(dept => (
                                    <label key={dept} className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={formData.eligibility.allowedDepartments.includes(dept)}
                                            onChange={() => handleDepartmentChange(dept)}
                                        />
                                        {dept}
                                    </label>
                                ))}
                            </div>
                        </div>
                    </fieldset>

                    <div className="modal-actions">
                        <button type="submit" className="btn-primary">Post Job</button>
                        <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
                    </div>
                    {success && <p style={{ color: 'green' }}>{success}</p>}
                    {error && <p className="error-message">{error}</p>}
                </form>
            </div>
        </div>
    );
};

// Job Edit Modal component
const JobEditModal = ({ job, onClose, onUpdate }) => {
    const initialRounds = (job.rounds || []).map((round, idx) => ({
        _id: round._id,
        roundName: round.roundName || '',
        sequence: round.sequence ?? idx + 1,
        type: round.type || '',
        mode: round.mode || 'offline',
        scheduledAt: round.scheduledAt ? new Date(round.scheduledAt).toISOString().slice(0, 16) : '',
        venue: round.venue || '',
        instructions: round.instructions || '',
        isAttendanceMandatory: round.isAttendanceMandatory ?? true,
        autoAdvanceOnAttendance: round.autoAdvanceOnAttendance ?? false,
        autoRejectAbsent: round.autoRejectAbsent ?? true
    }));

    const [formData, setFormData] = useState({
        companyName: job.companyName || '',
        jobTitle: job.jobTitle || '',
        jobDescription: job.jobDescription || '',
        status: job.status || 'private',
        eligibility: {
            minCgpa: job.eligibility?.minCgpa || 0,
            minTenthPercent: job.eligibility?.minTenthPercent || 0,
            minTwelfthPercent: job.eligibility?.minTwelfthPercent || 0,
            passoutYear: job.eligibility?.passoutYear || new Date().getFullYear() + 1,
            maxArrears: job.eligibility?.maxArrears || 0,
            allowedDepartments: job.eligibility?.allowedDepartments || []
        },
        rounds: initialRounds
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

    const handleAddRound = () => {
        setFormData((prev) => ({
            ...prev,
            rounds: [
                ...prev.rounds,
                {
                    roundName: '',
                    sequence: prev.rounds.length + 1,
                    type: '',
                    mode: 'offline',
                    scheduledAt: '',
                    venue: '',
                    instructions: '',
                    isAttendanceMandatory: true,
                    autoAdvanceOnAttendance: false,
                    autoRejectAbsent: true
                }
            ]
        }));
    };

    const handleRemoveRound = (index) => {
        setFormData((prev) => ({
            ...prev,
            rounds: prev.rounds.filter((_, idx) => idx !== index).map((round, idx) => ({
                ...round,
                sequence: idx + 1
            }))
        }));
    };

    const handleRoundChange = (index, field, value) => {
        setFormData((prev) => {
            const updated = [...prev.rounds];
            updated[index] = {
                ...updated[index],
                [field]: field === 'sequence' ? Number(value) : value
            };
            return { ...prev, rounds: updated };
        });
    };

    const handleRoundToggle = (index, field, checked) => {
        setFormData((prev) => {
            const updated = [...prev.rounds];
            updated[index] = {
                ...updated[index],
                [field]: checked
            };
            return { ...prev, rounds: updated };
        });
    };

    const handleDepartmentChange = (dept) => {
        setFormData({
            ...formData,
            eligibility: {
                ...formData.eligibility,
                allowedDepartments: formData.eligibility.allowedDepartments.includes(dept)
                    ? formData.eligibility.allowedDepartments.filter(d => d !== dept)
                    : [...formData.eligibility.allowedDepartments, dept]
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            const token = localStorage.getItem('authToken');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.put(`http://localhost:3002/api/jobs/${job._id}`, formData, config);
            setSuccess('Job updated successfully!');
            onUpdate(job._id, formData);
            setTimeout(() => onClose(), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update job.');
        }
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-content job-modal">
                <h2>Edit Job Posting</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="companyName">Company Name</label>
                        <input id="companyName" name="companyName" value={formData.companyName} onChange={handleChange} placeholder="e.g., Acme Corp" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="jobTitle">Job Title</label>
                        <input id="jobTitle" name="jobTitle" value={formData.jobTitle} onChange={handleChange} placeholder="e.g., Software Engineer" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="salary">Salary / CTC</label>
                        <input id="salary" name="salary" value={formData.salary || ''} onChange={handleChange} placeholder="e.g., 6 LPA" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="status">Job Status</label>
                        <select name="status" value={formData.status} onChange={handleChange}>
                            <option value="private">Private</option>
                            <option value="public">Public</option>
                        </select>
                    </div>
                    <div className="form-group full-width">
                        <label htmlFor="jobDescription">Job Description</label>
                        <textarea id="jobDescription" name="jobDescription" value={formData.jobDescription} onChange={handleChange} placeholder="Describe responsibilities, requirements, and any additional info" rows="5" required />
                    </div>

                    <fieldset className="full-width">
                        <legend>Eligibility Criteria</legend>
                        <div className="form-group">
                            <label htmlFor="minCgpa">Minimum CGPA</label>
                            <input id="minCgpa" type="number" step="0.01" name="minCgpa" value={formData.eligibility.minCgpa} onChange={handleEligibilityChange} placeholder="e.g., 7.0" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="minTenthPercent">Minimum 10th %</label>
                            <input id="minTenthPercent" type="number" name="minTenthPercent" value={formData.eligibility.minTenthPercent} onChange={handleEligibilityChange} placeholder="e.g., 75" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="minTwelfthPercent">Minimum 12th %</label>
                            <input id="minTwelfthPercent" type="number" name="minTwelfthPercent" value={formData.eligibility.minTwelfthPercent} onChange={handleEligibilityChange} placeholder="e.g., 75" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="passoutYear">Passout Year</label>
                            <input id="passoutYear" type="number" name="passoutYear" value={formData.eligibility.passoutYear} onChange={handleEligibilityChange} placeholder="e.g., 2026" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="maxArrears">Max Current Arrears</label>
                            <input id="maxArrears" type="number" name="maxArrears" value={formData.eligibility.maxArrears} onChange={handleEligibilityChange} placeholder="e.g., 0" />
                        </div>
                        <div className="form-group full-width">
                            <label>Allowed Departments (leave empty for all)</label>
                            <div className="department-checkboxes">
                                {['CSE', 'IT', 'AIDS', 'AIML', 'ECE', 'EEE', 'Mechanical', 'Mechatronics', 'Civil', 'CHEM'].map(dept => (
                                    <label key={dept} className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={formData.eligibility.allowedDepartments.includes(dept)}
                                            onChange={() => handleDepartmentChange(dept)}
                                        />
                                        {dept}
                                    </label>
                                ))}
                            </div>
                        </div>
                    </fieldset>

                    <div className="modal-actions">
                        <button type="submit" className="btn-primary">Update Job</button>
                        <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
                    </div>
                    {success && <p style={{ color: 'green' }}>{success}</p>}
                    {error && <p className="error-message">{error}</p>}
                    <div className="rounds-editor">
                        <div className="rounds-header">
                            <h3>Rounds</h3>
                            <button type="button" className="btn-secondary" onClick={handleAddRound}>Add Round</button>
                        </div>
                        {formData.rounds.length === 0 && <p className="no-rounds">No rounds added yet.</p>}
                        {formData.rounds.map((round, index) => (
                            <div key={round._id || index} className="round-card">
                                <div className="round-card-header">
                                    <h4>Round {index + 1}</h4>
                                    <button type="button" onClick={() => handleRemoveRound(index)} className="btn-link">Remove</button>
                                </div>
                                <div className="round-grid">
                                    <label>
                                        Sequence
                                        <input type="number" min="1" value={round.sequence} onChange={(e) => handleRoundChange(index, 'sequence', e.target.value)} />
                                    </label>
                                    <label>
                                        Name
                                        <input type="text" value={round.roundName} onChange={(e) => handleRoundChange(index, 'roundName', e.target.value)} placeholder="e.g., Technical Interview" />
                                    </label>
                                    <label>
                                        Type
                                        <input type="text" value={round.type} onChange={(e) => handleRoundChange(index, 'type', e.target.value)} placeholder="e.g., technical" />
                                    </label>
                                    <label>
                                        Mode
                                        <select value={round.mode} onChange={(e) => handleRoundChange(index, 'mode', e.target.value)}>
                                            <option value="online">Online</option>
                                            <option value="offline">Offline</option>
                                            <option value="hybrid">Hybrid</option>
                                        </select>
                                    </label>
                                    <label>
                                        Scheduled At
                                        <input type="datetime-local" value={round.scheduledAt} onChange={(e) => handleRoundChange(index, 'scheduledAt', e.target.value)} />
                                    </label>
                                    <label>
                                        Venue
                                        <input type="text" value={round.venue} onChange={(e) => handleRoundChange(index, 'venue', e.target.value)} placeholder="e.g., Lab 1" />
                                    </label>
                                    <label className="full-width">
                                        Instructions
                                        <textarea value={round.instructions} onChange={(e) => handleRoundChange(index, 'instructions', e.target.value)} rows="2" placeholder="Any special instructions" />
                                    </label>
                                    <label className="checkbox-inline">
                                        <input type="checkbox" checked={round.isAttendanceMandatory} onChange={(e) => handleRoundToggle(index, 'isAttendanceMandatory', e.target.checked)} />
                                        Attendance Mandatory
                                    </label>
                                    <label className="checkbox-inline">
                                        <input type="checkbox" checked={round.autoRejectAbsent} onChange={(e) => handleRoundToggle(index, 'autoRejectAbsent', e.target.checked)} />
                                        Auto Reject Absent
                                    </label>
                                    <label className="checkbox-inline">
                                        <input type="checkbox" checked={round.autoAdvanceOnAttendance} onChange={(e) => handleRoundToggle(index, 'autoAdvanceOnAttendance', e.target.checked)} />
                                        Auto-Select Attendees
                                    </label>
                                </div>
                            </div>
                        ))}
                    </div>
                </form>
            </div>
        </div>
    );
};

// Eligible Students Modal component
const EligibleStudentsModal = ({ students, onClose, onRemoveStudent }) => {
    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <h2>Eligible Students</h2>
                {students.length === 0 ? (
                    <p>No eligible students found for this job.</p>
                ) : (
                    <div className="eligible-students-list">
                        <table className="students-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Department</th>
                                    <th>CGPA</th>
                                    <th>Arrears</th>
                                    <th>Remove</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((student) => (
                                    <tr key={student._id}>
                                        <td>{student.fullName}</td>
                                        <td>{student.collegeEmail}</td>
                                        <td>{student.dept}</td>
                                        <td>{student.ugCgpa}</td>
                                        <td>{student.currentArrears}</td>
                                        <td>
                                            <button
                                                type="button"
                                                className="action-btn remove-btn"
                                                onClick={() => onRemoveStudent?.(student._id)}
                                            >
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                <div className="modal-actions">
                    <button type="button" onClick={onClose} className="btn-secondary">Close</button>
                </div>
            </div>
        </div>
    );
};


const ManageApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedApp, setSelectedApp] = useState(null); // To track which app to update
    const [filteredApplications, setFilteredApplications] = useState([]); // This is the list to display
    const [searchTerm, setSearchTerm] = useState(''); // This will hold the search input
    const [showCreateJobModal, setShowCreateJobModal] = useState(false); // To show/hide create job modal
    const [jobs, setJobs] = useState([]); // To store jobs data
    const [selectedJob, setSelectedJob] = useState(null); // To track which job to edit
    const [showJobEditModal, setShowJobEditModal] = useState(false); // To show/hide job edit modal
    const [eligibleStudents, setEligibleStudents] = useState([]); // To store eligible students for a job
    const [showEligibleStudentsModal, setShowEligibleStudentsModal] = useState(false); // To show/hide eligible students modal

    const token = localStorage.getItem('authToken');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    
    // useEffect to fetch REAL data from the new endpoint
    useEffect(() => {
        const fetchAllApplications = async () => {
            try {
                const { data } = await axios.get('http://localhost:3002/api/applications', config);
                setApplications(data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch applications.');
            } finally {
                setLoading(false);
            }
        };
        fetchAllApplications();
    }, []);
    useEffect(() => {
        // A safer filtering logic
        const results = applications.filter(app => {
            const term = searchTerm.toLowerCase();
            
            // Check each field for existence before trying to search it
            const studentMatch = app.student?.fullName && app.student.fullName.toLowerCase().includes(term);
            const companyMatch = app.companyName && app.companyName.toLowerCase().includes(term);
            const jobMatch = app.jobTitle && app.jobTitle.toLowerCase().includes(term);
    
            return studentMatch || companyMatch || jobMatch;
        });
        setFilteredApplications(results);
    }, [searchTerm, applications]);

    // Fetch jobs data
    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const { data } = await axios.get('http://localhost:3002/api/jobs', config);
                // Combine private and public jobs from new API structure
                const allJobs = [
                    ...(data.private || []),
                    ...(data.public || [])
                ];
                setJobs(allJobs);
            } catch (err) {
                console.error('Failed to fetch jobs:', err);
            }
        };
        fetchJobs();
    }, []);

    const handleUpdate = async (appId, updatedData) => {
        try {
            const { data: newApp } = await axios.put(`http://localhost:3002/api/applications/${appId}`, updatedData, config);
            // Update the application in the local state
            setApplications(applications.map(app => (app._id === appId ? newApp : app)));
            setSelectedApp(null); // Close the modal
        } catch (err) {
            setError("Update failed. Please try again.");
        }
    };

    const handleJobCreated = () => {
        // Refresh applications or perform any necessary updates
        // For now, we'll just close the modal
        setShowCreateJobModal(false);
        // Refresh jobs list
        const fetchJobs = async () => {
            try {
                const { data } = await axios.get('http://localhost:3002/api/jobs', config);
                const allJobs = [
                    ...(data.private || []),
                    ...(data.public || [])
                ];
                setJobs(allJobs);
            } catch (err) {
                console.error('Failed to fetch jobs:', err);
            }
        };
        fetchJobs();
    };

    const handleEditJob = (job) => {
        setSelectedJob(job);
        setShowJobEditModal(true);
    };

    const handlePublishJob = async (jobId) => {
        try {
            const { data } = await axios.post(`http://localhost:3002/api/jobs/${jobId}/publish`, {}, config);
            setJobs((prev) => prev.map((job) => (job._id === jobId ? data : job)));
        } catch (err) {
            console.error('Failed to publish job:', err);
            setError(err.response?.data?.message || 'Failed to publish job.');
        }
    };

    const handleUpdateEligibleStudents = async (jobId, payload) => {
        try {
            const { data } = await axios.put(`http://localhost:3002/api/jobs/${jobId}/eligible-students`, payload, config);
            setJobs((prev) => prev.map((job) => (job._id === jobId ? { ...job, eligibleStudents: data } : job)));
        } catch (err) {
            console.error('Failed to update eligible students:', err);
            setError(err.response?.data?.message || 'Failed to update eligible students.');
        }
    };

    const handleRemoveStudent = (jobId, studentId) => {
        handleUpdateEligibleStudents(jobId, { remove: [studentId] });
    };

    const handleViewEligibleStudents = async (job) => {
        try {
            const { data } = await axios.get(`http://localhost:3002/api/jobs/${job._id}/eligible-students`, config);
            setEligibleStudents(data);
            setShowEligibleStudentsModal(true);
            setSelectedJob(job);
        } catch (err) {
            console.error('Failed to fetch eligible students:', err);
        }
    };

    const handleUpdateJob = async (jobId, updatedData) => {
        try {
            await axios.put(`http://localhost:3002/api/jobs/${jobId}`, updatedData, config);
            setSelectedJob(null);
            setShowJobEditModal(false);
            // Refresh jobs list
            const fetchJobs = async () => {
                try {
                    const { data } = await axios.get('http://localhost:3002/api/jobs', config);
                    const allJobs = [
                        ...(data.open || []),
                        ...(data.in_progress || []),
                        ...(data.closed || [])
                    ];
                    setJobs(allJobs);
                } catch (err) {
                    console.error('Failed to fetch jobs:', err);
                }
            };
            fetchJobs();
        } catch (err) {
            console.error('Failed to update job:', err);
        }
    };
    
    // This is just placeholder data until you create the backend route to fetch all applications
    const placeholderData = [{ _id: '1', jobTitle: 'Software Engineer', companyName: 'Google', status: 'Applied', student: { fullName: 'Vinit Gupta' } }];


    if (loading) return <p>Loading applications...</p>;

    return (
        <div className="students-container">
           <div className="students-header">
                <button className="btn-primary create-job-btn" onClick={() => setShowCreateJobModal(true)}>Create Job</button>
                <h2>Manage All Applications</h2>
                {/* The search bar input field */}
                <input
                    type="text"
                    placeholder="Search by Student, Company, or Role..."
                    className="search-bar"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            
            {error && <p className="error-message">{error}</p>}
            
            <table className="students-table">
                <thead>
                    <tr>
                        <th>Student Name</th>
                        <th>Company</th>
                        <th>Job Title</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {/* 3. Map over the filteredApplications list */}
                    {filteredApplications.map((app) => (
                        <tr key={app._id}>
                            <td>{app.student?.fullName || 'N/A'}</td>
                            <td>{app.companyName}</td>
                            <td>{app.jobTitle}</td>
                            <td>{app.status}</td>
                            <td>
                                <button className="update-btn" onClick={() => setSelectedApp(app)}>Update</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Jobs Section */}
            <div className="jobs-section">
                <h2>Job Postings</h2>
                {jobs.length === 0 ? (
                    <p>No jobs created yet. Click "Create Job" to add your first job posting.</p>
                ) : (
                    <table className="students-table">
                        <thead>
                            <tr>
                                <th>Company</th>
                                <th>Job Title</th>
                                <th>Status</th>
                                <th>Rounds</th>
                                <th>Eligible Students</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {jobs.map((job) => (
                                <tr key={job._id}>
                                    <td>{job.companyName}</td>
                                    <td>{job.jobTitle}</td>
                                    <td>
                                        <span className={`status-badge status-${job.status.toLowerCase()}`}>
                                            {job.status.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td>
                                        {job.rounds && job.rounds.length > 0 ? (
                                            <ul className="rounds-list">
                                                {job.rounds.map((round) => (
                                                    <li key={round._id}>
                                                        <strong>{round.sequence ?? '-'}</strong>. {round.roundName || 'Unnamed round'}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <span className="no-rounds">No rounds configured</span>
                                        )}
                                    </td>
                                    <td>{job.eligibleStudents?.length || 0}</td>
                                    <td>
                                        <button 
                                            className="action-btn edit-btn" 
                                            onClick={() => handleEditJob(job)}
                                            title="Edit Job"
                                        >
                                            ✏️
                                        </button>
                                        <button 
                                            className="action-btn view-btn" 
                                            onClick={() => handleViewEligibleStudents(job)}
                                            title="View Eligible Students"
                                        >
                                            👁️
                                        </button>
                                        {job.status === 'private' && (
                                            <button
                                                className="action-btn publish-btn"
                                                onClick={() => handlePublishJob(job._id)}
                                                title="Publish Job"
                                            >
                                                🚀
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {selectedApp && (
                <UpdateModal 
                    application={selectedApp}
                    onClose={() => setSelectedApp(null)}
                    onUpdate={handleUpdate}
                />
            )}

            {showCreateJobModal && (
                <CreateJobModal
                    onClose={() => setShowCreateJobModal(false)}
                    onJobCreated={handleJobCreated}
                />
            )}

            {showJobEditModal && selectedJob && (
                <JobEditModal
                    job={selectedJob}
                    onClose={() => {
                        setShowJobEditModal(false);
                        setSelectedJob(null);
                    }}
                    onUpdate={handleUpdateJob}
                />
            )}

            {showEligibleStudentsModal && (
                <EligibleStudentsModal
                    students={eligibleStudents}
                    onClose={() => {
                        setShowEligibleStudentsModal(false);
                        setSelectedJob(null);
                    }}
                    onRemoveStudent={(studentId) => selectedJob && handleRemoveStudent(selectedJob._id, studentId)}
                />
            )}
        </div>
    );
};

export default ManageApplications;