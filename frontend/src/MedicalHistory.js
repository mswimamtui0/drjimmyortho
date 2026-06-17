import API_URL from './apiConfig';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function MedicalHistory() {
  const [user, setUser] = useState(null);
  const [history, setHistory] = useState({
    conditions: '',
    allergies: '',
    medications: '',
    surgeries: '',
    family_history: '',
    lifestyle: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [existingHistory, setExistingHistory] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
    } else {
      setUser(JSON.parse(userData));
      fetchMedicalHistory(JSON.parse(userData));
    }
  }, [navigate]);

  const fetchMedicalHistory = async (userData) => {
    try {
      const response = await fetch(`http://localhost:8000/api/medical-history/?user_id=${userData.id}`);
      const data = await response.json();
      if (data.success && data.history) {
        setExistingHistory(data.history);
        setHistory({
          conditions: data.history.conditions || '',
          allergies: data.history.allergies || '',
          medications: data.history.medications || '',
          surgeries: data.history.surgeries || '',
          family_history: data.history.family_history || '',
          lifestyle: data.history.lifestyle || ''
        });
      }
    } catch (error) {
      console.error('Error fetching medical history:', error);
    }
  };

  const handleChange = (e) => {
    setHistory({
      ...history,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(${API_URL}/update-medical-history/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          ...history
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: '✅ Medical history saved successfully!' });
      } else {
        setMessage({ type: 'error', text: data.error || 'Save failed' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Cannot connect to server' });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div style={{ maxWidth: '800px', margin: '50px auto', padding: '20px' }}>
      <h1 style={{ color: '#1976d2' }}>📋 Medical History</h1>
      <p>Provide your complete medical history for better diagnosis</p>

      <form onSubmit={handleSubmit} style={{ marginTop: '30px' }}>
        <div style={{ marginBottom: '20px' }}>
          <label>Pre-existing Conditions</label>
          <textarea
            name="conditions"
            value={history.conditions}
            onChange={handleChange}
            placeholder="e.g., Diabetes, High blood pressure, Arthritis..."
            rows="3"
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label>Allergies</label>
          <textarea
            name="allergies"
            value={history.allergies}
            onChange={handleChange}
            placeholder="e.g., Penicillin, Latex, Pollen..."
            rows="2"
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label>Current Medications</label>
          <textarea
            name="medications"
            value={history.medications}
            onChange={handleChange}
            placeholder="List all medications you are currently taking..."
            rows="3"
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label>Previous Surgeries</label>
          <textarea
            name="surgeries"
            value={history.surgeries}
            onChange={handleChange}
            placeholder="List any surgeries you have had..."
            rows="3"
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label>Family Medical History</label>
          <textarea
            name="family_history"
            value={history.family_history}
            onChange={handleChange}
            placeholder="e.g., Family history of spine problems, Arthritis, etc..."
            rows="3"
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label>Lifestyle Information</label>
          <textarea
            name="lifestyle"
            value={history.lifestyle}
            onChange={handleChange}
            placeholder="e.g., Smoker, Exercise habits, Occupation, Physical activity level..."
            rows="3"
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '14px',
            backgroundColor: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            fontSize: '16px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1
          }}
        >
          {loading ? 'Saving...' : '💾 Save Medical History'}
        </button>

        {message && (
          <div style={{
            marginTop: '20px',
            padding: '15px',
            backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da',
            borderRadius: '5px',
            color: message.type === 'success' ? '#155724' : '#721c24'
          }}>
            {message.text}
          </div>
        )}
      </form>
    </div>
  );
}

export default MedicalHistory;
