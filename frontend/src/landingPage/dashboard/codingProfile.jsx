import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './codingProfile.css';

const codingProfile = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            // --- DEBUG STEP 1: See the entire user object ---
            console.log('1. User object from localStorage:', storedUser);
            setUser(JSON.parse(storedUser));
        } else {
            navigate('/');
        }
    }, [navigate]);

    if (!user) {
        return <div>Loading...</div>;
    }

    // --- DEBUG STEP 2: See the raw string before we process it ---
    console.log('2. Raw codingLinks string:', user.codingLinks);
    
    const codingLinksArray = user.codingLinks 
    ? user.codingLinks.split(',').filter(link => link.trim() !== '') 
    : [];

    // --- DEBUG STEP 3: See the final array before it's displayed ---
    console.log('3. Final array after split and filter:', codingLinksArray);
    
    return (
        <div className="dashboard-container">
            <div className="dashboard-content">
                <div className="profile-section">
                    <h3>My Coding Profiles 🚀</h3>
                    {codingLinksArray.length > 0 ? (
                        <div className="links-container">
                            {codingLinksArray.map((link, index) => {
                                let platform = 'Link';
                                try {
                                    const url = new URL(link);
                                    platform = url.hostname.replace('www.', '').split('.')[0];
                                    platform = platform.charAt(0).toUpperCase() + platform.slice(1);
                                } catch (e) {
                                    // Ignore invalid URLs
                                }

                                return (
                                    <a 
                                        key={index} 
                                        href={link} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="profile-link-button"
                                    >
                                        View {platform} Profile
                                    </a>
                                );
                            })}
                        </div>
                    ) : (
                        <p>You haven't added any coding profile links yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default codingProfile;