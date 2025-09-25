import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDashboard.css';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedStudent, setSelectedStudent] = useState(null); // NEW: For selected student details
    const [detailsLoading, setDetailsLoading] = useState(false); // NEW: For loading state of details

    useEffect(() => {
        // Check admin privilege
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || user.role !== 'admin') {
            navigate('/');
            return;
        }
        const fetchStudents = async () => {
            try {
                const token = localStorage.getItem('authToken');
                if (!token) {
                    setError('No authentication token found. Please login.');
                    setLoading(false);
                    return;
                }
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                };
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

    
    const handleStudentClick = async (studentId) => {
        setDetailsLoading(true);
        setSelectedStudent(null);
        try {
            const token = localStorage.getItem('authToken');
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            };
            const { data } = await axios.get(`http://localhost:3002/api/users/${studentId}`, config);
            setSelectedStudent(data);
        } catch (err) {
            setSelectedStudent({ error: err.response?.data?.message || 'Failed to fetch student details.' });
        } finally {
            setDetailsLoading(false);
        }
    };

    // NEW: Close card
    const handleCloseCard = () => setSelectedStudent(null);

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
                                <td>
                                    <button
                                        className="student-name-btn"
                                        onClick={() => handleStudentClick(student._id)}
                                        style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}
                                    >
                                        {student.fullName}
                                    </button>
                                </td>
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

            {/* NEW: Student Details Card */}
            {selectedStudent && (
                <div className="student-details-card-overlay" onClick={handleCloseCard}>
                    <div className="student-details-card" onClick={e => e.stopPropagation()}>
                        <button className="close-btn" onClick={handleCloseCard}>×</button>
                        {detailsLoading ? (
                            <p>Loading details...</p>
                        ) : selectedStudent.error ? (
                            <p className="error-message">{selectedStudent.error}</p>
                        ) : (
                            <div>
                                <h3>{selectedStudent.fullName}</h3>
                                <p><strong>Email:</strong> {selectedStudent.collegeEmail}</p>
                                <p><strong>Department:</strong> {selectedStudent.dept}</p>
                                <p><strong>Passout Year:</strong> {selectedStudent.passoutYear}</p>
                                <p><strong>UG CGPA:</strong> {selectedStudent.ugCgpa}</p>
                                <p><strong>Current Arrears:</strong> {selectedStudent.currentArrears}</p>
                                <p><strong>History of Arrears:</strong> {selectedStudent.historyOfArrears}</p>
                                <p><strong>Roll No:</strong> {selectedStudent.rollNo}</p>
                                <p><strong>University Reg Number:</strong> {selectedStudent.universityRegNumber}</p>
                                <p><strong>Phone:</strong> {selectedStudent.phone}</p>
                                <p><strong>Residence:</strong> {selectedStudent.residence}</p>
                                <p><strong>Placement Status:</strong> {selectedStudent.isPlaced ? `Placed at ${selectedStudent.company} (${selectedStudent.package} LPA)` : 'Not Placed'}</p>
                                <p><strong>Coding Profiles:</strong></p>
                                <ul>
                                    {selectedStudent.codingProfiles && Object.entries(selectedStudent.codingProfiles).map(([platform, link]) =>
                                        link ? (
                                            <li key={platform}>
                                                <a href={link} target="_blank" rel="noopener noreferrer">
                                                    {platform.charAt(0).toUpperCase() + platform.slice(1)}
                                                </a>
                                            </li>
                                        ) : null
                                    )}
                                </ul>
                                {selectedStudent.resumeUrl && (
                                    <p>
                                        <strong>Resume:</strong> <a href={selectedStudent.resumeUrl} target="_blank" rel="noopener noreferrer">View</a>
                                    </p>
                                )}
                                {selectedStudent.photoUrl && (
                                    <div>
                                        <strong>Photo:</strong><br />
                                        <img src={selectedStudent.photoUrl} alt="Profile" style={{ maxWidth: '120px', borderRadius: '8px' }} />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;