import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function PatientDashboard() {
  const [user, setUser] = useState(null);
  const [scans, setScans] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [stats, setStats] = useState({
    totalScans: 0,
    pendingScans: 0,
    reviewedScans: 0,
    totalConsultations: 0
  });
  const [message, setMessage] = useState('');
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
      const scansResponse = await fetch(`http://drjimmy-backend.onrender.com/api/my-scans/?username=${userData.username}`);
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
        const consResponse = await fetch(`http://drjimmy-backend.onrender.com/api/doctor/appointments/`);
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

  // ============ DOWNLOAD REPORT FUNCTION ============
  const downloadReport = (scan) => {
    setGeneratingReport(true);
    
    // Generate report content
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
This report is not a substitute for a physical examination.

Dr. Jimmy Orthopedic Center
Dar es Salaam, Tanzania
Phone: +255 712 345 678
Email: info@drjimmy.com

Generated on: ${new Date().toLocaleString()}
    `;

    // Create and download the report
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

  // ============ DOWNLOAD FULL HISTORY REPORT ============
  const downloadFullHistory = () => {
    if (scans.length === 0) {
      setMessage('❌ No scans to generate a report.');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    setGeneratingReport(true);
    
    let reportContent = `
╔══════════════════════════════════════════════════════════════════╗
║                   DR. JIMMY ORTHOPEDIC CENTER                   ║
║                   COMPLETE MEDICAL HISTORY                      ║
╚══════════════════════════════════════════════════════════════════╝

Patient Name: ${user.first_name || ''} ${user.last_name || ''}
Patient ID: ${user.id}
Email: ${user.email}
Phone: ${user.phone || 'N/A'}
Date of Report: ${new Date().toLocaleString()}

╔══════════════════════════════════════════════════════════════════╗
║                      SCAN SUMMARY                               ║
╚══════════════════════════════════════════════════════════════════╝

Total Scans: ${scans.length}
Pending Reviews: ${scans.filter(s => s.status === 'pending').length}
Reviewed Scans: ${scans.filter(s => s.status === 'reviewed').length}

╔══════════════════════════════════════════════════════════════════╗
║                      SCAN HISTORY                               ║
╚══════════════════════════════════════════════════════════════════╝

`;

    scans.forEach((scan, index) => {
      reportContent += `
╔══════════════════════════════════════════════════════════════════╗
║  SCAN #${index + 1}                                                         
╚══════════════════════════════════════════════════════════════════╝

Type: ${scan.scan_type}
Body Part: ${scan.body_part}
Uploaded: ${scan.uploaded_at}
Status: ${scan.status === 'pending' ? 'Pending Review' : 'Reviewed'}

${scan.diagnosis ? `Diagnosis: ${scan.diagnosis}` : 'Diagnosis: Awaiting...'}
${scan.recommendations ? `Recommendations: ${scan.recommendations}` : 'Recommendations: Awaiting...'}
${scan.description ? `Description: ${scan.description}` : ''}

──────────────────────────────────────────────────────────────────
`;
    });

    reportContent += `
╔══════════════════════════════════════════════════════════════════╗
║                      CONSULTATIONS HISTORY                       ║
╚══════════════════════════════════════════════════════════════════╝

Total Consultations: ${consultations.length}

`;

    consultations.forEach((consult, index) => {
      reportContent += `
Consultation #${index + 1}
Date: ${consult.scheduled_date}
Status: ${consult.status}
${consult.doctor_notes ? `Doctor's Notes: ${consult.doctor_notes}` : ''}
──────────────────────────────────────────────────────────────────
`;
    });

    reportContent += `
╔══════════════════════════════════════════════════════════════════╗
║                      DISCLAIMER                                 ║
╚══════════════════════════════════════════════════════════════════╝

This report is for informational purposes only. 
Please consult with Dr. Jimmy for professional medical advice.
This report is not a substitute for a physical examination.

Dr. Jimmy Orthopedic Center
Dar es Salaam, Tanzania
Phone: +255 787 688 659
Email: info@drjimmy.com

Generated on: ${new Date().toLocaleString()}
    `;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Complete_Medical_History_${user.username}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setGeneratingReport(false);
    setMessage('✅ Full medical history downloaded successfully!');
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

  // Styles
  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '40px 20px',
      fontFamily: 'Segoe UI, Arial, sans-serif'
    },
    header: {
      background: 'linear-gradient(135deg, #1976d2, #0d47a1)',
      color: 'white',
      padding: '30px',
      borderRadius: '15px',
      marginBottom: '30px'
    },
    headerTitle: {
      margin: 0,
      fontSize: '2em'
    },
    headerSub: {
      margin: '10px 0 0 0',
      opacity: 0.9
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '20px',
      marginBottom: '30px'
    },
    statCard: {
      background: 'white',
      padding: '20px',
      borderRadius: '12px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
      textAlign: 'center'
    },
    statNumber: {
      fontSize: '2.5em',
      fontWeight: 'bold',
      color: '#1976d2'
    },
    statLabel: {
      color: '#666',
      fontSize: '0.9em',
      marginTop: '5px'
    },
    section: {
      background: 'white',
      border: '1px solid #e0e0e0',
      borderRadius: '15px',
      padding: '25px',
      marginBottom: '30px'
    },
    sectionTitle: {
      margin: '0 0 20px 0',
      color: '#1976d2',
      fontSize: '1.3em',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    scanItem: {
      border: '1px solid #eee',
      borderRadius: '10px',
      padding: '15px',
      marginBottom: '15px'
    },
    scanHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '10px',
      flexWrap: 'wrap'
    },
    scanType: {
      fontWeight: 'bold',
      color: '#1976d2'
    },
    scanStatus: {
      padding: '4px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: 'bold'
    },
    scanBody: {
      color: '#666',
      fontSize: '14px'
    },
    scanActions: {
      display: 'flex',
      gap: '10px',
      marginTop: '10px',
      flexWrap: 'wrap'
    },
    downloadBtn: {
      padding: '6px 15px',
      backgroundColor: '#4caf50',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '13px',
      transition: 'background 0.3s'
    },
    downloadBtnHover: {
      backgroundColor: '#388e3c'
    },
    downloadBtnDisabled: {
      opacity: 0.6,
      cursor: 'not-allowed'
    },
    fullHistoryBtn: {
      padding: '10px 25px',
      backgroundColor: '#9c27b0',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '15px',
      fontWeight: '600',
      transition: 'background 0.3s'
    },
    fullHistoryBtnHover: {
      backgroundColor: '#7b1fa2'
    },
    noData: {
      textAlign: 'center',
      padding: '40px',
      backgroundColor: '#f5f5f5',
      borderRadius: '10px',
      color: '#999'
    },
    consultItem: {
      border: '1px solid #eee',
      borderRadius: '10px',
      padding: '15px',
      marginBottom: '15px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap'
    },
    consultDate: {
      fontWeight: 'bold',
      color: '#1976d2'
    },
    emptyIcon: {
      fontSize: '3em',
      margin: '0'
    },
    reviewBox: {
      marginTop: '10px',
      padding: '12px',
      backgroundColor: '#e8f5e9',
      borderRadius: '8px',
      fontSize: '14px'
    },
    message: {
      padding: '15px',
      borderRadius: '8px',
      marginBottom: '20px',
      textAlign: 'center'
    },
    successMessage: {
      backgroundColor: '#d4edda',
      color: '#155724',
      borderLeft: '4px solid #4caf50'
    }
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
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>👋 Welcome, {user.first_name || user.username}!</h1>
        <p style={styles.headerSub}>Manage your medical records, view scans, and track consultations</p>
      </div>

      {/* Message */}
      {message && (
        <div style={{ ...styles.message, ...styles.successMessage }}>
          {message}
        </div>
      )}

      {/* Stats Cards */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{stats.totalScans}</div>
          <div style={styles.statLabel}>📄 Total Scans</div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statNumber, color: '#ff9800' }}>{stats.pendingScans}</div>
          <div style={styles.statLabel}>⏳ Pending Review</div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statNumber, color: '#4caf50' }}>{stats.reviewedScans}</div>
          <div style={styles.statLabel}>✅ Reviewed Scans</div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statNumber, color: '#1976d2' }}>{stats.totalConsultations}</div>
          <div style={styles.statLabel}>🎥 Consultations</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ ...styles.section, backgroundColor: '#e3f2fd', border: 'none' }}>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'center' }}>
          <button 
            onClick={() => navigate('/upload')}
            style={{ 
              padding: '12px 24px', 
              backgroundColor: '#1976d2', 
              color: 'white', 
              border: 'none', 
              borderRadius: '8px', 
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            📤 Upload New Scan
          </button>
          <button 
            onClick={() => navigate('/video-consult')}
            style={{ 
              padding: '12px 24px', 
              backgroundColor: '#4caf50', 
              color: 'white', 
              border: 'none', 
              borderRadius: '8px', 
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            🎥 Book Consultation
          </button>
          <button 
            onClick={() => navigate('/payment')}
            style={{ 
              padding: '12px 24px', 
              backgroundColor: '#ff9800', 
              color: 'white', 
              border: 'none', 
              borderRadius: '8px', 
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            💳 Make Payment
          </button>
          {/* ============ DOWNLOAD FULL HISTORY BUTTON ============ */}
          <button 
            onClick={downloadFullHistory}
            disabled={generatingReport}
            style={{ 
              padding: '12px 24px', 
              backgroundColor: '#9c27b0', 
              color: 'white', 
              border: 'none', 
              borderRadius: '8px', 
              cursor: generatingReport ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              opacity: generatingReport ? 0.6 : 1
            }}
            onMouseEnter={(e) => {
              if (!generatingReport) e.currentTarget.style.backgroundColor = '#7b1fa2';
            }}
            onMouseLeave={(e) => {
              if (!generatingReport) e.currentTarget.style.backgroundColor = '#9c27b0';
            }}
          >
            {generatingReport ? '⏳ Generating...' : '📋 Download Full History'}
          </button>
        </div>
      </div>

      {/* My Scans */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>
          <span>🩻 My Medical Scans</span>
          {scans.length > 0 && (
            <button 
              onClick={downloadFullHistory}
              disabled={generatingReport}
              style={{
                ...styles.fullHistoryBtn,
                padding: '6px 15px',
                fontSize: '13px',
                opacity: generatingReport ? 0.6 : 1,
                cursor: generatingReport ? 'not-allowed' : 'pointer'
              }}
            >
              {generatingReport ? '⏳...' : '📋 Download All'}
            </button>
          )}
        </div>
        {scans.length === 0 ? (
          <div style={styles.noData}>
            <p style={styles.emptyIcon}>📭</p>
            <p>You haven't uploaded any scans yet.</p>
            <button 
              onClick={() => navigate('/upload')}
              style={{ 
                backgroundColor: '#1976d2', 
                color: 'white', 
                padding: '10px 20px', 
                border: 'none', 
                borderRadius: '5px', 
                cursor: 'pointer',
                marginTop: '10px'
              }}
            >
              Upload Your First Scan
            </button>
          </div>
        ) : (
          scans.map((scan) => {
            const statusStyle = getStatusBadge(scan.status);
            return (
              <div key={scan.id} style={styles.scanItem}>
                <div style={styles.scanHeader}>
                  <span style={styles.scanType}>{scan.scan_type} - {scan.body_part}</span>
                  <span style={{ ...styles.scanStatus, ...statusStyle }}>
                    {scan.status === 'pending' ? '⏳ Pending Review' : '✅ Reviewed'}
                  </span>
                </div>
                <div style={styles.scanBody}>
                  <div>📅 {scan.uploaded_at}</div>
                  {scan.description && <div>📝 {scan.description}</div>}
                </div>
                {scan.diagnosis && (
                  <div style={styles.reviewBox}>
                    <strong>📋 Diagnosis:</strong> {scan.diagnosis}
                    {scan.recommendations && (
                      <>
                        <br />
                        <strong>💊 Recommendations:</strong> {scan.recommendations}
                      </>
                    )}
                  </div>
                )}
                {/* ============ SCAN ACTIONS WITH DOWNLOAD BUTTON ============ */}
                <div style={styles.scanActions}>
                  {scan.image_url && (
                    <button 
                      onClick={() => window.open(scan.image_url, '_blank')}
                      style={{ 
                        padding: '6px 15px',
                        backgroundColor: '#9c27b0',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '13px'
                      }}
                    >
                      🖼️ View Image
                    </button>
                  )}
                  {scan.status === 'reviewed' && (
                    <button 
                      onClick={() => downloadReport(scan)}
                      disabled={generatingReport}
                      style={{
                        ...styles.downloadBtn,
                        opacity: generatingReport ? 0.6 : 1,
                        cursor: generatingReport ? 'not-allowed' : 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        if (!generatingReport) e.currentTarget.style.backgroundColor = '#388e3c';
                      }}
                      onMouseLeave={(e) => {
                        if (!generatingReport) e.currentTarget.style.backgroundColor = '#4caf50';
                      }}
                    >
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
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>🎥 My Consultations</h2>
        {consultations.length === 0 ? (
          <div style={styles.noData}>
            <p style={styles.emptyIcon}>📅</p>
            <p>No consultations scheduled.</p>
            <button 
              onClick={() => navigate('/video-consult')}
              style={{ 
                backgroundColor: '#4caf50', 
                color: 'white', 
                padding: '10px 20px', 
                border: 'none', 
                borderRadius: '5px', 
                cursor: 'pointer',
                marginTop: '10px'
              }}
            >
              Book a Consultation
            </button>
          </div>
        ) : (
          consultations.map((consult) => {
            const statusStyle = getStatusBadge(consult.status);
            return (
              <div key={consult.id} style={styles.consultItem}>
                <div>
                  <div style={styles.consultDate}>📅 {consult.scheduled_date}</div>
                  <div style={{ fontSize: '14px', color: '#666' }}>
                    Status: <span style={{ ...styles.scanStatus, ...statusStyle }}>
                      {consult.status === 'pending_payment' ? '⏳ Payment Pending' : consult.status}
                    </span>
                  </div>
                </div>
                {consult.zoom_link && consult.status === 'scheduled' && (
                  <a 
                    href={consult.zoom_link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{
                      backgroundColor: '#1976d2',
                      color: 'white',
                      padding: '8px 15px',
                      borderRadius: '5px',
                      textDecoration: 'none',
                      fontSize: '14px'
                    }}
                  >
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

