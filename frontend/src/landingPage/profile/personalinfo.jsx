import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css'; 

const PersonalInfo = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [userData, setUserData] = useState({});
    const [initialData, setInitialData] = useState({});

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) return;

            try {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const { data } = await axios.get('http://localhost:3002/api/users/profile', config);
                setUserData(data);
                setInitialData(data); // Store initial data for cancel
            } catch (error) {
                console.error("Failed to fetch profile", error);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('authToken');
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.put('http://localhost:3002/api/users/profile', userData, config);
            setInitialData(data); // Update initial data to new saved data
            setIsEditing(false);
            alert("Profile updated successfully!");
        } catch (error) {
            console.error("Failed to update profile", error);
            alert("Update failed!");
        }
    };
    
    return (
        <div className="profile-card">
            <div className="card-header">
                <h3>Personal Information</h3>
                {!isEditing && <button onClick={() => setIsEditing(true)} className="edit-button">Edit</button>}
            </div>
            {isEditing ? (
                <form onSubmit={handleSave} className="profile-form">
                    <div className="form-group">
                        <label>Full Name</label>
                        <input type="text" name="fullName" value={userData.fullName || ''} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" name="email" value={userData.email || ''} onChange={handleChange} />
                    </div>
                    {/* Add Year and Department fields if you want them editable */}
                    <div className="form-actions">
                        <button type="submit" className="save-button">Save Changes</button>
                        <button type="button" onClick={() => { setIsEditing(false); setUserData(initialData); }} className="cancel-button">Cancel</button>
                    </div>
                </form>
            ) : (
                <div className="info-grid">
                    <div><strong>Full Name:</strong><p>{initialData.fullName}</p></div>
                    <div><strong>Email:</strong><p>{initialData.email}</p></div>
                    <div><strong>Year:</strong><p>{initialData.year} Year</p></div>
                    <div><strong>Department:</strong><p>{initialData.department}</p></div>
                </div>
            )}
        </div>
    );
};

export default PersonalInfo;