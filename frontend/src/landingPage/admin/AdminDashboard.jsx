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
            (student.fullName && student.fullName.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (student.collegeEmail && student.collegeEmail.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        setFilteredStudents(results);
    }, [searchTerm, students]);

    if (loading) return <p>Loading students...</p>;
    if (error) return <p className="error-message">{error}</p>;

    return (
        <div className="students-container">
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
                            <th>College Email</th>
                            <th>Dept</th>
                            <th>Passout Year</th>
                            <th>UG CGPA</th>
                            <th>Current Arrears</th>
                            <th>Coding Profiles</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStudents.map((student) => (
                            <tr key={student._id}>
                                <td>{student.fullName}</td>
                                <td>{student.collegeEmail}</td>
                                <td>{student.dept}</td>
                                <td>{student.passoutYear}</td>
                                <td>{student.ugCgpa}</td>
                                <td>{student.currentArrears}</td>
                                <td className="profile-links-cell">
                                    {student.codingProfiles && Object.values(student.codingProfiles).some(link => link) ? (
                                        Object.entries(student.codingProfiles)
                                            .filter(([, link]) => link)
                                            .map(([platform, link]) => (
                                                <a key={platform} href={link} target="_blank" rel="noopener noreferrer">
                                                    {platform.charAt(0).toUpperCase() + platform.slice(1)}
                                                </a>
                                            ))
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