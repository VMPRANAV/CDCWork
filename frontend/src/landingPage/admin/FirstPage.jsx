import React, { useState, useEffect, useMemo } from 'react';
import './FirstPage.css';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { FiPercent, FiPackage } from 'react-icons/fi';

// Register the Chart.js components you will use
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const FirstPage = () => {
    // State for the main dashboard data
    const [allStats, setAllStats] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // State for the dialog box
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedDeptStats, setSelectedDeptStats] = useState(null);

    // useEffect hook to fetch all data when the component first loads
    useEffect(() => {
        const fetchAllStats = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const response = await axios.get('/api/departments/all-stats', config);
                setAllStats(response.data);
            } catch (err) {
                setError('Failed to fetch dashboard data. Please try again.');
                console.error("API Error:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllStats();
    }, []); // The empty array ensures this runs only once on mount

    // --- Dialog Box Functions ---
    const handleCardClick = (departmentStats) => {
        setSelectedDeptStats(departmentStats); // Set the data for the clicked department
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
    };

    // --- Chart Data Preparation (depends on the selected department's data) ---
    const placementChartData = useMemo(() => {
        if (!selectedDeptStats) return {};
        const { totalStudents, placedStudents } = selectedDeptStats;
        const notPlaced = totalStudents - placedStudents;
        return {
            labels: ['Placed', 'Not Placed'],
            datasets: [{
                data: [placedStudents, notPlaced > 0 ? notPlaced : 0],
                backgroundColor: ['#007bff', '#e9ecef'],
                borderColor: ['#ffffff', '#ffffff'],
                borderWidth: 2,
            }],
        };
    }, [selectedDeptStats]);

    const packageChartData = useMemo(() => {
        if (!selectedDeptStats) return {};
        const { minPackage, avgPackage, maxPackage } = selectedDeptStats;
        return {
            labels: ['Lowest', 'Average', 'Highest'],
            datasets: [{
                label: 'Package (in LPA)',
                data: [minPackage, avgPackage, maxPackage],
                backgroundColor: 'rgba(0, 123, 255, 0.7)',
                borderColor: 'rgba(0, 123, 255, 1)',
                borderWidth: 1,
            }],
        };
    }, [selectedDeptStats]);

    // --- Render Logic ---
    if (isLoading) {
        return <div className="dashboard-container"><p className="loading-text">Loading Dashboard...</p></div>;
    }

    if (error) {
        return <div className="dashboard-container"><p className="error-text">{error}</p></div>;
    }

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">Department Placement Overview</h1>
            <div className="card-grid">
                {allStats.map((stat) => (
                    <div key={stat.department} className="department-card" onClick={() => handleCardClick(stat)}>
                        <div className="card-header">
                            <h2 className="card-title">{stat.department}</h2>
                        </div>
                        <div className="card-stats">
                            <div className="stat-item">
                                <FiPercent className="stat-icon" />
                                <span className="stat-value">{stat.placedPercentage.toFixed(2)}%</span>
                                <span className="stat-label">Placed</span>
                            </div>
                            <div className="stat-item">
                                <FiPackage className="stat-icon" />
                                <span className="stat-value">{stat.avgPackage.toFixed(2)} LPA</span>
                                <span className="stat-label">Avg. Package</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Render the Dialog Box conditionally */}
            {isDialogOpen && selectedDeptStats && (
                <div className="dialog-overlay" onClick={handleCloseDialog}>
                    <div className="dialog-box" onClick={(e) => e.stopPropagation()}>
                        <h2 className="dialog-title">{selectedDeptStats.department} Statistics</h2>
                        <div className="dialog-content">
                            <div className="stats-grid">
                                <div className="stat-item-dialog"><span>Total Students:</span> <strong>{selectedDeptStats.totalStudents}</strong></div>
                                <div className="stat-item-dialog"><span>Placed Students:</span> <strong>{selectedDeptStats.placedStudents}</strong></div>
                                <div className="stat-item-dialog"><span>Placement Rate:</span> <strong>{selectedDeptStats.placedPercentage.toFixed(2)}%</strong></div>
                                <div className="stat-item-dialog"><span>Highest Package:</span> <strong>{selectedDeptStats.maxPackage} LPA</strong></div>
                                <div className="stat-item-dialog"><span>Average Package:</span> <strong>{selectedDeptStats.avgPackage.toFixed(2)} LPA</strong></div>
                                <div className="stat-item-dialog"><span>Lowest Package:</span> <strong>{selectedDeptStats.minPackage} LPA</strong></div>
                            </div>
                            <div className="charts-container">
                                <div className="chart-wrapper">
                                    <h3>Placement Distribution</h3>
                                    <Doughnut data={placementChartData} />
                                </div>
                                <div className="chart-wrapper">
                                    <h3>Package Overview (LPA)</h3>
                                    <Bar data={packageChartData} options={{ indexAxis: 'y' }} />
                                </div>
                            </div>
                        </div>
                        <button onClick={handleCloseDialog} className="close-button">Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FirstPage;