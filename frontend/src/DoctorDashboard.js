import React, { useState, useEffect } from 'react';
import './DoctorDashboard.css';

function DoctorDashboard() {
  // State variables
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedScan, setSelectedScan] = useState(null);
  const [diagnosis, setDiagnosis] = useState('');
  const [recommendations, setRecommendations] = useState('');
  const [doctorNotes, setDoctorNotes] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // Search and Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Prescription
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [medications, setMedications] = useState([]);
  const [newMedication, setNewMedication] = useState({ 
    name: '', 
    dosage: '', 
    frequency: '', 
    duration: '' 
  });
  
  // Image View
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageTitle, setSelectedImageTitle] = useState('');
  const [imageLoading, setImageLoading] = useState(true);
  
  // Prescription loading state
  const [prescriptionLoading, setPrescriptionLoading] = useState(false);

  // Dashboard stats
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalPending: 0,
    totalScans: 0,
    patientsNeedingReview: 0
  });

  useEffect(() => {
    fetchDashboard();
  }, []);

  // ============ FETCH DASHBOARD ============
  const fetchDashboard = async () => {
    try {
      setLoading(true);
      
      const response = await fetch('http://localhost:8000/api/doctor/dashboard/');
      const data = await response.json();
      
      if (data.success) {
        setPatients(data.patients || []);
        updateStats(data.patients || []);
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to load dashboard' });
        setPatients([]);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setMessage({ type: 'error', text: 'Failed to connect to server' });
      setPatients([]);
    } finally {
      setLoading(false);
    }
  };

  const updateStats = (patientsData) => {
    const total = patientsData.length;
    const pending = patientsData.reduce((sum, p) => sum + (p.pending_scans || 0), 0);
    const scans = patientsData.reduce((sum, p) => sum + (p.total_scans || 0), 0);
    const needReview = patientsData.filter(p => p.pending_scans > 0).length;
    
    setStats({
      totalPatients: total,
      totalPending: pending,
      totalScans: scans,
      patientsNeedingReview: needReview
    });
  };

  // ============ SEARCH ============
  const handleSearch = async (query) => {
    setSearchQuery(query);
    
    if (query.length < 2) {
      fetchDashboard();
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:8000/api/doctor/search-patients/?q=${query}`);
      const data = await response.json();
      
      if (data.patients) {
        setPatients(data.patients);
        updateStats(data.patients);
      } else {
        setPatients([]);
      }
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  // ============ UPDATE SCAN ============
  const updateScan = async (scanId) => {
    if (!diagnosis.trim()) {
      setMessage({ type: 'error', text: 'Please enter a diagnosis before submitting' });
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/doctor/update-scan/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scan_id: scanId,
          diagnosis: diagnosis,
          recommendations: recommendations,
          doctor_notes: doctorNotes,
          status: 'reviewed'
        })
      });
      
      if (response.ok) {
        await sendEmailNotification(selectedPatient.patient_id, scanId);
        
        setMessage({ 
          type: 'success', 
          text: '✅ Scan reviewed successfully! Patient notified via Email.' 
        });
        
        fetchDashboard();
        setSelectedScan(null);
        setDiagnosis('');
        setRecommendations('');
        setDoctorNotes('');
        
        setTimeout(() => setMessage({ type: '', text: '' }), 5000);
      } else {
        const data = await response.json();
        setMessage({ type: 'error', text: data.error || 'Failed to update scan' });
      }
    } catch (error) {
      console.error('Update error:', error);
      setMessage({ type: 'error', text: '❌ Error updating scan. Please try again.' });
    }
  };

  // ============ EMAIL NOTIFICATION ============
  const sendEmailNotification = async (patientId, scanId) => {
    try {
      await fetch('http://localhost:8000/api/doctor/send-email/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient_id: patientId,
          scan_id: scanId
        })
      });
    } catch (error) {
      console.error('Email error:', error);
    }
  };

  // ============ GENERATE PRESCRIPTION ============
  const generatePrescription = async () => {
    if (!selectedPatient) {
      setMessage({ type: 'error', text: 'No patient selected' });
      return;
    }

    if (!diagnosis || diagnosis.trim() === '') {
      setMessage({ type: 'error', text: 'Please enter a diagnosis first' });
      return;
    }

    const prescriptionData = {
      patient_id: selectedPatient.patient_id,
      patient_name: selectedPatient.patient_name || selectedPatient.username || 'Unknown',
      patient_email: selectedPatient.email || '',
      diagnosis: diagnosis.trim(),
      recommendations: recommendations.trim() || 'No specific recommendations',
      medications: medications.map(med => ({
        name: med.name || '',
        dosage: med.dosage || '',
        frequency: med.frequency || 'Daily',
        duration: med.duration || '7 days'
      })),
      doctor_notes: doctorNotes.trim() || 'No additional notes'
    };

    setPrescriptionLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/doctor/generate-prescription/', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(prescriptionData)
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setMessage({ 
          type: 'success', 
          text: '✅ Prescription generated successfully!' 
        });
        setShowPrescriptionModal(false);
        setMedications([]);
        setPrescriptionLoading(false);
        setTimeout(() => setMessage({ type: '', text: '' }), 5000);
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to generate prescription' });
        setPrescriptionLoading(false);
      }
    } catch (error) {
      console.error('Prescription error:', error);
      setMessage({ type: 'error', text: '❌ Error generating prescription. Please try again.' });
      setPrescriptionLoading(false);
    }
  };

  // ============ MEDICATION FUNCTIONS ============
  const addMedication = () => {
    if (newMedication.name && newMedication.dosage) {
      const medWithId = { 
        ...newMedication, 
        id: Date.now(),
        name: newMedication.name.trim(),
        dosage: newMedication.dosage.trim(),
        frequency: newMedication.frequency.trim() || 'Daily',
        duration: newMedication.duration.trim() || '7 days'
      };
      setMedications([...medications, medWithId]);
      setNewMedication({ name: '', dosage: '', frequency: '', duration: '' });
    } else {
      setMessage({ type: 'error', text: 'Please enter medication name and dosage' });
    }
  };

  const removeMedication = (id) => {
    setMedications(medications.filter(med => med.id !== id));
  };

  // ============ VIEW IMAGE - FIXED WITH BACKEND URL ============
  const handleViewImage = (scan) => {
    console.log("🖼️ Viewing image for scan:", scan);
    
    let imageUrl = null;
    
    // Check different ways the image URL might be stored
    if (scan.image_url) {
      // If image_url already has full URL, use it
      if (scan.image_url.startsWith('http')) {
        imageUrl = scan.image_url;
      } else {
        // Otherwise, prepend the backend URL (port 8000)
        imageUrl = `http://localhost:8000${scan.image_url}`;
      }
    } else if (scan.image) {
      // If image is just the path, prepend backend URL
      if (scan.image.startsWith('/media/')) {
        imageUrl = `http://localhost:8000${scan.image}`;
      } else {
        imageUrl = `http://localhost:8000/media/${scan.image}`;
      }
    } else {
      // Try to construct from scan ID (fallback)
      imageUrl = `http://localhost:8000/media/patient_scans/${scan.id}/`;
    }
    
    console.log("📸 Full Image URL (backend):", imageUrl);
    
    setSelectedImage(imageUrl);
    setSelectedImageTitle(`${scan.scan_type} - ${scan.body_part}`);
    setImageLoading(true);
    setShowImageModal(true);
  };

  // ============ GET FILTERED SCANS ============
  const getFilteredScans = () => {
    if (!selectedPatient) return [];
    let scans = selectedPatient.scans || [];
    if (filterStatus === 'pending') {
      return scans.filter(s => s.status === 'pending');
    } else if (filterStatus === 'reviewed') {
      return scans.filter(s => s.status === 'reviewed');
    }
    return scans;
  };

  const filteredScans = getFilteredScans();

  // ============ LOADING SCREEN ============
  if (loading) {
    return (
      <div className="doctor-loading">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  // ============ RENDER ============
  return (
    <div className="doctor-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <h1>👨‍⚕️ Dr. Jimmy - Medical Dashboard</h1>
        <p>Manage patients, review scans, and conduct video consultations</p>
      </div>

      {/* Message */}
      {message.text && (
        <div className={`alert ${message.type}`}>
          {message.text}
        </div>
      )}

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-icon">👥</div>
          <div className="stat-number">{stats.totalPatients}</div>
          <div className="stat-label">Total Patients</div>
        </div>
        <div className="stat-card orange">
          <div className="stat-icon">⏳</div>
          <div className="stat-number">{stats.totalPending}</div>
          <div className="stat-label">Pending Reviews</div>
        </div>
        <div className="stat-card green">
          <div className="stat-icon">🩻</div>
          <div className="stat-number">{stats.totalScans}</div>
          <div className="stat-label">Total Scans</div>
        </div>
        <div className="stat-card red">
          <div className="stat-icon">🔴</div>
          <div className="stat-number">{stats.patientsNeedingReview}</div>
          <div className="stat-label">Patients Needing Review</div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="search-container">
        <div className="search-wrapper">
          <input
            type="text"
            placeholder="🔍 Search patients by name, email, or username..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="search-input"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">📋 All Scans</option>
            <option value="pending">⏳ Pending Only</option>
            <option value="reviewed">✅ Reviewed Only</option>
          </select>
        </div>
      </div>

      {/* Main Grid */}
      <div className="dashboard-grid">
        {/* Patients Sidebar */}
        <div className="patients-sidebar">
          <h3>📋 Patients List</h3>
          <div className="patients-list">
            {patients.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#999', padding: '20px' }}>
                No patients found.
              </p>
            ) : (
              patients.map(patient => (
                <div
                  key={patient.patient_id}
                  onClick={() => { setSelectedPatient(patient); setSelectedScan(null); }}
                  className={`patient-item ${selectedPatient?.patient_id === patient.patient_id ? 'active' : ''}`}
                >
                  <div className="patient-name">{patient.patient_name}</div>
                  <div className="patient-email">{patient.email}</div>
                  <div className="patient-stats">
                    📄 {patient.total_scans || 0} scans | ⏳ {patient.pending_scans || 0} pending
                    {(patient.pending_scans || 0) > 0 && (
                      <span className="pending-badge">{patient.pending_scans}</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Patient Details */}
        <div className="patient-details-area">
          {selectedPatient ? (
            <>
              <div className="patient-header">
                <div>
                  <h2>{selectedPatient.patient_name}</h2>
                  <div className="patient-info">
                    <span>📧 {selectedPatient.email}</span>
                    <span>📞 {selectedPatient.phone || 'No phone'}</span>
                    <span>🆔 ID: {selectedPatient.patient_id}</span>
                    <span>📅 Joined: {selectedPatient.date_joined}</span>
                  </div>
                </div>
                <div className="header-actions">
                  <button 
                    onClick={() => {
                      setShowPrescriptionModal(true);
                      setMedications([]);
                    }} 
                    className="btn-prescription"
                  >
                    📋 Prescription
                  </button>
                </div>
              </div>

              {/* Scans Section */}
              <div className="scans-section">
                <h3>Medical Scans ({filteredScans.length})</h3>
                {filteredScans.length === 0 ? (
                  <div className="no-scans">
                    <p>No scans available for this patient.</p>
                  </div>
                ) : (
                  filteredScans.map(scan => (
                    <div key={scan.id} className="scan-item">
                      <div className="scan-header">
                        <div>
                          <span className="scan-type">{scan.scan_type}</span>
                          <span className="scan-body">📍 {scan.body_part}</span>
                        </div>
                        <span className={`scan-status ${scan.status}`}>
                          {scan.status === 'pending' ? '⏳ Pending' : '✅ Reviewed'}
                        </span>
                      </div>
                      <div className="scan-meta">
                        <span>📅 {scan.uploaded_at}</span>
                      </div>
                      {scan.description && (
                        <div className="scan-description">📝 {scan.description}</div>
                      )}
                      
                      {/* View Image Button */}
                      <div className="scan-actions">
                        <button 
                          onClick={() => handleViewImage(scan)}
                          className="btn-view-image"
                        >
                          🖼️ View Image
                        </button>
                      </div>
                      
                      {selectedScan === scan.id ? (
                        <div className="scan-review-form">
                          <textarea
                            placeholder="Diagnosis..."
                            value={diagnosis}
                            onChange={(e) => setDiagnosis(e.target.value)}
                            className="diagnosis-input"
                            rows="3"
                          />
                          <textarea
                            placeholder="Recommendations..."
                            value={recommendations}
                            onChange={(e) => setRecommendations(e.target.value)}
                            className="recommendations-input"
                            rows="3"
                          />
                          <textarea
                            placeholder="Doctor's Notes..."
                            value={doctorNotes}
                            onChange={(e) => setDoctorNotes(e.target.value)}
                            className="notes-input"
                            rows="2"
                          />
                          <div className="review-actions">
                            <button onClick={() => updateScan(scan.id)} className="btn-submit-review">
                              📤 Submit & Notify
                            </button>
                            <button onClick={() => setSelectedScan(null)} className="btn-cancel-review">
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button onClick={() => setSelectedScan(scan.id)} className="btn-review">
                          {scan.status === 'pending' ? '📝 Review Scan' : '✏️ Edit Review'}
                        </button>
                      )}
                      
                      {scan.diagnosis && (
                        <div className="previous-review">
                          <div className="diagnosis-box">
                            <strong>Diagnosis:</strong> {scan.diagnosis}
                          </div>
                          <div className="recommendations-box">
                            <strong>Recommendations:</strong> {scan.recommendations}
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </>
          ) : (
            <div className="no-patient-selected">
              <div className="no-patient-icon">👨‍⚕️</div>
              <h3>Select a Patient</h3>
              <p>Choose a patient from the list to view their medical records, scans, and consultations</p>
            </div>
          )}
        </div>
      </div>

      {/* Prescription Modal */}
      {showPrescriptionModal && selectedPatient && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>📋 Generate Prescription</h2>
            <p><strong>Patient:</strong> {selectedPatient.patient_name}</p>
            <p><strong>Email:</strong> {selectedPatient.email}</p>
            
            <div className="form-group">
              <label>Diagnosis *</label>
              <textarea
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                rows="3"
                className="form-textarea"
                placeholder="Enter the diagnosis..."
                required
              />
            </div>
            
            <div className="form-group">
              <label>Recommendations</label>
              <textarea
                value={recommendations}
                onChange={(e) => setRecommendations(e.target.value)}
                rows="3"
                className="form-textarea"
                placeholder="Enter treatment recommendations..."
              />
            </div>
            
            <div className="form-group">
              <label>Doctor's Notes</label>
              <textarea
                value={doctorNotes}
                onChange={(e) => setDoctorNotes(e.target.value)}
                rows="2"
                className="form-textarea"
                placeholder="Additional notes..."
              />
            </div>
            
            <div className="form-group">
              <label>Medications</label>
              <div className="medication-grid">
                <input
                  placeholder="Medication name"
                  value={newMedication.name}
                  onChange={(e) => setNewMedication({...newMedication, name: e.target.value})}
                  className="form-input"
                />
                <input
                  placeholder="Dosage"
                  value={newMedication.dosage}
                  onChange={(e) => setNewMedication({...newMedication, dosage: e.target.value})}
                  className="form-input"
                />
                <input
                  placeholder="Frequency"
                  value={newMedication.frequency}
                  onChange={(e) => setNewMedication({...newMedication, frequency: e.target.value})}
                  className="form-input"
                />
                <input
                  placeholder="Duration"
                  value={newMedication.duration}
                  onChange={(e) => setNewMedication({...newMedication, duration: e.target.value})}
                  className="form-input"
                />
                <button onClick={addMedication} className="btn-add-medication">+</button>
              </div>
              
              {medications.length > 0 && (
                <div className="medications-list">
                  {medications.map((med) => (
                    <div key={med.id} className="medication-item">
                      <span>
                        <strong>{med.name}</strong> - {med.dosage} 
                        ({med.frequency || 'Daily'}, {med.duration || '7 days'})
                      </span>
                      <button onClick={() => removeMedication(med.id)} className="btn-remove-medication">×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="modal-actions">
              <button 
                onClick={generatePrescription} 
                className="btn-generate"
                disabled={prescriptionLoading}
              >
                {prescriptionLoading ? '⏳ Generating...' : '📄 Generate & Send'}
              </button>
              <button 
                onClick={() => { 
                  setShowPrescriptionModal(false); 
                  setMedications([]); 
                }} 
                className="btn-cancel"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============ IMAGE VIEW MODAL - FIXED ============ */}
      {showImageModal && selectedImage && (
        <div className="modal-overlay" onClick={() => setShowImageModal(false)}>
          <div className="modal-content image-modal" onClick={(e) => e.stopPropagation()}>
            <div className="image-modal-header">
              <h2>🖼️ {selectedImageTitle || 'Medical Image'}</h2>
              <button 
                onClick={() => setShowImageModal(false)} 
                className="btn-close-image"
              >
                ✕
              </button>
            </div>
            <div className="image-container">
              {imageLoading && (
                <div className="image-loading">
                  <div className="spinner"></div>
                  <p>Loading image...</p>
                </div>
              )}
              <img 
                src={selectedImage} 
                alt="Medical Scan" 
                className="modal-image"
                style={{ display: imageLoading ? 'none' : 'block' }}
                onError={(e) => {
                  console.error("❌ Image failed to load:", selectedImage);
                  e.target.src = 'https://via.placeholder.com/600x400?text=Image+Not+Available';
                  e.target.style.objectFit = 'contain';
                  e.target.style.display = 'block';
                  setImageLoading(false);
                }}
                onLoad={() => {
                  console.log("✅ Image loaded successfully:", selectedImage);
                  setImageLoading(false);
                }}
              />
            </div>
            <div className="image-modal-footer">
              <p>Click outside to close | Image may take a moment to load</p>
              <div className="image-modal-buttons">
                <button 
                  onClick={() => {
                    window.open(selectedImage, '_blank');
                  }}
                  className="btn-open-new-tab"
                >
                  📎 Open in New Tab
                </button>
                <button onClick={() => setShowImageModal(false)} className="btn-close-modal">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DoctorDashboard;