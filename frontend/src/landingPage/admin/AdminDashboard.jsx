import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]); // This is what we'll display
    const [searchTerm, setSearchTerm] = useState(''); // For the search input
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        // Check admin privilege
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || user.role !== 'admin') {
            navigate('/'); // Redirect to login or home
            return;
        }

        const fetchStudents = async () => {
            try {
                // Get the token from localStorage
                const token = localStorage.getItem('authToken');
                if (!token) {
                    setError('No authentication token found. Please login.');
                    setLoading(false);
                    return;
                }

                // Set up the authorization header
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                };

                // Make the API call to our new endpoint
                const { data } = await axios.get('http://localhost:3002/api/users', config);
                setStudents(data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch students. You may not have admin privileges.');
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, [navigate]);

    useEffect(() => {
        const results = students.filter(student =>
            student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredStudents(results);
    }, [searchTerm, students]);

    if (loading) return <p>Loading students...</p>;
    if (error) return <p className="error-message">{error}</p>;

    return (
        <div className="students-container">
            {/* Add CreatePost form at the top */}
       

            <div className="students-header">
                <h2>All Student Details</h2>
                <input
                    type="text"
                    placeholder="Search by name or email..."
                    className="search-bar"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="table-wrapper">
                <table className="students-table">
                    <thead>
                        <tr>
                            <th>Full Name</th>
                            <th>Email</th>
                            <th>Department</th>
                            <th>Year</th>
                            <th>CGPA</th>
                            <th>Arrears</th>
                            <th>Coding Profiles</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStudents.map((student) => (
                            <tr key={student._id}>
                                <td>{student.fullName}</td>
                                <td>{student.email}</td>
                                <td>{student.department}</td>
                                <td>{student.year}</td>
                                <td>{student.cgpa}</td>
                                <td>{student.arrears}</td>
                                <td className="profile-links-cell">
                                    {student.codingLinks ? (
                                        student.codingLinks.split(',').filter(link => link.trim()).map((link, index) => {
                                            let platform = 'Link';
                                            try {
                                                let fullLink = link.trim();
                                                if (!fullLink.startsWith('http')) {
                                                    fullLink = `https://${fullLink}`;
                                                }
                                                const url = new URL(fullLink);
                                                platform = url.hostname.replace('www.', '').split('.')[0];
                                                platform = platform.charAt(0).toUpperCase() + platform.slice(1);
                                            } catch (e) { /* Ignore parsing errors */ }
                                            
                                            return (
                                                <a key={index} href={link.trim()} target="_blank" rel="noopener noreferrer">
                                                    {platform}
                                                </a>
                                            );
                                        })
                                    ) : (
                                        'N/A'
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminDashboard;