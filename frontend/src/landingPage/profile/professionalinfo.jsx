import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';

const normalizeData = (data) => {
    const languages = data.languages || {};
    return {
        ...data,
        codingProfiles: data.codingProfiles || {},
        languages: {
            japanese: languages.japanese || {},
            german: languages.german || {},
        }
    };
};

const ProfessionalDetails = () => {
    const [formData, setFormData] = useState({ codingProfiles: {}, languages: { japanese: {}, german: {} } });
    const [initialData, setInitialData] = useState({ codingProfiles: {}, languages: { japanese: {}, german: {} } });
    const [isEditing, setIsEditing] = useState(false);
    const [uploading, setUploading] = useState({ resume: false, photo: false });

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

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleNestedChange = (e, category) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [category]: { ...prev[category], [name]: value } }));
    };

    const handleLanguageChange = (e, lang) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            languages: {
                ...prev.languages,
                [lang]: {
                    ...prev.languages[lang],
                    [name]: type === 'checkbox' ? checked : value
                }
            }
        }));
    };

    const handleFileUpload = async (file, type) => {
        if (!file) return;

        const token = localStorage.getItem('authToken');
        const formDataUpload = new FormData();
        formDataUpload.append(type === 'resume' ? 'resume' : 'photo', file);

        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
                role: "user",
                'Content-Type': 'multipart/form-data'
            }
        };

        setUploading(prev => ({ ...prev, [type]: true }));

        try {
            const endpoint = type === 'resume' ? 'upload-resume' : 'upload-photo';
            const response = await axios.post(`http://localhost:3002/api/users/${endpoint}`, formDataUpload, config);
            
            const urlField = type === 'resume' ? 'resumeUrl' : 'photoUrl';
            const newUrl = response.data[urlField];
            
            setFormData(prev => ({ ...prev, [urlField]: newUrl }));
            setInitialData(prev => ({ ...prev, [urlField]: newUrl }));
            
            alert(`${type === 'resume' ? 'Resume' : 'Photo'} uploaded successfully!`);
        } catch (error) {
            console.error(`${type} upload error:`, error);
            alert(`Failed to upload ${type}. Please try again.`);
        } finally {
            setUploading(prev => ({ ...prev, [type]: false }));
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('authToken');
        const config = { headers: { Authorization: `Bearer ${token}`, role: "user" } };
        try {
            const { data } = await axios.put('http://localhost:3002/api/users/profile', formData, config);
            const normalized = normalizeData(data);
            setInitialData(normalized);
            setFormData(normalized);
            setIsEditing(false);
            alert("Professional details updated successfully!");
        } catch (error) {
            alert("Update failed!");
            console.error("Failed to update profile", error.response?.data || error);
        }
    };

    return (
        <div className="profile-card">
            <div className="card-header">
                <h3>Professional Details</h3>
                {!isEditing && <button onClick={() => setIsEditing(true)} className="edit-button">Edit</button>}
            </div>
            {isEditing ? (
                <form onSubmit={handleSave} className="profile-form">
                    <fieldset className="full-width">
                        <legend>Coding Profiles</legend>
                        <label htmlFor="github">GitHub</label>
                        <input id="github" name="github" value={formData.codingProfiles.github || ''} onChange={(e) => handleNestedChange(e, 'codingProfiles')} placeholder="GitHub URL" />

                        <label htmlFor="leetcode">LeetCode</label>
                        <input id="leetcode" name="leetcode" value={formData.codingProfiles.leetcode || ''} onChange={(e) => handleNestedChange(e, 'codingProfiles')} placeholder="LeetCode URL" />

                        <label htmlFor="codeforces">Codeforces</label>
                        <input id="codeforces" name="codeforces" value={formData.codingProfiles.codeforces || ''} onChange={(e) => handleNestedChange(e, 'codingProfiles')} placeholder="Codeforces URL" />

                        <label htmlFor="hackerrank">HackerRank</label>
                        <input id="hackerrank" name="hackerrank" value={formData.codingProfiles.hackerrank || ''} onChange={(e) => handleNestedChange(e, 'codingProfiles')} placeholder="HackerRank URL" />

                        <label htmlFor="geeksforgeeks">GeeksforGeeks</label>
                        <input id="geeksforgeeks" name="geeksforgeeks" value={formData.codingProfiles.geeksforgeeks || ''} onChange={(e) => handleNestedChange(e, 'codingProfiles')} placeholder="GeeksforGeeks URL" />
                    </fieldset>

                    <fieldset className="full-width">
                        <legend>Language Skills</legend>
                        <label>
                            <input type="checkbox" name="knows" checked={!!formData.languages.japanese?.knows} onChange={(e) => handleLanguageChange(e, 'japanese')} />
                            Knows Japanese
                        </label>
                        <label htmlFor="japanese_level">Japanese Level</label>
                        <select id="japanese_level" name="level" value={formData.languages.japanese?.level || 'Not Applicable'} onChange={(e) => handleLanguageChange(e, 'japanese')} disabled={!formData.languages.japanese?.knows}>
                            <option value="N5">N5</option>
                            <option value="N4">N4</option>
                            <option value="N3">N3</option>
                            <option value="N2">N2</option>
                            <option value="N1">N1</option>
                            <option value="Not Applicable">Not Applicable</option>
                        </select>
                        <label>
                            <input type="checkbox" name="knows" checked={!!formData.languages.german?.knows} onChange={(e) => handleLanguageChange(e, 'german')} />
                            Knows German
                        </label>
                        <label htmlFor="german_level">German Level</label>
                        <select id="german_level" name="level" value={formData.languages.german?.level || 'Not Applicable'} onChange={(e) => handleLanguageChange(e, 'german')} disabled={!formData.languages.german?.knows}>
                            <option value="A1">A1</option>
                            <option value="A2">A2</option>
                            <option value="B1">B1</option>
                            <option value="B2">B2</option>
                            <option value="C1">C1</option>
                            <option value="C2">C2</option>
                            <option value="Not Appeared">Not Appeared</option>
                            <option value="Not Applicable">Not Applicable</option>
                        </select>
                    </fieldset>

                    <fieldset className="full-width">
                        <legend>Documents & Photo</legend>
                        
                        <label htmlFor="resumeFile">Upload Resume (PDF)</label>
                        <input 
                            id="resumeFile" 
                            type="file" 
                            accept=".pdf"
                            onChange={(e) => handleFileUpload(e.target.files[0], 'resume')}
                            disabled={uploading.resume}
                        />
                        {uploading.resume && <p>Uploading resume...</p>}
                        {formData.resumeUrl && (
                            <p>Current resume: <a href={formData.resumeUrl} target="_blank" rel="noopener noreferrer">View Resume</a></p>
                        )}

                        <label htmlFor="photoFile">Upload Profile Photo</label>
                        <input 
                            id="photoFile" 
                            type="file" 
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e.target.files[0], 'photo')}
                            disabled={uploading.photo}
                        />
                        {uploading.photo && <p>Uploading photo...</p>}
                        {formData.photoUrl && (
                            <div className="photo-preview">
                                <img
                                    src={formData.photoUrl}
                                    alt="Photo preview"
                                    style={{ marginTop: '8px', width: '120px', height: '120px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #ddd' }}
                                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                />
                            </div>
                        )}
                    </fieldset>

                    <div className="form-actions">
                        <button type="submit" className="save-button">Save Changes</button>
                        <button type="button" onClick={() => { setIsEditing(false); setFormData(initialData); }} className="cancel-button">Cancel</button>
                    </div>
                </form>
            ) : (
                <div className="info-grid">
                    <strong>Profile picture:</strong>
                        <p>
                            {initialData.photoUrl ? 
                                <a href={initialData.photoUrl} target="_blank" rel="noopener noreferrer">View Photo</a> 
                                : 'N/A'}
                        </p>
                    <div>
                        <strong>Resume:</strong>
                        <p>
                            {initialData.resumeUrl ? 
                                <a href={initialData.resumeUrl} target="_blank" rel="noopener noreferrer">View Resume</a> 
                                : 'N/A'}
                        </p>
                    </div>
                    <div><strong>GitHub:</strong><p>{initialData.codingProfiles?.github || 'N/A'}</p></div>
                    <div><strong>LeetCode:</strong><p>{initialData.codingProfiles?.leetcode || 'N/A'}</p></div>
                    <div><strong>Japanese:</strong><p>{initialData.languages?.japanese?.knows ? `Yes (${initialData.languages.japanese.level || 'N/A'})` : 'No'}</p></div>
                    <div><strong>German:</strong><p>{initialData.languages?.german?.knows ? `Yes (${initialData.languages.german.level || 'N/A'})` : 'No'}</p></div>
                    <div><strong>Placed:</strong><p>{initialData.isPlaced ? 'Yes' : 'No'}</p></div>
                    {initialData.isPlaced && (
                        <>
                            <div><strong>Company:</strong><p>{initialData.company || 'N/A'}</p></div>
                            <div><strong>Package:</strong><p>{initialData.package ? `${initialData.package} LPA` : 'N/A'}</p></div>
                            <div><strong>Placement Date:</strong><p>{initialData.placementDate ? new Date(initialData.placementDate).toLocaleDateString() : 'N/A'}</p></div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default ProfessionalDetails;