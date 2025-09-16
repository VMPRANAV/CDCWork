import React, { useState, useEffect } from 'react';
import axios from 'axios';
// We can reuse the CSS from the AllStudents page
import './AdminDashboard.css';

// This is a new component for the Modal
const UpdateModal = ({ application, onClose, onUpdate }) => {
    const [status, setStatus] = useState(application.status);
    const [notes, setNotes] = useState(application.notes || '');
    
    const handleSubmit = (e) => {
        e.preventDefault();
        onUpdate(application._id, { status, notes });
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <h2>Update Application</h2>
                <p><strong>{application.jobTitle}</strong> at <strong>{application.companyName}</strong></p>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Status</label>
                        <select value={status} onChange={(e) => setStatus(e.target.value)}>
                            <option value="Applied">Applied</option>
                            <option value="Online Assessment">Online Assessment</option>
                            <option value="Technical Interview">Technical Interview</option>
                            <option value="HR Interview">HR Interview</option>
                            <option value="Offer Received">Offer Received</option>
                            <option value="Rejected">Rejected</option>
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
    
    // This is just placeholder data until you create the backend route to fetch all applications
    const placeholderData = [{ _id: '1', jobTitle: 'Software Engineer', companyName: 'Google', status: 'Applied', student: { fullName: 'Vinit Gupta' } }];


    if (loading) return <p>Loading applications...</p>;

    return (
        <div className="students-container">
           <div className="students-header">
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

            {selectedApp && (
                <UpdateModal 
                    application={selectedApp}
                    onClose={() => setSelectedApp(null)}
                    onUpdate={handleUpdate}
                />
            )}
        </div>
    );
};

export default ManageApplications;