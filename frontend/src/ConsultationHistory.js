import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function ConsultationHistory() {
  const [user, setUser] = useState(null);
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
    } else {
      setUser(JSON.parse(userData));
      fetchConsultations(JSON.parse(userData));
    }
  }, [navigate]);

  const fetchConsultations = async (userData) => {
    try {
      const response = await fetch(`http://drjimmy-backend.onrender.com/api/patient-consultations/?user_id=${userData.id}`);
      const data = await response.json();
      if (data.success) {
        setConsultations(data.consultations);
      }
    } catch (error) {
      console.error('Error fetching consultations:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'scheduled': return '#1976d2';
      case 'completed': return '#4caf50';
      case 'cancelled': return '#f44336';
      default: return '#999';
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <div>Loading consultation history...</div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '900px', margin: '50px auto', padding: '20px' }}>
      <h1 style={{ color: '#1976d2' }}>🎥 Consultation History</h1>
      <p>View all your past and upcoming video consultations</p>

      {consultations.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px',
          backgroundColor: '#f5f5f5',
          borderRadius: '10px',
          marginTop: '30px'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '10px' }}>📭</div>
          <h3>No consultations yet</h3>
          <p style={{ color: '#666' }}>Book your first video consultation with Dr. Jimmy</p>
          <a href="/video-consult">
            <button style={{
              marginTop: '20px',
              padding: '12px 30px',
              backgroundColor: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}>
              Book Now
            </button>
          </a>
        </div>
      ) : (
        <div style={{ marginTop: '30px' }}>
          {consultations.map((consult) => (
            <div key={consult.id} style={{
              border: '1px solid #e0e0e0',
              borderRadius: '10px',
              padding: '20px',
              marginBottom: '15px',
              backgroundColor: 'white',
              boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <span style={{ fontSize: '24px' }}>📅</span>
                    <div>
                      <div style={{ fontWeight: 'bold', fontSize: '1.1em' }}>
                        {consult.scheduled_date || 'Date pending'}
                      </div>
                      <div style={{ color: '#666', fontSize: '0.9em' }}>
                        Status: <span style={{ color: getStatusColor(consult.status) }}>
                          {consult.status || 'scheduled'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  {consult.zoom_link && consult.status === 'scheduled' && (
                    <a href={consult.zoom_link} target="_blank" rel="noopener noreferrer">
                      <button style={{
                        padding: '8px 16px',
                        backgroundColor: '#4caf50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        marginRight: '10px'
                      }}>
                        🎥 Join Meeting
                      </button>
                    </a>
                  )}
                </div>
              </div>
              
              {consult.doctor_notes && (
                <div style={{
                  marginTop: '15px',
                  padding: '15px',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '5px'
                }}>
                  <strong>📝 Doctor's Notes:</strong>
                  <p style={{ marginTop: '5px', color: '#555' }}>{consult.doctor_notes}</p>
                </div>
              )}
              
              {consult.prescription && (
                <div style={{
                  marginTop: '10px',
                  padding: '15px',
                  backgroundColor: '#e3f2fd',
                  borderRadius: '5px',
                  borderLeft: '4px solid #1976d2'
                }}>
                  <strong>💊 Prescription:</strong>
                  <p style={{ marginTop: '5px', color: '#555' }}>{consult.prescription}</p>
                </div>
              )}
            </div>
          ))}
          
          <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e8f5e9', borderRadius: '10px' }}>
            <p>📊 <strong>Total Consultations:</strong> {consultations.length}</p>
            <p>📅 <strong>Scheduled:</strong> {consultations.filter(c => c.status === 'scheduled').length}</p>
            <p>✅ <strong>Completed:</strong> {consultations.filter(c => c.status === 'completed').length}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ConsultationHistory;
