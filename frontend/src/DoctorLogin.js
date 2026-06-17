import API_URL from './apiConfig';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DoctorLogin.css';

function DoctorLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  try {
    const response = await fetch('${API_URL}/login/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();
    console.log('Login response:', data);  // Debug log

    if (response.ok && data.success) {
      // Check if user is a doctor (is_staff = true)
      if (data.user && data.user.is_staff === true) {
        // Save user data to localStorage
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('access_token', data.access || 'demo_token');
        console.log('Doctor login successful, redirecting...');
        // Redirect to doctor dashboard
        navigate('/doctor');
      } else {
        console.log('User is not a doctor. is_staff:', data.user?.is_staff);
        setError('Access denied. This is a doctor-only login area.');
      }
    } else {
      setError(data.error || 'Invalid credentials. Please try again.');
    }
  } catch (err) {
    console.error('Login error:', err);
    setError('Cannot connect to server. Make sure backend is running.');
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="doctor-login-container">
      <div className="doctor-login-card">
        <div className="doctor-login-header">
          <div className="doctor-icon">👨‍⚕️</div>
          <h1>Doctor Login</h1>
          <p>Access Dr. Jimmy's Medical Dashboard</p>
        </div>

        {error && (
          <div className="doctor-login-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="doctor-login-form">
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : '🔐 Login to Dashboard'}
          </button>
        </form>

        <div className="doctor-login-footer">
          <p>⚠️ This area is restricted to authorized doctors only</p>
          <a href="/login">← Back to Patient Login</a>
        </div>
      </div>
    </div>
  );
}

export default DoctorLogin;

