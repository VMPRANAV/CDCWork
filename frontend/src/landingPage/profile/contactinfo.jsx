import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';

const normalizeData = (data) => ({ ...data, address: data.address || {} });

const ContactDetails = () => {
    const [formData, setFormData] = useState({ address: {} });
    const [initialData, setInitialData] = useState({ address: {} });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('authToken');
            const config = { headers: { Authorization: `Bearer ${token}`, role: "user" }};
            try {
                const { data } = await axios.get('http://localhost:3002/api/users/profile', config);
                const normalized = normalizeData(data);
                setFormData(normalized);
                setInitialData(normalized);
            } catch (error) { console.error("Failed to fetch profile", error); }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleNestedChange = (e, category) => {
        setFormData(prev => ({ ...prev, [category]: { ...prev[category], [e.target.name]: e.target.value } }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('authToken');
        const config = { headers: { Authorization: `Bearer ${token}`, role: "user" }};
        try {
            const { data } = await axios.put('http://localhost:3002/api/users/profile', formData, config);
            const normalized = normalizeData(data);
            setInitialData(normalized);
            setFormData(normalized);
            setIsEditing(false);
            alert("Contact details updated successfully!");
        } catch (error) {
            alert("Update failed!");
            console.error("Failed to update profile", error.response?.data || error);
        }
    };

    return (
        <div className="profile-card">
            <div className="card-header">
                <h3>Contact & Other Details</h3>
                {!isEditing && <button onClick={() => setIsEditing(true)} className="edit-button">Edit</button>}
            </div>
            {isEditing ? (
                <form onSubmit={handleSave} className="profile-form">
                    <fieldset>
                        <legend>Contact Info</legend>
                        <label htmlFor="mobileNumber">Mobile Number</label>
                        <input id="mobileNumber" type="tel" name="mobileNumber" value={formData.mobileNumber || ''} onChange={handleChange} placeholder="Mobile Number" />

                        <label htmlFor="personalEmail">Personal Email</label>
                        <input id="personalEmail" type="email" name="personalEmail" value={formData.personalEmail || ''} onChange={handleChange} placeholder="Personal Email" />

                        <label htmlFor="residence">Residence</label>
                        <select id="residence" name="residence" value={formData.residence || ''} onChange={handleChange}>
                            <option value="">Select Residence</option>
                            <option value="Hostel">Hostel</option>
                            <option value="Day Scholar">Day Scholar</option>
                        </select>
                    </fieldset>
                    <fieldset>
                        <legend>Address</legend>
                        <label htmlFor="address_city">City</label>
                        <input id="address_city" name="city" value={formData.address.city || ''} onChange={(e) => handleNestedChange(e, 'address')} placeholder="City" />

                        <label htmlFor="address_state">State</label>
                        <input id="address_state" name="state" value={formData.address.state || ''} onChange={(e) => handleNestedChange(e, 'address')} placeholder="State" />
                    </fieldset>
                    <fieldset>
                        <legend>Government IDs</legend>
                        <label htmlFor="panNumber">PAN Number</label>
                        <input id="panNumber" name="panNumber" value={formData.panNumber || ''} onChange={handleChange} placeholder="PAN Number" />

                        <label htmlFor="aadharNumber">Aadhar Number</label>
                        <input id="aadharNumber" name="aadharNumber" value={formData.aadharNumber || ''} onChange={handleChange} placeholder="Aadhar Number" />
                    </fieldset>
                    <div className="form-actions">
                        <button type="submit" className="save-button">Save Changes</button>
                        <button type="button" onClick={() => { setIsEditing(false); setFormData(initialData); }} className="cancel-button">Cancel</button>
                    </div>
                </form>
            ) : (
                <div className="info-grid">
                    <div><strong>Mobile:</strong><p>{initialData.mobileNumber || 'N/A'}</p></div>
                    <div><strong>Personal Email:</strong><p>{initialData.personalEmail || 'N/A'}</p></div>
                    <div><strong>Residence:</strong><p>{initialData.residence || 'N/A'}</p></div>
                    <div><strong>Location:</strong><p>{`${initialData.address?.city || 'N/A'}, ${initialData.address?.state || 'N/A'}`}</p></div>
                    <div><strong>PAN:</strong><p>{initialData.panNumber || 'N/A'}</p></div>
                    <div><strong>Aadhar:</strong><p>{initialData.aadharNumber || 'N/A'}</p></div>
                </div>
            )}
        </div>
    );
};

export default ContactDetails;