import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDashboard.css';
import { useNavigate } from 'react-router-dom';

const StudentDetailsModal = ({ student, loading, onClose }) => {
    if (!student) {
        return null;
    }

    const placementStatus = student.isPlaced
        ? `Placed at ${student.company || 'N/A'}${student.package ? ` (${student.package} LPA)` : ''}`
        : 'Not Placed';

    const infoRows = [
        { label: 'Email', value: student.collegeEmail },
        { label: 'Department', value: student.dept },
        { label: 'Passout Year', value: student.passoutYear },
        { label: 'UG CGPA', value: student.ugCgpa },
        { label: 'Current Arrears', value: student.currentArrears },
        { label: 'History of Arrears', value: student.historyOfArrears },
        { label: 'Roll No', value: student.rollNo },
        { label: 'University Reg Number', value: student.universityRegNumber },
        { label: 'Phone', value: student.phone },
        { label: 'Residence', value: student.residence },
        { label: 'Placement Status', value: placementStatus }
    ].filter((row) => row.value !== undefined && row.value !== null && row.value !== '');

    const codingProfiles = student.codingProfiles || {};
    const hasProfiles = Object.values(codingProfiles).some(Boolean);

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div
                className="modal-content student-details-modal"
                onClick={(e) => e.stopPropagation()}
            >
                <button className="modal-close-btn" aria-label="Close" onClick={onClose}>
                    ×
                </button>
                {loading ? (
                    <p>Loading details...</p>
                ) : student.error ? (
                    <p className="error-message">{student.error}</p>
                ) : (
                    <>
                        <div className="student-details-header">
                            <h3>{student.fullName || 'Student Details'}</h3>
                        </div>
                        {infoRows.length > 0 && (
                            <div className="student-details-grid">
                                {infoRows.map(({ label, value }) => (
                                    <p key={label}>
                                        <strong>{label}:</strong> {value}
                                    </p>
                                ))}
                            </div>
                        )}
                        {hasProfiles && (
                            <div className="student-details-links">
                                <strong>Coding Profiles:</strong>
                                {Object.entries(codingProfiles)
                                    .filter(([, link]) => link)
                                    .map(([platform, link]) => (
                                        <a key={platform} href={link} target="_blank" rel="noopener noreferrer">
                                            {platform.charAt(0).toUpperCase() + platform.slice(1)}
                                        </a>
                                    ))}
                            </div>
                        )}
                        <div className="student-details-media">
                            {student.resumeUrl && (
                                <p>
                                    <strong>Resume:</strong>{' '}
                                    <a href={student.resumeUrl} target="_blank" rel="noopener noreferrer">
                                        View Resume
                                    </a>
                                </p>
                            )}
                            {student.photoUrl && (
                                <div>
                                    <strong>Photo:</strong>
                                    <br />
                                    <img src={student.photoUrl} alt={`${student.fullName || 'Student'} profile`} />
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

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
        setSelectedStudent({ _id: studentId });
        setDetailsLoading(true);
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

    const handleCloseModal = () => {
        setSelectedStudent(null);
        setDetailsLoading(false);
    };

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

            {selectedStudent && (
                <StudentDetailsModal
                    student={selectedStudent}
                    loading={detailsLoading}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
};

export default AdminDashboard;