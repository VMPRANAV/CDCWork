import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';

const normalizeData = (data) => ({
    ...data,
    education: {
        tenth: data.education?.tenth || {},
        twelfth: data.education?.twelfth || {},
        diploma: data.education?.diploma || {},
    }
});

const AcademicDetails = () => {
    const [formData, setFormData] = useState({ education: { tenth: {}, twelfth: {}, diploma: {} } });
    const [initialData, setInitialData] = useState({ education: { tenth: {}, twelfth: {}, diploma: {} } });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('authToken');
            const config = { headers: { Authorization: `Bearer ${token}` } };
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

    const handleNestedChange = (e, category, field) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [category]: { ...prev[category], [field]: { ...prev[category][field], [name]: value } } }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('authToken');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        try {
            const { data } = await axios.put('http://localhost:3002/api/users/profile', formData, config);
            const normalized = normalizeData(data);
            setInitialData(normalized);
            setFormData(normalized);
            setIsEditing(false);
            alert("Academic details updated successfully!");
        } catch (error) {
            alert("Update failed!");
            console.error("Failed to update profile", error.response?.data || error);
        }
    };

    return (
        <div className="profile-card">
            <div className="card-header">
                <h3>Academic Details</h3>
                {!isEditing && <button onClick={() => setIsEditing(true)} className="edit-button">Edit</button>}
            </div>
            {isEditing ? (
                <form onSubmit={handleSave} className="profile-form">
                    <label htmlFor="universityRegNumber">University Reg Number</label>
                    <input id="universityRegNumber" name="universityRegNumber" value={formData.universityRegNumber || ''} onChange={handleChange} placeholder="University Reg Number" />

                    <label htmlFor="rollNo">Roll Number</label>
                    <input id="rollNo" name="rollNo" value={formData.rollNo || ''} onChange={handleChange} placeholder="Roll Number" />

                    <label htmlFor="dept">Department</label>
                    <select id="dept" name="dept" value={formData.dept || ''} onChange={handleChange}>
                        <option value="">Select Department</option>
                        {['AIDS', 'BME', 'CHEM', 'CIVIL', 'CSE', 'AIML', 'Cyber Security', 'CSBS', 'ECE', 'EEE', 'IT', 'Mechanical', 'Mechatronics'].map(d => <option key={d} value={d}>{d}</option>)}
                    </select>

                    <label htmlFor="quota">Quota</label>
                    <select id="quota" name="quota" value={formData.quota || ''} onChange={handleChange}>
                        <option value="">Select Quota</option>
                        <option value="Management Quota(MQ)">Management Quota (MQ)</option>
                        <option value="Government Quota(GQ)">Government Quota (GQ)</option>
                    </select>

                    <label htmlFor="passoutYear">Passout Year</label>
                    <input id="passoutYear" type="number" name="passoutYear" value={formData.passoutYear || ''} onChange={handleChange} placeholder="Passout Year" />

                    <label htmlFor="ugCgpa">UG CGPA</label>
                    <input id="ugCgpa" type="number" step="0.01" name="ugCgpa" value={formData.ugCgpa ?? ''} onChange={handleChange} placeholder="UG CGPA" />

                    <label htmlFor="historyOfArrears">History of Arrears</label>
                    <input id="historyOfArrears" type="number" name="historyOfArrears" value={formData.historyOfArrears ?? 0} onChange={handleChange} placeholder="History of Arrears" />

                    <label htmlFor="currentArrears">Current Arrears</label>
                    <input id="currentArrears" type="number" name="currentArrears" value={formData.currentArrears ?? 0} onChange={handleChange} placeholder="Current Arrears" />

                    <fieldset className="full-width">
                        <legend>10th Grade</legend>
                        <label htmlFor="tenth_percentage">Percentage</label>
                        <input id="tenth_percentage" name="percentage" type="number" placeholder="Percentage" value={formData.education.tenth.percentage || ''} onChange={(e) => handleNestedChange(e, 'education', 'tenth')} />

                        <label htmlFor="tenth_board">Board</label>
                        <select id="tenth_board" name="board" value={formData.education.tenth.board || ''} onChange={(e) => handleNestedChange(e, 'education', 'tenth')}>
                            <option value="">Select Board</option>
                            {['State', 'CBSE', 'ICSC', 'NEB', 'others'].map(b => <option key={b} value={b}>{b}</option>)}
                        </select>
                        <label htmlFor="tenth_passingYear">Passing Year</label>
                        <input id="tenth_passingYear" name="passingYear" type="number" placeholder="Passing Year" value={formData.education.tenth.passingYear || ''} onChange={(e) => handleNestedChange(e, 'education', 'tenth')} />
                    </fieldset>

                    <fieldset className="full-width">
                        <legend>12th Grade</legend>
                        <label htmlFor="twelfth_percentage">Percentage</label>
                        <input id="twelfth_percentage" name="percentage" type="number" placeholder="Percentage" value={formData.education.twelfth.percentage || ''} onChange={(e) => handleNestedChange(e, 'education', 'twelfth')} />

                        <label htmlFor="twelfth_passingYear">Passing Year</label>
                        <input id="twelfth_passingYear" name="passingYear" type="number" placeholder="Passing Year" value={formData.education.twelfth.passingYear || ''} onChange={(e) => handleNestedChange(e, 'education', 'twelfth')} />
                    </fieldset>

                    <fieldset className="full-width">
                        <legend>Diploma</legend>
                        <label htmlFor="diploma_percentage">Percentage</label>
                        <input id="diploma_percentage" name="percentage" type="number" placeholder="Percentage" value={formData.education.diploma.percentage || ''} onChange={(e) => handleNestedChange(e, 'education', 'diploma')} />

                        <label htmlFor="diploma_passingYear">Passing Year</label>
                        <input id="diploma_passingYear" name="passingYear" type="number" placeholder="Passing Year" value={formData.education.diploma.passingYear || ''} onChange={(e) => handleNestedChange(e, 'education', 'diploma')} />
                    </fieldset>

                    <div className="form-actions">
                        <button type="submit" className="save-button">Save Changes</button>
                        <button type="button" onClick={() => { setIsEditing(false); setFormData(initialData); }} className="cancel-button">Cancel</button>
                    </div>
                </form>
            ) : (
                <div className="info-grid">
                    <div><strong>University Reg No:</strong><p>{initialData.universityRegNumber || 'N/A'}</p></div>
                    <div><strong>Roll No:</strong><p>{initialData.rollNo || 'N/A'}</p></div>
                    <div><strong>Department:</strong><p>{initialData.dept || 'N/A'}</p></div>
                    <div><strong>Quota:</strong><p>{initialData.quota || 'N/A'}</p></div>
                    <div><strong>Passout Year:</strong><p>{initialData.passoutYear || 'N/A'}</p></div>
                    <div><strong>UG CGPA:</strong><p>{initialData.ugCgpa || 'N/A'}</p></div>
                    <div className="full-width"><strong>10th Grade:</strong><p>{initialData.education?.tenth?.percentage ? `${initialData.education.tenth.percentage}% (${initialData.education.tenth.board})` : 'N/A'}</p></div>
                    <div className="full-width"><strong>12th Grade:</strong><p>{initialData.education?.twelfth?.percentage ? `${initialData.education.twelfth.percentage}%` : 'N/A'}</p></div>
                </div>
            )}
        </div>
    );
};

export default AcademicDetails;