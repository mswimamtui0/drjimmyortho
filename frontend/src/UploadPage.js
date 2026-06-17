import API_URL from './apiConfig';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
    console.log('User data from localStorage:', userData);
    
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
      const response = await fetch(`http://localhost:8000/api/my-scans/?username=${userData.username}`);
      const data = await response.json();
      console.log('Fetched scans:', data);
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
    
    // Get fresh user data from localStorage
    const userData = JSON.parse(localStorage.getItem('user'));
    
    if (!userData) {
      setMessage({ type: 'error', text: 'Please login first' });
      navigate('/login');
      return;
    }
    
    if (!file) {
      setMessage({ type: 'error', text: 'Please select a file to upload' });
      return;
    }

    if (!bodyPart) {
      setMessage({ type: 'error', text: 'Please select body part' });
      return;
    }

    setUploading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('image_file', file);
    formData.append('scan_type', scanType);
    formData.append('body_part', bodyPart);
    formData.append('description', description);
    formData.append('username', userData.username);

    console.log('Uploading for user:', userData.username);
    console.log('Scan type:', scanType);
    console.log('Body part:', bodyPart);
    console.log('File:', file.name);

    try {
      const response = await fetch(${API_URL}/upload/', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      console.log('Server response:', data);
      
      if (response.ok && data.success) {
        setMessage({ type: 'success', text: '✅ Scan uploaded successfully! Dr. Jimmy will review it soon.' });
        // Reset form
        setFile(null);
        setBodyPart('');
        setDescription('');
        setPreview(null);
        // Reset file input
        const fileInput = document.getElementById('file-input');
        if (fileInput) fileInput.value = '';
        // Refresh scans list
        fetchMyScans(userData);
      } else {
        setMessage({ type: 'error', text: `❌ Upload failed: ${data.error || 'Please try again'}` });
      }
    } catch (error) {
      console.error('Upload error:', error);
      setMessage({ type: 'error', text: '❌ Cannot connect to server. Please make sure backend is running on port 8000' });
    } finally {
      setUploading(false);
    }
  };

  if (!user) {
    return (
      <div style={{ 
        maxWidth: '600px', 
        margin: '100px auto', 
        padding: '40px',
        textAlign: 'center',
        backgroundColor: '#f8d7da',
        borderRadius: '10px'
      }}>
        <h2 style={{ color: '#721c24' }}>🔒 Access Denied</h2>
        <p>Please login first to upload medical scans.</p>
        <button 
          onClick={() => navigate('/login')}
          style={{
            backgroundColor: '#1976d2',
            color: 'white',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginTop: '20px'
          }}
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '40px 20px',
      fontFamily: 'Segoe UI, Arial, sans-serif'
    }}>
      {/* Welcome Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1976d2 0%, #0d47a1 100%)',
        color: 'white',
        padding: '30px',
        borderRadius: '15px',
        marginBottom: '30px'
      }}>
        <h1 style={{ margin: 0 }}>📤 Upload Medical Scan</h1>
        <p style={{ margin: '10px 0 0 0', opacity: 0.9 }}>
          Welcome back, {user.first_name || user.username}! Upload your MRI, X-Ray, or CT-Scan for Dr. Jimmy to review.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '30px'
      }}>
        {/* Upload Form */}
        <div style={{
          background: 'white',
          border: '1px solid #e0e0e0',
          borderRadius: '15px',
          padding: '25px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
        }}>
          <h2 style={{ color: '#1976d2', marginTop: 0 }}>New Scan</h2>
          
          <form onSubmit={handleSubmit}>
            {/* Scan Type */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                Scan Type *
              </label>
              <select
                value={scanType}
                onChange={(e) => setScanType(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '16px'
                }}
                required
              >
                <option value="xray">X-Ray (Radiograph)</option>
                <option value="mri">MRI (Magnetic Resonance Imaging)</option>
                <option value="ct">CT-Scan (Computed Tomography)</option>
              </select>
            </div>

            {/* Body Part */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                Body Part *
              </label>
              <select
                value={bodyPart}
                onChange={(e) => setBodyPart(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '16px'
                }}
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
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                Symptoms & Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your symptoms, when the pain started, any previous treatments..."
                rows="4"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  resize: 'vertical'
                }}
              />
            </div>

            {/* File Upload */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                Upload Image *
              </label>
              <div style={{
                border: '2px dashed #ddd',
                borderRadius: '10px',
                padding: '20px',
                textAlign: 'center',
                backgroundColor: '#fafafa'
              }}>
                <input
                  id="file-input"
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*"
                  style={{ display: 'none' }}
                  required
                />
                <label htmlFor="file-input" style={{
                  display: 'inline-block',
                  backgroundColor: '#1976d2',
                  color: 'white',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  marginBottom: '10px'
                }}>
                  📁 Choose File
                </label>
                {file && (
                  <div style={{ marginTop: '10px' }}>
                    <span style={{ color: '#4caf50' }}>✓ Selected: {file.name}</span>
                    <br />
                    <span style={{ fontSize: '12px', color: '#666' }}>
                      ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>
                )}
                <p style={{ fontSize: '12px', color: '#999', marginTop: '10px' }}>
                  Supported formats: JPG, PNG, JPEG. Max size: 50MB
                </p>
              </div>
            </div>

            {/* Preview */}
            {preview && (
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                  Preview
                </label>
                <img src={preview} alt="Preview" style={{
                  maxWidth: '100%',
                  maxHeight: '200px',
                  borderRadius: '8px',
                  border: '1px solid #ddd'
                }} />
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={uploading}
              style={{
                width: '100%',
                backgroundColor: uploading ? '#ccc' : '#4caf50',
                color: 'white',
                padding: '14px',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: uploading ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.3s'
              }}
            >
              {uploading ? '⏳ Uploading...' : '🚀 Upload Scan for Review'}
            </button>

            {/* Message */}
            {message && (
              <div style={{
                marginTop: '20px',
                padding: '15px',
                backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da',
                color: message.type === 'success' ? '#155724' : '#721c24',
                borderRadius: '8px',
                borderLeft: `4px solid ${message.type === 'success' ? '#4caf50' : '#f44336'}`
              }}>
                {message.text}
              </div>
            )}
          </form>
        </div>

        {/* My Scans History */}
        <div style={{
          background: 'white',
          border: '1px solid #e0e0e0',
          borderRadius: '15px',
          padding: '25px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
        }}>
          <h2 style={{ color: '#1976d2', marginTop: 0 }}>📋 My Scans</h2>
          
          {loadingScans ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div>Loading your scans...</div>
            </div>
          ) : scans.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              backgroundColor: '#f5f5f5',
              borderRadius: '10px'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '10px' }}>📭</div>
              <p>No scans uploaded yet.</p>
              <p style={{ fontSize: '14px', color: '#666' }}>Upload your first scan using the form</p>
            </div>
          ) : (
            <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
              {scans.map((scan) => (
                <div key={scan.id} style={{
                  border: '1px solid #eee',
                  borderRadius: '10px',
                  padding: '15px',
                  marginBottom: '15px',
                  backgroundColor: scan.status === 'pending' ? '#fff3e0' : '#e8f5e9'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <strong style={{ color: '#1976d2' }}>{scan.scan_type}</strong>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      backgroundColor: scan.status === 'pending' ? '#ff9800' : '#4caf50',
                      color: 'white'
                    }}>
                      {scan.status === 'pending' ? 'Pending Review' : 'Reviewed'}
                    </span>
                  </div>
                  <div style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>
                    📍 {scan.body_part}
                  </div>
                  <div style={{ fontSize: '12px', color: '#999' }}>
                    📅 {scan.uploaded_at}
                  </div>
                  {scan.diagnosis && (
                    <div style={{
                      marginTop: '10px',
                      padding: '10px',
                      backgroundColor: 'white',
                      borderRadius: '5px',
                      fontSize: '13px'
                    }}>
                      <strong>Diagnosis:</strong> {scan.diagnosis}
                    </div>
                  )}
                  {scan.recommendations && (
                    <div style={{
                      marginTop: '5px',
                      padding: '10px',
                      backgroundColor: 'white',
                      borderRadius: '5px',
                      fontSize: '13px'
                    }}>
                      <strong>Recommendations:</strong> {scan.recommendations}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Info Box */}
      <div style={{
        marginTop: '30px',
        padding: '20px',
        backgroundColor: '#e3f2fd',
        borderRadius: '10px',
        textAlign: 'center'
      }}>
        <h4 style={{ margin: 0, color: '#1976d2' }}>📋 What happens next?</h4>
        <p style={{ margin: '10px 0 0 0', fontSize: '14px' }}>
          Dr. Jimmy will review your scan within 24-48 hours. You will receive a diagnosis and recommendations.
          Check back here or in your email for updates.
        </p>
      </div>
    </div>
  );
}

export default UploadPage;
