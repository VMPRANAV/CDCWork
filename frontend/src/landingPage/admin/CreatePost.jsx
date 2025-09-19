// src/components/CreatePost.jsx

import React, { useState } from 'react';
import axios from 'axios';
import './Post.css'; // We'll create this new CSS file

const CreatePost = ({ onPostCreated }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const { title, description } = formData;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        // Get token from localStorage
        const token = localStorage.getItem('authToken');
        if (!token) {
            setError('You must be logged in as an admin to create a post.');
            setLoading(false);
            return;
        }

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
                role: "admin"
            },
        };

        try {
            await axios.post('http://localhost:3002/api/posts', formData, config);
            setSuccess('Post created successfully!');
            // Clear the form
            setFormData({ title: '', description: '' });
              if (onPostCreated) onPostCreated(); 
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create post. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container">
            <div className="form-header">
                <h2>Create New Post</h2>
            </div>
            <form onSubmit={handleSubmit}>
                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">{success}</p>}
                
                <div className="form-group">
                    <label htmlFor="title">Post Title</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        className="form-input"
                        value={title}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        className="form-textarea"
                        rows="6"
                        value={description}
                        onChange={handleChange}
                        required
                    ></textarea>
                </div>
                <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? 'Creating...' : 'Create Post'}
                </button>
            </form>
        </div>
    );
};

export default CreatePost;