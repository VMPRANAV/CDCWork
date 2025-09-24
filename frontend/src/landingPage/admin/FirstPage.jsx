import React from 'react';
import './FirstPage.css';

const FirstPage = () => {
    const departments = [
        'AIDS', 'BME', 'CHEM', 'CIVIL', 'CSE', 'AIML', 
        'Cyber Security', 'CSBS', 'ECE', 'EEE', 'IT', 
        'Mechanical', 'Mechatronics'
    ];

    // This function will be called when a card is clicked
    const handleCardClick = (departmentName) => {
        console.log(`Card clicked: ${departmentName}`);
        // We will add the logic to open the dialog box here
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
        </div>
    );
};

export default FirstPage;