import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './signup.css'; 
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios

const SignupForm = () => {
  const navigate = useNavigate(); 
  // ... (all your existing useState hooks are perfect) ...
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    year: '',
    department: '',
    resume: null,
    codingLinks: '',
    skills: '',
    cgpa: '',
    arrears: 0,
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(''); // Added for success messages
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ... (your handleChange function is perfect) ...
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'resume') {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
 };

  // --- UPDATED handleSubmit Function ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // --- Frontend validation remains the same ---
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match.');
    }
    const emailRegex = /^[a-zA-Z0-9]+@kpriet\.ac\.in$/;
    if (!emailRegex.test(formData.email)) {
      return setError('Please use your official KPRIET email.');
    }

    // Use FormData because we are sending a file
    const dataToSubmit = new FormData();
    for (const key in formData) {
      dataToSubmit.append(key, formData[key]);
    }
    
    try {
        // Send POST request to the backend
        const response = await axios.post(
            'http://localhost:3002/api/auth/register', 
            dataToSubmit,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        
        // --- 3. Handle the new response and redirect ---
        const { token, data } = response.data;

        // Store the token and user info, just like in the login form
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(data));

        // Navigate to the student dashboard
        navigate('/student/dashboard');
        
    } catch (err) {
        // Handle errors from the backend
        if (err.response && err.response.data && err.response.data.message) {
            setError(err.response.data.message);
        } else {
            setError('Registration failed. Please try again.');
        }
    }
  };
  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <div className="form-header">
          <h2>Create Student Account</h2>
          <p>KPR Institute of Engineering and Technology</p>
        </div>

        {error && <p className="error-message">{error}</p>}

        <div className="form-grid">
          {/* Full Name */}
          <div className="input-group">
            <label htmlFor="fullName">Full Name</label>
            <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} required />
          </div>

          {/* Email */}
          <div className="input-group">
            <label htmlFor="email">Official College Email</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="e.g., 23it066@kpriet.ac.in" required />
          </div>

          {/* Password */}
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <div className="password-wrapper">
              <input type={showPassword ? 'text' : 'password'} id="password" name="password" value={formData.password} onChange={handleChange} required />
              <span className="password-toggle-icon" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>
            
          {/* Confirm Password */}
          <div className="input-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="password-wrapper">
              <input type={showConfirmPassword ? 'text' : 'password'} id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
              <span className="password-toggle-icon" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          {/* Year and Department */}
          <div className="input-group">
            <label htmlFor="year">Year of Study</label>
            <select id="year" name="year" value={formData.year} onChange={handleChange} required>
                <option value="">Select Year</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
            </select>
          </div>

          <div className="input-group">
            <label htmlFor="department">Department</label>
            <select id="department" name="department" value={formData.department} onChange={handleChange} required>
                <option value="">Select Department</option>
                <option value="IT">Information Technology</option>
                <option value="CSE">Computer Science</option>
                <option value="ECE">Electronics & Communication</option>
                <option value="EEE">Electrical & Electronics</option>
                <option value="MECH">Mechanical</option>
                <option value="CIVIL">Civil</option>
            </select>
          </div>
          
          {/* CGPA and Arrears */}
           <div className="input-group">
            <label htmlFor="cgpa">Current CGPA</label>
            <input type="number" id="cgpa" name="cgpa" step="0.01" min="0" max="10" value={formData.cgpa} onChange={handleChange} required />
          </div>
          
          <div className="input-group">
            <label htmlFor="arrears">Number of Arrears</label>
            <input type="number" id="arrears" name="arrears" min="0" value={formData.arrears} onChange={handleChange} required />
          </div>

          {/* Coding Profile Links */}
          <div className="input-group full-width">
            <label htmlFor="codingLinks">Coding Profile Links (seperate using comma)</label>
            <input type="text" id="codingLinks" name="codingLinks" placeholder="e.g., GitHub, LeetCode, HackerRank links" value={formData.codingLinks} onChange={handleChange} required />
          </div>

          {/* Skills */}
          <div className="input-group full-width">
            <label htmlFor="skills">Skills (comma-separated)</label>
            <input type="text" id="skills" name="skills" placeholder="e.g., React, Node.js, Python" value={formData.skills} onChange={handleChange} />
          </div>

          {/* Resume Upload */}
          <div className="input-group full-width">
            <label htmlFor="resume">Upload Resume (PDF only)</label>
            <input type="file" id="resume" name="resume" accept=".pdf" onChange={handleChange} required />
          </div>
        </div>

        <button type="submit" className="signup-button">
          Register
        </button>
        
        <div className="form-footer">
            <Link to={"/"}>Login</Link>
        </div>

        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
      </form>
    </div>
  );
};

export default SignupForm;