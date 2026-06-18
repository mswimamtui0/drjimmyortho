import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_URL from './apiConfig';

function DoctorRegister() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    first_name: '',
    last_name: '',
    secret_key: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
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

    // Check passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/doctor/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          email: formData.email,
          first_name: formData.first_name,
          last_name: formData.last_name,
          secret_key: formData.secret_key
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/doctor-login');
        }, 3000);
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('Cannot connect to server. Please try again.');
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
      maxWidth: '500px',
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
      margin: 0
    },
    subtitle: {
      color: '#666',
      margin: '5px 0 0 0'
    },
    error: {
      background: '#f8d7da',
      color: '#721c24',
      padding: '12px',
      borderRadius: '8px',
      marginBottom: '20px'
    },
    success: {
      background: '#d4edda',
      color: '#155724',
      padding: '12px',
      borderRadius: '8px',
      marginBottom: '20px',
      textAlign: 'center'
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
      borderColor: '#1a237e'
    },
    formRow: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '15px'
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
    link: {
      color: '#1a237e',
      cursor: 'pointer',
      fontWeight: '600',
      textDecoration: 'underline',
      background: 'none',
      border: 'none'
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
    },
    secretHint: {
      background: '#fff3e0',
      padding: '10px',
      borderRadius: '5px',
      fontSize: '12px',
      color: '#e65100'
    }
  };

  if (success) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.header}>
            <div style={styles.logo}></div>
            <h1 style={styles.title}>Registration Successful!</h1>
            <p style={styles.subtitle}>Your doctor account has been created.</p>
            <p style={{ marginTop: '10px' }}>Redirecting to login...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.logo}>‍</div>
          <h1 style={styles.title}>Doctor Registration</h1>
          <p style={styles.subtitle}>Create your doctor account</p>
        </div>

        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
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
                onFocus={(e) => e.target.style.borderColor = '#1a237e'}
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
                onFocus={(e) => e.target.style.borderColor = '#1a237e'}
                onBlur={(e) => e.target.style.borderColor = '#ddd'}
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Username *</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Choose a username"
              style={styles.input}
              onFocus={(e) => e.target.style.borderColor = '#1a237e'}
              onBlur={(e) => e.target.style.borderColor = '#ddd'}
            />
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
              onFocus={(e) => e.target.style.borderColor = '#1a237e'}
              onBlur={(e) => e.target.style.borderColor = '#ddd'}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter password"
              style={styles.input}
              onFocus={(e) => e.target.style.borderColor = '#1a237e'}
              onBlur={(e) => e.target.style.borderColor = '#ddd'}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Confirm Password *</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirm password"
              style={styles.input}
              onFocus={(e) => e.target.style.borderColor = '#1a237e'}
              onBlur={(e) => e.target.style.borderColor = '#ddd'}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Secret Key *</label>
            <input
              type="password"
              name="secret_key"
              value={formData.secret_key}
              onChange={handleChange}
              required
              placeholder="Enter the doctor secret key"
              style={styles.input}
              onFocus={(e) => e.target.style.borderColor = '#1a237e'}
              onBlur={(e) => e.target.style.borderColor = '#ddd'}
            />
            <div style={styles.secretHint}>
               Ask admin for the secret key. For demo use: <strong>DRJIMMY2024</strong>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.submitBtn,
              ...(loading ? styles.submitBtnDisabled : {})
            }}
          >
            {loading ? 'Registering...' : '‍ Register as Doctor'}
          </button>
        </form>

        <div style={styles.footer}>
          <p>
            Already have an account?{' '}
            <button 
              style={styles.link}
              onClick={() => navigate('/doctor-login')}
            >
              Login here
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
          <strong style={styles.infoBoxTitle}> Doctor Access</strong>
          <ul style={styles.infoList}>
            <li style={styles.infoItem}> View all patients</li>
            <li style={styles.infoItem}> Review medical scans</li>
            <li style={styles.infoItem}> Add diagnosis and recommendations</li>
            <li style={styles.infoItem}> Generate prescriptions</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default DoctorRegister;


