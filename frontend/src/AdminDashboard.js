import API_URL from './apiConfig';
import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

function AdminDashboard() {
  const { user } = useAuth();
  const [patients, setPatients] = useState([]);
  const [scans, setScans] = useState([]);
  const [selectedScan, setSelectedScan] = useState(null);
  const [diagnosis, setDiagnosis] = useState('');
  const [recommendations, setRecommendations] = useState('');

  useEffect(() => {
    fetchPatients();
    fetchAllScans();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await fetch(${API_URL}/patients/');
      const data = await response.json();
      setPatients(data.patients || []);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const fetchAllScans = async () => {
    // For admin, fetch all scans from all patients
    try {
      const response = await fetch(${API_URL}/my-scans/?username=admin');
      const data = await response.json();
      setScans(data.scans || []);
    } catch (error) {
      console.error('Error fetching scans:', error);
    }
  };

  const updateScan = async (scanId) => {
  try {
    const response = await fetch(${API_URL}/update-scan/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        scan_id: scanId,
        diagnosis: diagnosis,
        recommendations: recommendations,
        status: 'reviewed'
      })
    });
    
    if (response.ok) {
      alert('✅ Scan reviewed successfully! Email notification sent to patient.');
      fetchAllScans();
      setSelectedScan(null);
      setDiagnosis('');
      setRecommendations('');
    }
  } catch (error) {
    console.error('Error updating scan:', error);
    alert('❌ Error updating scan');
  }
};
  if (!user?.is_staff) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h2>Access Denied</h2>
        <p>This page is only accessible by doctors and administrators.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '50px auto', padding: '20px' }}>
      <h1 style={{ color: '#1976d2' }}>Admin Dashboard - Dr. Jimmy</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '30px' }}>
        <div style={{ backgroundColor: '#e3f2fd', padding: '20px', borderRadius: '10px' }}>
          <h3>📊 Statistics</h3>
          <p>Total Patients: {patients.length}</p>
          <p>Total Scans: {scans.length}</p>
          <p>Pending Reviews: {scans.filter(s => s.status === 'Pending Review').length}</p>
        </div>
        
        <div style={{ backgroundColor: '#e8f5e9', padding: '20px', borderRadius: '10px' }}>
          <h3>👥 Patient List</h3>
          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {patients.map(patient => (
              <div key={patient.id} style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                <strong>{patient.name}</strong> - {patient.scan_count} scans
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <h2 style={{ marginTop: '40px' }}>📋 Pending Scan Reviews</h2>
      <div style={{ display: 'grid', gap: '20px', marginTop: '20px' }}>
        {scans.filter(s => s.status === 'Pending Review').map((scan) => (
          <div key={scan.id} style={{ border: '1px solid #ddd', borderRadius: '10px', padding: '20px' }}>
            <div>
              <h3>{scan.scan_type} - {scan.body_part}</h3>
              <p>Patient: {scan.patient_name || 'Unknown'}</p>
              <p>Uploaded: {scan.uploaded_at}</p>
            </div>
            
            {selectedScan === scan.id ? (
              <div style={{ marginTop: '15px' }}>
                <textarea 
                  placeholder="Diagnosis..."
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
                  rows="3"
                />
                <textarea 
                  placeholder="Recommendations..."
                  value={recommendations}
                  onChange={(e) => setRecommendations(e.target.value)}
                  style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
                  rows="3"
                />
                <button onClick={() => updateScan(scan.id)} style={{ backgroundColor: '#4caf50', color: 'white', padding: '10px', marginRight: '10px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                  Submit Review
                </button>
                <button onClick={() => setSelectedScan(null)} style={{ backgroundColor: '#999', color: 'white', padding: '10px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                  Cancel
                </button>
              </div>
            ) : (
              <button onClick={() => setSelectedScan(scan.id)} style={{ backgroundColor: '#1976d2', color: 'white', padding: '10px', marginTop: '10px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                Review Scan
              </button>
            )}
          </div>
        ))}
        
        {scans.filter(s => s.status === 'Pending Review').length === 0 && (
          <p style={{ textAlign: 'center', padding: '40px', backgroundColor: '#f5f5f5', borderRadius: '10px' }}>
            No pending scans to review ✓
          </p>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
