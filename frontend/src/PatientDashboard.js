import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API_URL from './apiConfig';

function PatientDashboard() {
  const [user, setUser] = useState(null);
  const [scans, setScans] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [message, setMessage] = useState('');
  const [stats, setStats] = useState({
    totalScans: 0,
    pendingScans: 0,
    reviewedScans: 0,
    totalConsultations: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
    } else {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      fetchPatientData(parsedUser);
    }
  }, [navigate]);

  const fetchPatientData = async (userData) => {
    try {
      setLoading(true);
      console.log("📊 Fetching patient data for:", userData.username);
      
      // Fetch scans
      const scansResponse = await fetch(`${API_URL}/my-scans/?username=${userData.username}`);
      const scansData = await scansResponse.json();
      console.log("📥 Scans data:", scansData);
      
      if (scansData.scans) {
        setScans(scansData.scans);
        const total = scansData.scans.length;
        const pending = scansData.scans.filter(s => s.status === 'pending').length;
        const reviewed = scansData.scans.filter(s => s.status === 'reviewed').length;
        setStats({
          totalScans: total,
          pendingScans: pending,
          reviewedScans: reviewed,
          totalConsultations: consultations.length
        });
      }

      // Fetch consultations
      try {
        const consResponse = await fetch(`${API_URL}/doctor/appointments/`);
        const consData = await consResponse.json();
        if (consData.success) {
          const userConsults = consData.appointments?.filter(
            appt => appt.patient_id === userData.id
          ) || [];
          setConsultations(userConsults);
          setStats(prev => ({
            ...prev,
            totalConsultations: userConsults.length
          }));
        }
      } catch (consError) {
        console.log('Consultations not available yet');
      }

    } catch (error) {
      console.error('Error fetching patient data:', error);
      setMessage('❌ Error loading your data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Download Report Function
  const downloadReport = (scan) => {
    setGeneratingReport(true);
    
    const reportContent = `
╔══════════════════════════════════════════════════════════════════╗
║                   DR. JIMMY ORTHOPEDIC CENTER                   ║
║                   MEDICAL REPORT                                ║
╚══════════════════════════════════════════════════════════════════╝

Report ID: ${scan.id}
Date Generated: ${new Date().toLocaleString()}

╔══════════════════════════════════════════════════════════════════╗
║                      PATIENT INFORMATION                        ║
╚══════════════════════════════════════════════════════════════════╝

Patient Name: ${user.first_name || ''} ${user.last_name || ''}
Patient ID: ${user.id}
Email: ${user.email}
Phone: ${user.phone || 'N/A'}

╔══════════════════════════════════════════════════════════════════╗
║                      SCAN INFORMATION                           ║
╚══════════════════════════════════════════════════════════════════╝

Scan Type: ${scan.scan_type}
Body Part: ${scan.body_part}
Uploaded: ${scan.uploaded_at}
Status: ${scan.status === 'pending' ? 'Pending Review' : 'Reviewed'}

╔══════════════════════════════════════════════════════════════════╗
║                      DOCTOR'S FINDINGS                          ║
╚══════════════════════════════════════════════════════════════════╝

${scan.diagnosis ? `Diagnosis: ${scan.diagnosis}` : 'Awaiting diagnosis...'}

${scan.recommendations ? `Recommendations: ${scan.recommendations}` : 'Awaiting recommendations...'}

${scan.description ? `Patient Description: ${scan.description}` : ''}

╔══════════════════════════════════════════════════════════════════╗
║                      DISCLAIMER                                 ║
╚══════════════════════════════════════════════════════════════════╝

This report is for informational purposes only. 
Please consult with Dr. Jimmy for professional medical advice.

Dr. Jimmy Orthopedic Center
Dar es Salaam, Tanzania
Phone: +255 712 345 678
Email: info@drjimmy.com

Generated on: ${new Date().toLocaleString()}
    `;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Medical_Report_${scan.id}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setGeneratingReport(false);
    setMessage('✅ Report downloaded successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: { backgroundColor: '#fff3e0', color: '#ff9800' },
      reviewed: { backgroundColor: '#e8f5e9', color: '#4caf50' },
      scheduled: { backgroundColor: '#e3f2fd', color: '#1976d2' },
      completed: { backgroundColor: '#e8f5e9', color: '#4caf50' },
      cancelled: { backgroundColor: '#fce4ec', color: '#f44336' },
      pending_payment: { backgroundColor: '#fff3e0', color: '#ff9800' }
    };
    return styles[status] || styles.pending;
  };

  // ============ FIXED: Get Image URL from Backend ============
  const getImageUrl = (scan) => {
    if (scan.image_url) {
      // If image_url already starts with http, use it as is
      if (scan.image_url.startsWith('http')) {
        return scan.image_url;
      }
      // Otherwise, prepend the backend URL
      return `${API_URL.replace('/api', '')}${scan.image_url}`;
    }
    if (scan.image) {
      // If image is just the path, prepend backend URL
      return `${API_URL.replace('/api', '')}/media/${scan.image}`;
    }
    return null;
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <div style={{ 
          display: 'inline-block',
          width: '40px',
          height: '40px',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #1976d2',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ marginTop: '20px' }}>Loading your dashboard...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h2>Please login to view your dashboard</h2>
        <a href="/login">
          <button style={{ backgroundColor: '#1976d2', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            Go to Login
          </button>
        </a>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px', fontFamily: 'Segoe UI, Arial, sans-serif' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #1976d2, #0d47a1)', color: 'white', padding: '30px', borderRadius: '15px', marginBottom: '30px' }}>
        <h1 style={{ margin: 0, fontSize: '2em' }}>👋 Welcome, {user.first_name || user.username}!</h1>
        <p style={{ margin: '10px 0 0 0', opacity: 0.9 }}>Manage your medical records, view scans, and track consultations</p>
      </div>

      {message && (
        <div style={{ padding: '15px', backgroundColor: '#d4edda', borderRadius: '8px', color: '#155724', marginBottom: '20px' }}>
          {message}
        </div>
      )}

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5em', fontWeight: 'bold', color: '#1976d2' }}>{stats.totalScans}</div>
          <div style={{ color: '#666', fontSize: '0.9em', marginTop: '5px' }}>📄 Total Scans</div>
        </div>
        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5em', fontWeight: 'bold', color: '#ff9800' }}>{stats.pendingScans}</div>
          <div style={{ color: '#666', fontSize: '0.9em', marginTop: '5px' }}>⏳ Pending Review</div>
        </div>
        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5em', fontWeight: 'bold', color: '#4caf50' }}>{stats.reviewedScans}</div>
          <div style={{ color: '#666', fontSize: '0.9em', marginTop: '5px' }}>✅ Reviewed Scans</div>
        </div>
        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5em', fontWeight: 'bold', color: '#1976d2' }}>{stats.totalConsultations}</div>
          <div style={{ color: '#666', fontSize: '0.9em', marginTop: '5px' }}>🎥 Consultations</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ background: 'white', border: '1px solid #e0e0e0', borderRadius: '15px', padding: '25px', marginBottom: '30px', backgroundColor: '#e3f2fd', border: 'none' }}>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <button onClick={() => navigate('/upload')} style={{ padding: '12px 24px', backgroundColor: '#1976d2', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px' }}>
            📤 Upload New Scan
          </button>
          <button onClick={() => navigate('/video-consult')} style={{ padding: '12px 24px', backgroundColor: '#4caf50', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px' }}>
            🎥 Book Consultation
          </button>
          <button onClick={() => navigate('/payment')} style={{ padding: '12px 24px', backgroundColor: '#ff9800', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px' }}>
            💳 Make Payment
          </button>
        </div>
      </div>

      {/* My Scans */}
      <div style={{ background: 'white', border: '1px solid #e0e0e0', borderRadius: '15px', padding: '25px', marginBottom: '30px' }}>
        <h2 style={{ margin: '0 0 20px 0', color: '#1976d2', fontSize: '1.3em' }}>🩻 My Medical Scans</h2>
        {scans.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#f5f5f5', borderRadius: '10px', color: '#999' }}>
            <p style={{ fontSize: '3em', margin: 0 }}>📭</p>
            <p>You haven't uploaded any scans yet.</p>
            <button onClick={() => navigate('/upload')} style={{ backgroundColor: '#1976d2', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '10px' }}>
              Upload Your First Scan
            </button>
          </div>
        ) : (
          scans.map((scan) => {
            const statusStyle = getStatusBadge(scan.status);
            // ============ FIXED: Get image URL from backend ============
            const imageUrl = getImageUrl(scan);
            
            return (
              <div key={scan.id} style={{ border: '1px solid #eee', borderRadius: '10px', padding: '15px', marginBottom: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 'bold', color: '#1976d2' }}>{scan.scan_type} - {scan.body_part}</span>
                  <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', ...statusStyle }}>
                    {scan.status === 'pending' ? '⏳ Pending Review' : '✅ Reviewed'}
                  </span>
                </div>
                <div style={{ color: '#666', fontSize: '14px' }}>
                  <div>📅 {scan.uploaded_at}</div>
                  {scan.description && <div>📝 {scan.description}</div>}
                </div>
                {scan.diagnosis && (
                  <div style={{ marginTop: '10px', padding: '12px', backgroundColor: '#e8f5e9', borderRadius: '8px', fontSize: '14px' }}>
                    <strong>📋 Diagnosis:</strong> {scan.diagnosis}
                    {scan.recommendations && (
                      <>
                        <br />
                        <strong>💊 Recommendations:</strong> {scan.recommendations}
                      </>
                    )}
                  </div>
                )}
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
                  {/* ============ FIXED: View Image button using backend URL ============ */}
                  {imageUrl && (
                    <button 
                      onClick={() => window.open(imageUrl, '_blank')} 
                      style={{ padding: '6px 15px', backgroundColor: '#9c27b0', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '13px' }}
                    >
                      🖼️ View Image
                    </button>
                  )}
                  {scan.status === 'reviewed' && (
                    <button onClick={() => downloadReport(scan)} disabled={generatingReport} style={{ padding: '6px 15px', backgroundColor: '#4caf50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '13px', opacity: generatingReport ? 0.6 : 1 }}>
                      {generatingReport ? '⏳...' : '📥 Download Report'}
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Consultations */}
      <div style={{ background: 'white', border: '1px solid #e0e0e0', borderRadius: '15px', padding: '25px', marginBottom: '30px' }}>
        <h2 style={{ margin: '0 0 20px 0', color: '#1976d2', fontSize: '1.3em' }}>🎥 My Consultations</h2>
        {consultations.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#f5f5f5', borderRadius: '10px', color: '#999' }}>
            <p style={{ fontSize: '3em', margin: 0 }}>📅</p>
            <p>No consultations scheduled.</p>
            <button onClick={() => navigate('/video-consult')} style={{ backgroundColor: '#4caf50', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '10px' }}>
              Book a Consultation
            </button>
          </div>
        ) : (
          consultations.map((consult) => {
            const statusStyle = getStatusBadge(consult.status);
            return (
              <div key={consult.id} style={{ border: '1px solid #eee', borderRadius: '10px', padding: '15px', marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontWeight: 'bold', color: '#1976d2' }}>📅 {consult.scheduled_date}</div>
                  <div style={{ fontSize: '14px', color: '#666' }}>
                    Status: <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', ...statusStyle }}>
                      {consult.status === 'pending_payment' ? '⏳ Payment Pending' : consult.status}
                    </span>
                  </div>
                </div>
                {consult.zoom_link && consult.status === 'scheduled' && (
                  <a href={consult.zoom_link} target="_blank" rel="noopener noreferrer" style={{ backgroundColor: '#1976d2', color: 'white', padding: '8px 15px', borderRadius: '5px', textDecoration: 'none', fontSize: '14px' }}>
                    🎥 Join
                  </a>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default PatientDashboard;


