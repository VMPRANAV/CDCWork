// src/components/ViewPosts.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ViewPost.css';

const ViewPost = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                // This is a public route, so no token is needed
                const { data } = await axios.get('http://localhost:3002/api/posts');
                setPosts(data);
            } catch (err) {
                setError('Could not fetch posts. The server might be down.');
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    // Filter posts by title (case-insensitive)
    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <p>Loading posts...</p>;
    if (error) return <p className="error-message">{error}</p>;

    return (
        <div className="posts-list-container">
            <div className="posts-header">
                <h2>Latest Posts & Job Openings</h2>
            </div>
            
            {/* Search Bar */}
            <div className="search-container" style={{ marginBottom: '1.5rem' }}>
                <input
                    type="text"
                    className="form-input"
                    placeholder="Search posts by title..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    style={{
                        width: '100%',
                        maxWidth: '400px',
                        margin: '0 auto',
                        display: 'block',
                        padding: '12px',
                        border: '1px solid #ddd',
                        borderRadius: '6px',
                        fontSize: '16px'
                    }}
                />
            </div>

            <div className="posts-grid">
                {filteredPosts.length > 0 ? (
                    filteredPosts.map((post) => (
                        <div key={post._id} className="post-card">
                            <h3>{post.title}</h3>
                            <p className="post-description">{post.description}</p>
                            <p className="post-date">
                                Posted on: {new Date(post.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    ))
                ) : searchTerm ? (
                    <p>No posts found matching "{searchTerm}".</p>
                ) : (
                    <p>No posts available at the moment.</p>
                )}
            </div>
        </div>
    );
};

export default ViewPost;