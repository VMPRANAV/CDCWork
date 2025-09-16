import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './login.css';
import collegeLogo from "../../assets/kprietLogo.png";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      console.log('Attempting login with:', { email });

      const response = await axios.post('http://localhost:3002/api/auth/login', {
        email,
        password,
      });

      console.log('Login successful:', response.data);

      const { data } = response.data;

      // ✅ Simple storage - just user data, no token
      localStorage.setItem('user', JSON.stringify(data));
      localStorage.setItem('isLoggedIn', 'true');

      // Navigate based on role
      if(data.role === 'admin') {
        navigate('/admin/students');
      } else {
        navigate('/student/dashboard');
      }
      
    } catch (err) {
      console.error('Login error:', err.response?.data || err.message);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Login failed. Please try again.');
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
              type={showPassword ? "text" : "password"}
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