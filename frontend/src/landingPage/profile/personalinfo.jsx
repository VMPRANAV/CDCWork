import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';

const PersonalDetails = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [initialData, setInitialData] = useState({});

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('authToken');
            const config = { headers: { Authorization: `Bearer ${token}`, role:"user" } };
            try {
                const { data } = await axios.get('http://localhost:3002/api/users/profile', config);
                setFormData(data);
                setInitialData(data);
            } catch (error) { console.error("Failed to fetch profile", error); }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSave = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('authToken');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        try {
            const { data } = await axios.put('http://localhost:3002/api/users/profile', formData, config);
            setInitialData(data);
            setFormData(data);
            setIsEditing(false);
            alert("Personal details updated successfully!");
        } catch (error) {
            alert("Update failed!");
            console.error("Failed to update profile", error.response.data);
        }
    };

    const formatDateForInput = (date) => date ? new Date(date).toISOString().split('T')[0] : '';

    return (
        <div className="profile-card">
            <div className="card-header">
                <h3>Personal Details</h3>
                {!isEditing && <button onClick={() => setIsEditing(true)} className="edit-button">Edit</button>}
            </div>

            {isEditing ? (
                <form onSubmit={handleSave} className="profile-form">
                    <label htmlFor="firstName">First Name</label>
                    <input id="firstName" name="firstName" value={formData.firstName || ''} onChange={handleChange} placeholder="First Name" />

                    <label htmlFor="middleName">Middle Name (Optional)</label>
                    <input id="middleName" name="middleName" value={formData.middleName || ''} onChange={handleChange} placeholder="Middle Name (Optional)" />

                    <label htmlFor="lastName">Last Name</label>
                    <input id="lastName" name="lastName" value={formData.lastName || ''} onChange={handleChange} placeholder="Last Name" />

                    <label htmlFor="dob">Date of Birth</label>
                    <input id="dob" type="date" name="dob" value={formatDateForInput(formData.dob)} onChange={handleChange} />

                    <label htmlFor="gender">Gender</label>
                    <select id="gender" name="gender" value={formData.gender || ''} onChange={handleChange}>
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>

                    <label htmlFor="nationality">Nationality</label>
                    <input id="nationality" name="nationality" value={formData.nationality || ''} onChange={handleChange} placeholder="Nationality" />

                    <div className="form-actions">
                        <button type="submit" className="save-button">Save Changes</button>
                        <button type="button" onClick={() => { setIsEditing(false); setFormData(initialData); }} className="cancel-button">Cancel</button>
                    </div>
                </form>
            ) : (
                <div className="info-grid">
                    <div><strong>Full Name:</strong><p>{initialData.fullName}</p></div>
                    <div><strong>Date of Birth:</strong><p>{initialData.dob ? new Date(initialData.dob).toLocaleDateString() : 'N/A'}</p></div>
                    <div><strong>Gender:</strong><p>{initialData.gender || 'N/A'}</p></div>
                    <div><strong>Nationality:</strong><p>{initialData.nationality || 'N/A'}</p></div>
                </div>
            )}
        </div>
    );
};

export default PersonalDetails;