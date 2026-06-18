import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_URL from './apiConfig';

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
      const response = await fetch(`${API_URL}/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username,
          password: password
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Save user data to localStorage
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('access_token', data.access || 'demo_token');
        localStorage.setItem('isLoggedIn', 'true');
        
        console.log('✅ Doctor logged in:', data.user);
        
        // Redirect to doctor dashboard
        navigate('/doctor');
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

  // Styles
  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    },
    card: {
      background: 'white',
      borderRadius: '20px',
      padding: '40px',
      maxWidth: '450px',
      width: '100%',
      boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
    },
    header: {
      textAlign: 'center',
      marginBottom: '30px'
    },
    logo: {
      fontSize: '4em',
      marginBottom: '10px'
    },
    title: {
      color: '#1a237e',
      margin: 0,
      fontSize: '1.8em'
    },
    subtitle: {
      color: '#666',
      margin: '5px 0 0 0',
      fontSize: '0.9em'
    },
    error: {
      background: '#f8d7da',
      color: '#721c24',
      padding: '12px',
      borderRadius: '8px',
      marginBottom: '20px'
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '5px'
    },
    label: {
      fontWeight: '600',
      color: '#333',
      fontSize: '0.9em'
    },
    input: {
      padding: '12px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      fontSize: '1em',
      transition: 'border-color 0.3s'
    },
    inputFocus: {
      outline: 'none',
      borderColor: '#1a237e'
    },
    submitBtn: {
      background: '#1a237e',
      color: 'white',
      padding: '14px',
      border: 'none',
      borderRadius: '8px',
      fontSize: '1.1em',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background 0.3s',
      marginTop: '10px'
    },
    submitBtnDisabled: {
      opacity: 0.6,
      cursor: 'not-allowed'
    },
    footer: {
      textAlign: 'center',
      marginTop: '20px',
      paddingTop: '20px',
      borderTop: '1px solid #f0f0f0'
    },
    backLink: {
      background: 'none',
      border: 'none',
      color: '#1a237e',
      cursor: 'pointer',
      fontWeight: '600',
      textDecoration: 'underline'
    },
    infoBox: {
      marginTop: '20px',
      background: '#e8eaf6',
      padding: '15px',
      borderRadius: '10px'
    },
    infoBoxTitle: {
      display: 'block',
      marginBottom: '10px',
      color: '#1a237e'
    },
    infoList: {
      margin: 0,
      paddingLeft: '20px'
    },
    infoItem: {
      margin: '5px 0',
      color: '#555'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.logo}>👨‍⚕️</div>
          <h1 style={styles.title}>Doctor Login</h1>
          <p style={styles.subtitle}>Access the Dr. Jimmy Medical Dashboard</p>
        </div>

        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Username *</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Enter your username"
              style={styles.input}
              onFocus={(e) => e.target.style.borderColor = '#1a237e'}
              onBlur={(e) => e.target.style.borderColor = '#ddd'}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password *</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              style={styles.input}
              onFocus={(e) => e.target.style.borderColor = '#1a237e'}
              onBlur={(e) => e.target.style.borderColor = '#ddd'}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.submitBtn,
              ...(loading ? styles.submitBtnDisabled : {})
            }}
          >
            {loading ? 'Logging in...' : 'Login to Dashboard'}
          </button>
        </form>

        <div style={styles.footer}>
          <p>
            <button 
              style={styles.backLink}
              onClick={() => navigate('/')}
            >
              ← Back to Homepage
            </button>
          </p>
        </div>
<div style={styles.footer}>
  <p>
    Don't have an account?{' '}
    <button 
      style={styles.link}
      onClick={() => navigate('/doctor-register')}
    >
      Register here
    </button>
  </p>
  <p>
    <button 
      style={styles.link}
      onClick={() => navigate('/')}
    >
      ← Back to Homepage
    </button>
  </p>
</div>

        <div style={styles.infoBox}>
          <strong style={styles.infoBoxTitle}>📋 Doctor Access</strong>
          <ul style={styles.infoList}>
            <li style={styles.infoItem}>✓ View all patients</li>
            <li style={styles.infoItem}>✓ Review medical scans</li>
            <li style={styles.infoItem}>✓ Add diagnosis and recommendations</li>
            <li style={styles.infoItem}>✓ Generate prescriptions</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default DoctorLogin;