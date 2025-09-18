import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './signup.css'; // Using the same styles
import collegeLogo from '../../assets/kprietLogo.png';

const LoginForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        collegeEmail: '',
        password: '',
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        // This function uses the 'name' from the input to update the state
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            // The formData here will now correctly have { collegeEmail: '...', password: '...' }
            const response = await axios.post(
                'http://localhost:3002/api/auth/login',
                formData
            );

            const { token, data } = response.data;

            localStorage.setItem('authToken', token);
            localStorage.setItem('user', JSON.stringify(data));

            if (data.role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/student/dashboard');
            }

        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="signup-container">
            <form className="signup-form" onSubmit={handleSubmit}>
                <div className="brand">
                    <img src={collegeLogo} alt="KPRIET Logo" className="brand-logo" />
                    <h2 className="brand-title">Placement Cell Login</h2>
                    <p className="brand-subtitle">KPR Institute of Engineering and Technology</p>
                </div>
                {error && <p className="error-message">{error}</p>}

                <div className="input-group full-width">
                    <label htmlFor="collegeEmail">College Email</label>
                    <input
                        type="email"
                        id="collegeEmail"
                        name="collegeEmail" // Correct name attribute
                        value={formData.collegeEmail}
                        onChange={handleChange}
                        placeholder="e.g., 23it066@kpriet.ac.in"
                        required
                    />
                </div>

                <div className="input-group full-width">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button type="submit" className="signup-button">Login</button>

                <div className="form-footer">
                    Don't have an account? <Link to="/signup">Register</Link>
                </div>
            </form>
        </div>
    );
};

export default LoginForm;