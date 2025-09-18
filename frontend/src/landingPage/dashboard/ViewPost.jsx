// src/components/ViewPosts.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ViewPost.css';

const ViewPost = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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

    if (loading) return <p>Loading posts...</p>;
    if (error) return <p className="error-message">{error}</p>;

    return (
        <div className="posts-list-container">
            <div className="posts-header">
                <h2>Latest Posts & Job Openings</h2>
            </div>
            <div className="posts-grid">
                {posts.length > 0 ? (
                    posts.map((post) => (
                        <div key={post._id} className="post-card">
                            <h3>{post.title}</h3>
                            <p className="post-description">{post.description}</p>
                            <p className="post-date">
                                Posted on: {new Date(post.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    ))
                ) : (
                    <p>No posts available at the moment.</p>
                )}
            </div>
        </div>
    );
};

export default ViewPost;