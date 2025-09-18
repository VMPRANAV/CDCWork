import React, { useState } from 'react';
import PersonalDetails from './personalinfo';
import AcademicDetails from './academicinfo';
import ProfessionalDetails from './professionalinfo';
import ContactDetails from './contactinfo'; 
import './ProfilePage.css';

const ProfilePage = () => {
    const [activeTab, setActiveTab] = useState('personal');

    return (
        <div className="profile-page-container">
            <div className="tabs">
                <button className={`tab-button ${activeTab === 'personal' ? 'active' : ''}`} onClick={() => setActiveTab('personal')}>
                    Personal
                </button>
                <button className={`tab-button ${activeTab === 'academic' ? 'active' : ''}`} onClick={() => setActiveTab('academic')}>
                    Academic
                </button>
                <button className={`tab-button ${activeTab === 'professional' ? 'active' : ''}`} onClick={() => setActiveTab('professional')}>
                    Professional
                </button>
                <button className={`tab-button ${activeTab === 'contact' ? 'active' : ''}`} onClick={() => setActiveTab('contact')}>
                    Contact & Other
                </button>
            </div>

            <div className="tab-content">
                {activeTab === 'personal' && <PersonalDetails />}
                {activeTab === 'academic' && <AcademicDetails />}
                {activeTab === 'professional' && <ProfessionalDetails />}
                {activeTab === 'contact' && <ContactDetails />}
            </div>
        </div>
    );
};

export default ProfilePage;