import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginRegister() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    first_name: '',
    last_name: '',
    phone_number: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let response;
      if (isLogin) {
        // Login
        response = await fetch('https://drjimmy-backend.onrender.com/api/login/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: formData.username,
            password: formData.password
          })
        });
      } else {
        // Register - using formData that is defined
        response = await fetch('https://drjimmy-backend.onrender.com/api/register/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: formData.username,
            password: formData.password,
            email: formData.email,
            first_name: formData.first_name,
            last_name: formData.last_name,
            phone_number: formData.phone_number
          })
        });
      }

      const data = await response.json();

      if (response.ok) {
        if (isLogin) {
          // Save user data to localStorage
          localStorage.setItem('user', JSON.stringify(data.user));
          localStorage.setItem('access_token', data.access || 'demo_token');
          
          alert(`Welcome back ${data.user.first_name || data.user.username}!`);
          navigate('/upload');
        } else {
          alert('Account created successfully! Please login.');
          setIsLogin(true);
          setFormData({
            username: '',
            password: '',
            email: '',
            first_name: '',
            last_name: '',
            phone_number: ''
          });
        }
      } else {
        setError(data.error || 'Authentication failed');
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError('Cannot connect to server. Make sure backend is running on port 8000');
    } finally {
      setLoading(false);
    }
  };

  // Styles
  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
      color: '#1976d2',
      margin: 0
    },
    subtitle: {
      color: '#666',
      margin: '5px 0 0 0'
    },
    tabs: {
      display: 'flex',
      gap: '10px',
      marginBottom: '30px'
    },
    tabBtn: {
      flex: 1,
      padding: '12px',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '1em',
      transition: 'all 0.3s'
    },
    tabActive: {
      background: '#1976d2',
      color: 'white'
    },
    tabInactive: {
      background: '#f0f0f0',
      color: '#666'
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
      gap: '15px'
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
      borderColor: '#1976d2'
    },
    formRow: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '15px'
    },
    submitBtn: {
      background: '#1976d2',
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
    switchBtn: {
      background: 'none',
      border: 'none',
      color: '#1976d2',
      cursor: 'pointer',
      fontWeight: '600',
      textDecoration: 'underline'
    },
    infoBox: {
      marginTop: '30px',
      background: '#e3f2fd',
      padding: '15px',
      borderRadius: '10px'
    },
    infoBoxTitle: {
      display: 'block',
      marginBottom: '10px',
      color: '#1976d2'
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
          <div style={styles.logo}>🏥</div>
          <h1 style={styles.title}>Dr. Jimmy Orthopedic</h1>
          <p style={styles.subtitle}>{isLogin ? 'Login to your account' : 'Create new patient account'}</p>
        </div>

        <div style={styles.tabs}>
          <button 
            style={{
              ...styles.tabBtn,
              ...(isLogin ? styles.tabActive : styles.tabInactive)
            }}
            onClick={() => {
              setIsLogin(true);
              setError('');
            }}
          >
            Login
          </button>
          <button 
            style={{
              ...styles.tabBtn,
              ...(!isLogin ? styles.tabActive : styles.tabInactive)
            }}
            onClick={() => {
              setIsLogin(false);
              setError('');
            }}
          >
            Register
          </button>
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
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Enter your username"
              style={styles.input}
              onFocus={(e) => e.target.style.borderColor = '#1976d2'}
              onBlur={(e) => e.target.style.borderColor = '#ddd'}
            />
          </div>

          {!isLogin && (
            <>
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>First Name</label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    placeholder="First name"
                    style={styles.input}
                    onFocus={(e) => e.target.style.borderColor = '#1976d2'}
                    onBlur={(e) => e.target.style.borderColor = '#ddd'}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Last Name</label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    placeholder="Last name"
                    style={styles.input}
                    onFocus={(e) => e.target.style.borderColor = '#1976d2'}
                    onBlur={(e) => e.target.style.borderColor = '#ddd'}
                  />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your@email.com"
                  style={styles.input}
                  onFocus={(e) => e.target.style.borderColor = '#1976d2'}
                  onBlur={(e) => e.target.style.borderColor = '#ddd'}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Phone Number</label>
                <input
                  type="tel"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  placeholder="e.g., 0712345678"
                  style={styles.input}
                  onFocus={(e) => e.target.style.borderColor = '#1976d2'}
                  onBlur={(e) => e.target.style.borderColor = '#ddd'}
                />
              </div>
            </>
          )}

          <div style={styles.formGroup}>
            <label style={styles.label}>Password *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              style={styles.input}
              onFocus={(e) => e.target.style.borderColor = '#1976d2'}
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
            {loading ? 'Processing...' : (isLogin ? 'Login' : 'Create Account')}
          </button>
        </form>

        <div style={styles.footer}>
          <p>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              style={styles.switchBtn}
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
            >
              {isLogin ? 'Register here' : 'Login here'}
            </button>
          </p>
        </div>

        <div style={styles.infoBox}>
          <strong style={styles.infoBoxTitle}>📋 Why register?</strong>
          <ul style={styles.infoList}>
            <li style={styles.infoItem}>✓ Upload MRI, X-Ray, CT scans</li>
            <li style={styles.infoItem}>✓ Book video consultations</li>
            <li style={styles.infoItem}>✓ View doctor's diagnosis</li>
            <li style={styles.infoItem}>✓ Access medical history</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default LoginRegister;