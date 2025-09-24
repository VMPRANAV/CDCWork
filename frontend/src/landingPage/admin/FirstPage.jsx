import React, { useState } from 'react';
import './FirstPage.css';
import axios from 'axios';


const FirstPage = () => {
    // A constant array of department names
    const departments = [
        'AIDS', 'BME', 'CHEM', 'CIVIL', 'CSE', 'AIML',
        'Cyber Security', 'CSBS', 'ECE', 'EEE', 'IT',
        'Mechanical', 'Mechatronics'
    ];

    // State management for the dialog box and its data
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedDept, setSelectedDept] = useState(null);
    // After
    const [stats, setStats] = useState({
        totalStudents: 0,
        placedStudents: 0,
        placedPercentage: 0,
        maxPackage: 0,
        avgPackage: 0,
        minPackage: 0,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // This function is called when a department card is clicked
    const handleCardClick = async (departmentName) => {
        setSelectedDept(departmentName);
        setIsDialogOpen(true);
        setIsLoading(true);
        setError(null); // Reset previous errors

        try {
            const token = localStorage.getItem('authToken');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const response = await axios.get(`/api/departments/${departmentName}/stats`, config);

            setStats(response.data);


        } catch (err) {
            setError('Failed to fetch department statistics. Please try again later.');
            console.error("API Error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    // Closes the dialog and resets the state
    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setSelectedDept(null);
        setStats({
            totalStudents: 0,
            placedStudents: 0,
            placedPercentage: 0,
            maxPackage: 0,
            avgPackage: 0,
            minPackage: 0,
        });
        setError(null);
    };

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">Department Placement Overview</h1>
            <div className="card-grid">
                {departments.map((dept) => (
                    <div
                        key={dept}
                        className="department-card"
                        onClick={() => handleCardClick(dept)}
                    >
                        <h2 className="card-title">{dept}</h2>
                    </div>
                ))}
            </div>

            {/* Render the Dialog Box conditionally */}
            {isDialogOpen && (
                <div className="dialog-overlay">
                    <div className="dialog-box">
                        <h2 className="dialog-title">{selectedDept} Statistics</h2>
                        <div className="dialog-content">
                            {isLoading ? (
                                <p className="loading-text">Loading...</p>
                            ) : error ? (
                                <p className="error-text">{error}</p>
                            ) : stats ? (
                                <div className="stats-grid">
                                    <div className="stat-item"><span>Total Students:</span> <strong>{stats?.totalStudents ?? 0}</strong></div>
                                    <div className="stat-item"><span>Placed Students:</span> <strong>{stats?.placedStudents ?? 0}</strong></div>
                                    <div className="stat-item">
                                        <span>Placement Rate:</span>
                                        <strong>{(stats?.placedPercentage ?? 0).toFixed(2)}%</strong>
                                    </div>
                                    <div className="stat-item">
                                        <span>Highest Package:</span>
                                        <strong>{stats?.maxPackage ?? 0} LPA</strong>
                                    </div>
                                    <div className="stat-item">
                                        <span>Average Package:</span>
                                        <strong>{(stats?.avgPackage ?? 0).toFixed(2)} LPA</strong>
                                    </div>
                                    <div className="stat-item">
                                        <span>Lowest Package:</span>
                                        <strong>{stats?.minPackage ?? 0} LPA</strong>
                                    </div>
                                </div>
                            ) : null}
                        </div>
                        <button onClick={handleCloseDialog} className="close-button">Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FirstPage;