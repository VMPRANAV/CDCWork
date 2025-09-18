import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CreatePost from './CreatePost';
import './Post.css';
import { FaEdit, FaTrash } from "react-icons/fa";

const ManagePosts = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editId, setEditId] = useState(null);
    const [editData, setEditData] = useState({ title: '', description: '' });
    const [actionMsg, setActionMsg] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    // Fetch all posts
    const fetchPosts = async () => {
        setLoading(true);
        setError('');
        try {
            const { data } = await axios.get('http://localhost:3002/api/posts');
            setPosts(data);
        } catch (err) {
            setError('Failed to fetch posts.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    // Edit handlers
    const handleEditClick = (post) => {
        setEditId(post._id);
        setEditData({ title: post.title, description: post.description });
        setActionMsg('');
    };

    const handleEditChange = (e) => {
        setEditData({ ...editData, [e.target.name]: e.target.value });
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setActionMsg('');
        const token = localStorage.getItem('authToken');
        if (!token) {
            setActionMsg('You must be logged in as an admin.');
            return;
        }
        try {
            await axios.put(
                `http://localhost:3002/api/posts/${editId}`,
                editData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setActionMsg('Post updated successfully!');
            setEditId(null);
            fetchPosts();
        } catch (err) {
            setActionMsg(err.response?.data?.message || 'Failed to update post.');
        }
    };

    // Delete handler
    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this post?')) return;
        setActionMsg('');
        const token = localStorage.getItem('authToken');
        if (!token) {
            setActionMsg('You must be logged in as an admin.');
            return;
        }
        try {
            await axios.delete(
                `http://localhost:3002/api/posts/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setActionMsg('Post deleted successfully!');
            fetchPosts();
        } catch (err) {
            setActionMsg(err.response?.data?.message || 'Failed to delete post.');
        }
    };

    // Filter posts by title (case-insensitive)
    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <CreatePost onPostCreated={fetchPosts} />
            <div className="form-container" style={{ marginTop: '2rem' }}>
                <div className="form-header">
                    <h2>Manage Posts</h2>
                </div>
                {/* Search by Title */}
                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Search posts by title..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
                {/* All Posts */}
                {actionMsg && <p className={actionMsg.includes('success') ? 'success-message' : 'error-message'}>{actionMsg}</p>}
                {loading ? (
                    <p>Loading posts...</p>
                ) : error ? (
                    <p className="error-message">{error}</p>
                ) : (
                    <div className="posts-grid">
                        {filteredPosts.length === 0 ? (
                            <p>No posts found.</p>
                        ) : (
                            filteredPosts.map(post =>
                                editId === post._id ? (
                                    <form key={post._id} className="post-card" onSubmit={handleEditSubmit}>
                                        <input
                                            type="text"
                                            name="title"
                                            className="form-input"
                                            value={editData.title}
                                            onChange={handleEditChange}
                                            required
                                            style={{ marginBottom: '1rem' }}
                                        />
                                        <textarea
                                            name="description"
                                            className="form-textarea"
                                            rows="4"
                                            value={editData.description}
                                            onChange={handleEditChange}
                                            required
                                            style={{ marginBottom: '1rem' }}
                                        />
                                        <div style={{ display: 'flex', gap: '1rem' }}>
                                            <button type="submit" className="submit-btn" style={{ width: 'auto' }}>
                                                Save
                                            </button>
                                            <button
                                                type="button"
                                                className="submit-btn"
                                                style={{ background: '#ccc', color: '#333', width: 'auto' }}
                                                onClick={() => setEditId(null)}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <div key={post._id} className="post-card">
                                        <h3>{post.title}</h3>
                                        <p className="post-description">{post.description}</p>
                                        <p className="post-date">
                                            Posted on: {new Date(post.createdAt).toLocaleDateString()}
                                        </p>
                                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                            <button
                                                className="icon-btn"
                                                title="Edit"
                                                style={{
                                                    background: '#fff',
                                                    color: '#007aff',
                                                    border: '1.5px solid #007aff',
                                                    borderRadius: '6px',
                                                    padding: '8px 12px',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                                onClick={() => handleEditClick(post)}
                                            >
                                                <FaEdit color="#007aff" size={18} />
                                            </button>
                                            <button
                                                className="icon-btn"
                                                title="Delete"
                                                style={{
                                                    background: '#fff',
                                                    color: '#c53030',
                                                    border: '1.5px solid #c53030',
                                                    borderRadius: '6px',
                                                    padding: '8px 12px',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                                onClick={() => handleDelete(post._id)}
                                            >
                                                <FaTrash color="#c53030" size={18} />
                                            </button>
                                        </div>
                                    </div>
                                )
                            ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManagePosts;