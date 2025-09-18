import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './signup.css';

const SignupForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        middleName: '',
        lastName: '',
        collegeEmail: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (formData.password !== formData.confirmPassword) {
            return setError('Passwords do not match.');
        }

        try {
            const { firstName, middleName, lastName, collegeEmail, password } = formData;
            const response = await axios.post('http://localhost:3002/api/auth/register', {
                firstName, middleName, lastName, collegeEmail, password
            });
            
            // Log the user in immediately
            const { token, data } = response.data;
            localStorage.setItem('authToken', token);
            localStorage.setItem('user', JSON.stringify(data));

            // Redirect to the profile page for onboarding
            alert("Account created! Please complete your profile.");
            navigate('/student/profile'); 
            
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed.');
        }
    };

    return (
        <div className="signup-container">
            <form className="signup-form" onSubmit={handleSubmit}>
                <h2>Create Student Account</h2>
                {error && <p className="error-message">{error}</p>}

                <div className="form-grid">
                    <div className="input-group">
                        <label>First Name</label>
                        <input name="firstName" value={formData.firstName} onChange={handleChange} required />
                    </div>
                    <div className="input-group">
                        <label>Middle Name (Optional)</label>
                        <input name="middleName" value={formData.middleName} onChange={handleChange} />
                    </div>
                    <div className="input-group full-width">
                        <label>Last Name</label>
                        <input name="lastName" value={formData.lastName} onChange={handleChange} required />
                    </div>
                    <div className="input-group full-width">
                        <label>College Email</label>
                        <input type="email" name="collegeEmail" value={formData.collegeEmail} onChange={handleChange} required />
                    </div>
                    <div className="input-group">
                        <label>Password</label>
                        <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                    </div>
                    <div className="input-group">
                        <label>Confirm Password</label>
                        <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
                    </div>
                </div>
                <button type="submit" className="signup-button">Register</button>
                <div className="form-footer">
                    Already have an account? <Link to="/">Login</Link>
                </div>
            </form>
        </div>
    );
};

export default SignupForm;