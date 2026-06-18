import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API_URL from './apiConfig';

function UploadPage() {
  const [user, setUser] = useState(null);
  const [file, setFile] = useState(null);
  const [scanType, setScanType] = useState('xray');
  const [bodyPart, setBodyPart] = useState('');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [preview, setPreview] = useState(null);
  const [scans, setScans] = useState([]);
  const [loadingScans, setLoadingScans] = useState(false);
  const navigate = useNavigate();

  // Check if user is logged in
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
    } else {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      fetchMyScans(parsedUser);
    }
  }, [navigate]);

  // Fetch user's uploaded scans
  const fetchMyScans = async (userData) => {
    setLoadingScans(true);
    try {
      const response = await fetch(`${API_URL}/my-scans/?username=${userData.username}`);
      const data = await response.json();
      console.log('📥 My scans:', data);
      if (data.scans) {
        setScans(data.scans);
      }
    } catch (error) {
      console.error('Error fetching scans:', error);
    } finally {
      setLoadingScans(false);
    }
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    
    // Create preview
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
    setMessage('');
  };

  // Handle upload submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setMessage({ type: 'error', text: '❌ Please login first to upload scans' });
      return;
    }
    
    if (!file) {
      setMessage({ type: 'error', text: '❌ Please select a file to upload' });
      return;
    }

    if (!bodyPart) {
      setMessage({ type: 'error', text: '❌ Please select body part' });
      return;
    }

    setUploading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('image_file', file);
    formData.append('scan_type', scanType);
    formData.append('body_part', bodyPart);
    formData.append('description', description);
    formData.append('username', user.username);

    console.log('📤 Uploading scan for user:', user.username);
    console.log('📤 File:', file.name);
    console.log('📤 Scan Type:', scanType);
    console.log('📤 Body Part:', bodyPart);

    try {
      const response = await fetch(`${API_URL}/upload/`, {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      console.log('📤 Upload response:', data);
      
      if (response.ok && data.success) {
        setMessage({ type: 'success', text: '✅ Scan uploaded successfully! Dr. Jimmy will review it soon.' });
        // Reset form
        setFile(null);
        setBodyPart('');
        setDescription('');
        setPreview(null);
        document.getElementById('file-input').value = '';
        // Refresh scans list
        fetchMyScans(user);
      } else {
        setMessage({ type: 'error', text: `❌ Upload failed: ${data.error || 'Please try again'}` });
      }
    } catch (error) {
      console.error('Upload error:', error);
      setMessage({ type: 'error', text: '❌ Cannot connect to server. Please make sure backend is running.' });
    } finally {
      setUploading(false);
    }
  };

  // Get image URL from backend
  const getImageUrl = (scan) => {
    if (!scan) return null;
    
    if (scan.image_url) {
      if (scan.image_url.startsWith('http')) {
        return scan.image_url;
      }
      const backendBase = API_URL.replace('/api', '');
      return `${backendBase}${scan.image_url}`;
    }
    
    if (scan.image) {
      const backendBase = API_URL.replace('/api', '');
      if (scan.image.startsWith('/media/')) {
        return `${backendBase}${scan.image}`;
      }
      return `${backendBase}/media/${scan.image}`;
    }
    
    return null;
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
      background: 'linear-gradient(135deg, #1976d2 0%, #0d47a1 100%)',
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
    grid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '30px'
    },
    formCard: {
      background: 'white',
      border: '1px solid #e0e0e0',
      borderRadius: '15px',
      padding: '25px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
    },
    formTitle: {
      color: '#1976d2',
      marginTop: 0
    },
    formGroup: {
      marginBottom: '20px'
    },
    label: {
      display: 'block',
      fontWeight: 'bold',
      marginBottom: '8px',
      color: '#333'
    },
    select: {
      width: '100%',
      padding: '12px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      fontSize: '16px'
    },
    textarea: {
      width: '100%',
      padding: '12px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      fontSize: '14px',
      fontFamily: 'inherit',
      resize: 'vertical',
      minHeight: '80px'
    },
    fileArea: {
      border: '2px dashed #ddd',
      borderRadius: '10px',
      padding: '20px',
      textAlign: 'center',
      backgroundColor: '#fafafa'
    },
    fileLabel: {
      display: 'inline-block',
      backgroundColor: '#1976d2',
      color: 'white',
      padding: '10px 20px',
      borderRadius: '8px',
      cursor: 'pointer',
      marginBottom: '10px'
    },
    fileInput: {
      display: 'none'
    },
    fileName: {
      color: '#4caf50',
      marginTop: '10px'
    },
    fileHint: {
      fontSize: '12px',
      color: '#999',
      marginTop: '10px'
    },
    previewImage: {
      maxWidth: '100%',
      maxHeight: '200px',
      borderRadius: '8px',
      border: '1px solid #ddd',
      marginBottom: '10px'
    },
    submitBtn: {
      width: '100%',
      backgroundColor: '#4caf50',
      color: 'white',
      padding: '14px',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'background 0.3s'
    },
    submitBtnDisabled: {
      opacity: 0.6,
      cursor: 'not-allowed'
    },
    message: {
      marginTop: '20px',
      padding: '15px',
      borderRadius: '8px',
      fontSize: '14px'
    },
    successMessage: {
      backgroundColor: '#d4edda',
      color: '#155724',
      borderLeft: '4px solid #4caf50'
    },
    errorMessage: {
      backgroundColor: '#f8d7da',
      color: '#721c24',
      borderLeft: '4px solid #f44336'
    },
    historyCard: {
      background: 'white',
      border: '1px solid #e0e0e0',
      borderRadius: '15px',
      padding: '25px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
    },
    scanItem: {
      border: '1px solid #eee',
      borderRadius: '10px',
      padding: '15px',
      marginBottom: '15px',
      backgroundColor: '#f8f9fa'
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
    statusPending: {
      backgroundColor: '#fff3e0',
      color: '#ff9800'
    },
    statusReviewed: {
      backgroundColor: '#e8f5e9',
      color: '#4caf50'
    },
    scanBody: {
      color: '#666',
      fontSize: '14px',
      marginTop: '5px'
    },
    scanDiagnosis: {
      marginTop: '10px',
      padding: '10px',
      backgroundColor: 'white',
      borderRadius: '5px',
      fontSize: '13px'
    },
    noScans: {
      textAlign: 'center',
      padding: '60px 20px',
      backgroundColor: '#f5f5f5',
      borderRadius: '10px',
      color: '#999'
    },
    infoBox: {
      marginTop: '30px',
      padding: '20px',
      backgroundColor: '#e3f2fd',
      borderRadius: '10px',
      textAlign: 'center'
    },
    viewImageBtn: {
      display: 'inline-block',
      backgroundColor: '#9c27b0',
      color: 'white',
      padding: '5px 15px',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '12px',
      marginTop: '10px'
    }
  };

  if (!user) {
    return (
      <div style={{ maxWidth: '600px', margin: '100px auto', padding: '40px', textAlign: 'center', backgroundColor: '#f8d7da', borderRadius: '10px' }}>
        <h2 style={{ color: '#721c24' }}>🔒 Access Denied</h2>
        <p>Please login first to upload medical scans.</p>
        <button onClick={() => navigate('/login')} style={{ backgroundColor: '#1976d2', color: 'white', padding: '12px 24px', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '20px' }}>
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>📤 Upload Medical Scan</h1>
        <p style={styles.headerSub}>Welcome back, {user.first_name || user.username}! Upload your MRI, X-Ray, or CT-Scan for Dr. Jimmy to review.</p>
      </div>

      {message && (
        <div style={{ ...styles.message, ...(message.type === 'success' ? styles.successMessage : styles.errorMessage) }}>
          {message.text}
        </div>
      )}

      <div style={styles.grid}>
        {/* Upload Form */}
        <div style={styles.formCard}>
          <h2 style={styles.formTitle}>New Scan</h2>
          
          <form onSubmit={handleSubmit}>
            {/* Scan Type */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Scan Type *</label>
              <select
                value={scanType}
                onChange={(e) => setScanType(e.target.value)}
                style={styles.select}
                required
              >
                <option value="xray">X-Ray (Radiograph)</option>
                <option value="mri">MRI (Magnetic Resonance Imaging)</option>
                <option value="ct">CT-Scan (Computed Tomography)</option>
                <option value="ultrasound">Ultrasound</option>
              </select>
            </div>

            {/* Body Part */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Body Part *</label>
              <select
                value={bodyPart}
                onChange={(e) => setBodyPart(e.target.value)}
                style={styles.select}
                required
              >
                <option value="">Select body part</option>
                <option value="Cervical Spine (Neck)">Cervical Spine (Neck)</option>
                <option value="Thoracic Spine (Upper Back)">Thoracic Spine (Upper Back)</option>
                <option value="Lumbar Spine (Lower Back)">Lumbar Spine (Lower Back)</option>
                <option value="Shoulder">Shoulder</option>
                <option value="Knee">Knee</option>
                <option value="Hip">Hip</option>
                <option value="Elbow">Elbow</option>
                <option value="Wrist">Wrist</option>
                <option value="Ankle">Ankle</option>
                <option value="Foot">Foot</option>
                <option value="Hand">Hand</option>
              </select>
            </div>

            {/* Description */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Symptoms & Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your symptoms, when the pain started, any previous treatments..."
                style={styles.textarea}
                rows="4"
              />
            </div>

            {/* File Upload */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Upload Image *</label>
              <div style={styles.fileArea}>
                <input
                  id="file-input"
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*"
                  style={styles.fileInput}
                  required
                />
                <label htmlFor="file-input" style={styles.fileLabel}>
                  📁 Choose File
                </label>
                {file && (
                  <div style={styles.fileName}>
                    ✅ Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </div>
                )}
                <p style={styles.fileHint}>Supported formats: JPG, PNG, JPEG, DICOM. Max size: 50MB</p>
              </div>
            </div>

            {/* Preview */}
            {preview && (
              <div style={styles.formGroup}>
                <label style={styles.label}>Preview</label>
                <img src={preview} alt="Preview" style={styles.previewImage} />
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={uploading}
              style={{
                ...styles.submitBtn,
                ...(uploading ? styles.submitBtnDisabled : {})
              }}
            >
              {uploading ? '⏳ Uploading...' : '🚀 Upload Scan for Review'}
            </button>
          </form>

          {/* Info Box */}
          <div style={styles.infoBox}>
            <h4 style={{ margin: 0, color: '#1976d2' }}>📋 What happens next?</h4>
            <p style={{ margin: '10px 0 0 0', fontSize: '14px' }}>
              Dr. Jimmy will review your scan within 24-48 hours. You will receive a diagnosis and recommendations.
              Check your dashboard for updates.
            </p>
          </div>
        </div>

        {/* My Scans History */}
        <div style={styles.historyCard}>
          <h2 style={styles.formTitle}>📋 My Scans</h2>
          
          {loadingScans ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div>Loading your scans...</div>
            </div>
          ) : scans.length === 0 ? (
            <div style={styles.noScans}>
              <div style={{ fontSize: '48px', marginBottom: '10px' }}>📭</div>
              <p>No scans uploaded yet.</p>
              <p style={{ fontSize: '14px', color: '#666' }}>Upload your first scan using the form above.</p>
            </div>
          ) : (
            <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
              {scans.map((scan) => {
                const imageUrl = getImageUrl(scan);
                return (
                  <div key={scan.id} style={styles.scanItem}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                      <span style={styles.scanType}>{scan.scan_type}</span>
                      <span style={{ ...styles.scanStatus, ...(scan.status === 'pending' ? styles.statusPending : styles.statusReviewed) }}>
                        {scan.status === 'pending' ? '⏳ Pending' : '✅ Reviewed'}
                      </span>
                    </div>
                    <div style={styles.scanBody}>
                      📍 {scan.body_part}
                      <br />
                      📅 {scan.uploaded_at}
                    </div>
                    {scan.description && (
                      <div style={styles.scanBody}>
                        📝 {scan.description}
                      </div>
                    )}
                    {imageUrl && (
                      <button
                        onClick={() => window.open(imageUrl, '_blank')}
                        style={styles.viewImageBtn}
                      >
                        🖼️ View Image
                      </button>
                    )}
                    {scan.diagnosis && (
                      <div style={styles.scanDiagnosis}>
                        <strong>Diagnosis:</strong> {scan.diagnosis}
                        {scan.recommendations && (
                          <>
                            <br />
                            <strong>Recommendations:</strong> {scan.recommendations}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UploadPage;