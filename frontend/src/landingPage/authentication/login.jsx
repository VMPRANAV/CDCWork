import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './login.css';
import collegeLogo from "../../assets/kprietLogo.png";
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios'; // Import axios

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(''); // State to hold error messages

  const navigate = useNavigate(); // Hook for navigation

  // --- UPDATED handleSubmit Function ---
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(''); // Clear previous errors

    try {
      // Send login request to the backend
      const response = await axios.post('http://localhost:3002/api/auth/login', {
        email,
        password,
      });

      // If login is successful, the backend sends back a token
      const { token, data } = response.data;

      // 1. Store the token securely (localStorage is common for this)
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(data)); // Optional: store user info

      // 2. Redirect the user to their dashboard or home page
      // We will check the user's role and redirect accordingly
      if(data.role === 'admin') {
        navigate('/admin/students');
      } else {
        navigate('/student/dashboard');
      }
      
    } catch (err) {
      // Handle login errors
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Login failed. Please check your connection and try again.');
      }
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-header">
          <img src={collegeLogo} alt="College Logo" className="logo" />
          <h2>Placement Cell Login</h2>
          <p>KPR Institute of Engineering and Technology</p>
        </div>
        
        {/* Display error message if it exists */}
        {error && <p className="error-message">{error}</p>}

        <div className="input-group">
          <label htmlFor="email">Email / User ID</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="password">Password</label>
          <div className="password-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
            <span
              className="password-toggle-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>
        
        <div className="form-options">
          <a href="/forgot-password">Forgot Password?</a>
        </div>

        <button type="submit" className="login-button">
          Login
        </button>
        <div className="form-footer">
          Don't have an account? <Link to={"/signup"}>Sign up</Link>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;