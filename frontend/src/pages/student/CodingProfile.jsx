import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CodingProfile.css'; 
import { 
    FaCode, 
    FaLaptopCode, 
    FaHackerrank, 
    FaBook, 
    FaGithub 
} from 'react-icons/fa';

const iconMap = {
    leetcode: <FaCode />,
    codeforces: <FaLaptopCode />,
    hackerrank: <FaHackerrank />,
    geeksforgeeks: <FaBook />,
    github: <FaGithub />,
};

const CodingProfile = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            navigate('/');
        }
    }, [navigate]);

    if (!user) {
        return <p>Loading profile...</p>;
    }

    const codingProfiles = user.codingProfiles || {};

    const validProfiles = Object.entries(codingProfiles)
        .filter(([platform, url]) => url && url.trim() !== '');

    return (
        // The component now only returns the inner white card
        <div className="profile-card">
            <div className="links-container">
                {validProfiles.length > 0 ? (
                    validProfiles.map(([platform, url]) => (
                        <a 
                            key={platform}
                            href={url.startsWith('http') ? url : `https://${url}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="profile-link"
                        >
                            <span className="platform-icon">
                                {iconMap[platform.toLowerCase()] || <FaCode />}
                            </span>
                            <span className="platform-name">
                                {platform.charAt(0).toUpperCase() + platform.slice(1)}
                            </span>
                        </a>
                    ))
                ) : (
                    <p>No coding profile links have been added yet.</p>
                )}
            </div>
        </div>
    );
};

export default CodingProfile;