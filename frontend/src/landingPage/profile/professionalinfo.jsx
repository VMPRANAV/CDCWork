import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';

const ProfessionalInfo = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [profData, setProfData] = useState({});
    const [initialData, setInitialData] = useState({});

    // ... (useEffect, handleChange, and handleSave functions are the same) ...
    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) return;
            try {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const { data } = await axios.get('http://localhost:3002/api/users/profile', config);
                setProfData(data);
                setInitialData(data);
            } catch (error) {
                console.error("Failed to fetch profile", error);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setProfData({ ...profData, [e.target.name]: e.target.value });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('authToken');
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.put('http://localhost:3002/api/users/profile', profData, config);
            setInitialData(data);
            setIsEditing(false);
            alert("Profile updated successfully!");
        } catch (error) {
            console.error("Failed to update profile", error);
        }
    };

    return (
        <div className="profile-card">
            <div className="card-header">
                <h3>Professional Information</h3>
                {!isEditing && <button onClick={() => setIsEditing(true)} className="edit-button">Edit</button>}
            </div>
            {isEditing ? (
                <form onSubmit={handleSave} className="profile-form">
                    {/* ... (The edit form is the same) ... */}
                    <div className="form-group">
                        <label>CGPA</label>
                        <input type="number" step="0.01" name="cgpa" value={profData.cgpa || ''} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Arrears</label>
                        <input type="number" name="arrears" value={profData.arrears ?? ''} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Skills (comma-separated)</label>
                        <input type="text" name="skills" value={Array.isArray(profData.skills) ? profData.skills.join(', ') : ''} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Coding Links (comma-separated)</label>
                        <input type="text" name="codingLinks" value={profData.codingLinks || ''} onChange={handleChange} />
                    </div>
                    <div className="form-actions">
                        <button type="submit" className="save-button">Save Changes</button>
                        <button type="button" onClick={() => { setIsEditing(false); setProfData(initialData); }} className="cancel-button">Cancel</button>
                    </div>
                </form>
            ) : (
                <div className="info-grid">
                    <div><strong>CGPA:</strong><p>{initialData.cgpa}</p></div>
                    <div><strong>Arrears:</strong><p>{initialData.arrears}</p></div>
                    <div className="full-width"><strong>Skills:</strong><p>{Array.isArray(initialData.skills) && initialData.skills.length > 0 ? initialData.skills.join(', ') : 'Not specified'}</p></div>
                    
                    {/* --- FIX: Added this block to display coding links --- */}
                    <div className="full-width">
                        <strong>Coding Profile Links:</strong>
                        <p>{initialData.codingLinks || 'Not specified'}</p>
                    </div>

                    <div className="full-width"><strong>Resume:</strong><p><a href={`http://localhost:3002/${initialData.resume}`} target="_blank" rel="noopener noreferrer">View Resume</a></p></div>
                </div>
            )}
        </div>
    );
};

export default ProfessionalInfo;