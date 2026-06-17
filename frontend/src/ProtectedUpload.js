import API_URL from './apiConfig';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function ProtectedUpload() {
  const [user, setUser] = useState(null);
  const [file, setFile] = useState(null);
  const [scanType, setScanType] = useState('xray');
  const [bodyPart, setBodyPart] = useState('');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
    } else {
      setUser(JSON.parse(userData));
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage('Please select a file');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('image_file', file);
    formData.append('scan_type', scanType);
    formData.append('body_part', bodyPart);
    formData.append('description', description);
    formData.append('username', user.username);

    try {
      const response = await fetch(${API_URL}/upload/', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessage('✅ Scan uploaded successfully! Dr. Jimmy will review it.');
        setFile(null);
        setBodyPart('');
        setDescription('');
        document.getElementById('file-input').value = '';
      } else {
        setMessage('❌ Upload failed: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      setMessage('❌ Cannot connect to server');
    } finally {
      setUploading(false);
    }
  };

  if (!user) return null;

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px' }}>
      <h1>Upload Medical Scan</h1>
      <p>Welcome, {user.first_name || user.username}!</p>
      
      <form onSubmit={handleSubmit}>
        <div>
          <label>Scan Type:</label>
          <select value={scanType} onChange={(e) => setScanType(e.target.value)}>
            <option value="xray">X-Ray</option>
            <option value="mri">MRI</option>
            <option value="ct">CT-Scan</option>
          </select>
        </div>
        
        <div>
          <label>Body Part:</label>
          <input type="text" value={bodyPart} onChange={(e) => setBodyPart(e.target.value)} required />
        </div>
        
        <div>
          <label>Description:</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows="3" />
        </div>
        
        <div>
          <input type="file" onChange={(e) => setFile(e.target.files[0])} required />
        </div>
        
        <button type="submit" disabled={uploading}>
          {uploading ? 'Uploading...' : 'Upload Scan'}
        </button>
      </form>
      
      {message && <p>{message}</p>}
    </div>
  );
}

export default ProtectedUpload;

