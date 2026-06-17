import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function PatientForms() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(null);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
    } else {
      setUser(JSON.parse(userData));
      setLoading(false);
    }
  }, [navigate]);

  // Form data
  const forms = [
    {
      id: 'patient_registration',
      title: 'Patient Registration Form',
      description: 'Complete this form to register as a new patient',
      category: 'Registration',
      icon: '📝',
      fields: ['Full Name', 'Date of Birth', 'Phone Number', 'Email', 'Address', 'Emergency Contact']
    },
    {
      id: 'medical_history',
      title: 'Medical History Form',
      description: 'Provide your complete medical history',
      category: 'Medical',
      icon: '📋',
      fields: ['Previous Surgeries', 'Allergies', 'Chronic Conditions', 'Current Medications', 'Family History']
    },
    {
      id: 'consent_form',
      title: 'Surgical Consent Form',
      description: 'Consent for surgical procedures',
      category: 'Legal',
      icon: '📄',
      fields: ['Patient Name', 'Procedure Details', 'Risks Acknowledged', 'Signature', 'Date']
    },
    {
      id: 'telemedicine_consent',
      title: 'Telemedicine Consent Form',
      description: 'Consent for video consultation services',
      category: 'Legal',
      icon: '📱',
      fields: ['Patient Name', 'Video Consultation Agreement', 'Privacy Acknowledgment', 'Signature']
    },
    {
      id: 'insurance_form',
      title: 'Insurance Information Form',
      description: 'Provide your insurance details',
      category: 'Insurance',
      icon: '🏥',
      fields: ['Insurance Provider', 'Policy Number', 'Group Number', 'Member ID', 'Contact']
    },
    {
      id: 'hipaa_consent',
      title: 'HIPAA Consent Form',
      description: 'Privacy and confidentiality agreement',
      category: 'Legal',
      icon: '🔒',
      fields: ['Patient Name', 'Information Release', 'Privacy Acknowledgment', 'Signature']
    }
  ];

  // ============ STYLES DEFINED BEFORE FUNCTIONS ============
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
      marginBottom: '30px',
      textAlign: 'center'
    },
    headerTitle: {
      margin: 0,
      fontSize: '2.5em'
    },
    headerSub: {
      margin: '10px 0 0 0',
      opacity: 0.9
    },
    searchBox: {
      display: 'flex',
      gap: '15px',
      marginBottom: '30px',
      flexWrap: 'wrap'
    },
    searchInput: {
      flex: 1,
      padding: '12px 20px',
      border: '2px solid #ddd',
      borderRadius: '10px',
      fontSize: '16px',
      minWidth: '200px'
    },
    categoryFilter: {
      padding: '12px 20px',
      border: '2px solid #ddd',
      borderRadius: '10px',
      fontSize: '16px',
      background: 'white',
      minWidth: '150px'
    },
    formsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
      gap: '25px'
    },
    formCard: {
      background: 'white',
      border: '1px solid #e0e0e0',
      borderRadius: '15px',
      padding: '25px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
      transition: 'transform 0.3s, box-shadow 0.3s'
    },
    formIcon: {
      fontSize: '2.5em',
      marginBottom: '10px'
    },
    formTitle: {
      color: '#1976d2',
      margin: '0 0 10px 0',
      fontSize: '1.2em'
    },
    formDescription: {
      color: '#666',
      fontSize: '14px',
      margin: '0 0 15px 0',
      lineHeight: 1.6
    },
    formCategory: {
      display: 'inline-block',
      padding: '3px 10px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: 'bold',
      marginBottom: '15px'
    },
    categoryRegistration: {
      backgroundColor: '#e3f2fd',
      color: '#1976d2'
    },
    categoryMedical: {
      backgroundColor: '#e8f5e9',
      color: '#4caf50'
    },
    categoryLegal: {
      backgroundColor: '#fce4ec',
      color: '#f44336'
    },
    categoryInsurance: {
      backgroundColor: '#fff3e0',
      color: '#ff9800'
    },
    downloadBtn: {
      width: '100%',
      padding: '12px',
      backgroundColor: '#1976d2',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '15px',
      fontWeight: '600',
      transition: 'background 0.3s'
    },
    downloadBtnDisabled: {
      opacity: 0.6,
      cursor: 'not-allowed'
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
    },
    noForms: {
      textAlign: 'center',
      padding: '60px',
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
    emptyIcon: {
      fontSize: '3em',
      margin: 0
    }
  };

  // ============ CATEGORY STYLE FUNCTION ============
  const getCategoryStyle = (category) => {
    const categoryStyles = {
      'Registration': styles.categoryRegistration,
      'Medical': styles.categoryMedical,
      'Legal': styles.categoryLegal,
      'Insurance': styles.categoryInsurance
    };
    return categoryStyles[category] || {};
  };

  const handleDownload = (formId, formTitle) => {
    setDownloading(formId);
    setMessage('');
    
    setTimeout(() => {
      const form = forms.find(f => f.id === formId);
      let content = `
========================================
    DR. JIMMY ORTHOPEDIC CENTER
    ${formTitle.toUpperCase()}
========================================

Patient Name: _________________________
Date: __________________________

`;

      if (form) {
        form.fields.forEach(field => {
          content += `${field}: _________________________\n`;
        });
      }

      content += `
_________________________________________

Signature: ______________________________

Date: ______________________________

FOR OFFICE USE ONLY
_________________________

Please return this form to:
Dr. Jimmy Orthopedic Center
Dar es Salaam, Tanzania
Email: info@drjimmy.com
Phone: +255 712 345 678

This is a demo form. In production, this would be a PDF file.
      `;

      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${formTitle.replace(/\s+/g, '_')}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setDownloading(null);
      setMessage(`✅ ${formTitle} downloaded successfully!`);
      setTimeout(() => setMessage(''), 3000);
    }, 1500);
  };

  const filteredForms = forms.filter(form => {
    const matchesSearch = form.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          form.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || form.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

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
        <p style={{ marginTop: '20px' }}>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h2>Please login to download forms</h2>
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
        <h1 style={styles.headerTitle}>📄 Patient Forms</h1>
        <p style={styles.headerSub}>Download and fill medical forms for your consultation</p>
      </div>

      {/* Message */}
      {message && (
        <div style={{ ...styles.message, ...styles.successMessage }}>
          {message}
        </div>
      )}

      {/* Search and Filter */}
      <div style={styles.searchBox}>
        <input
          type="text"
          placeholder="🔍 Search forms..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          style={styles.categoryFilter}
        >
          <option value="all">All Categories</option>
          <option value="Registration">Registration</option>
          <option value="Medical">Medical</option>
          <option value="Legal">Legal</option>
          <option value="Insurance">Insurance</option>
        </select>
      </div>

      {/* Forms Grid */}
      <div style={styles.formsGrid}>
        {filteredForms.length === 0 ? (
          <div style={styles.noForms}>
            <p style={styles.emptyIcon}>📭</p>
            <p>No forms found matching your search</p>
          </div>
        ) : (
          filteredForms.map((form) => (
            <div 
              key={form.id} 
              style={styles.formCard}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 5px 20px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
              }}
            >
              <div style={styles.formIcon}>{form.icon}</div>
              <h3 style={styles.formTitle}>{form.title}</h3>
              <p style={styles.formDescription}>{form.description}</p>
              <span style={{ ...styles.formCategory, ...getCategoryStyle(form.category) }}>
                {form.category}
              </span>
              <div style={{ fontSize: '12px', color: '#999', marginBottom: '15px', marginTop: '10px' }}>
                {form.fields.length} fields to complete
              </div>
              <button
                onClick={() => handleDownload(form.id, form.title)}
                disabled={downloading === form.id}
                style={{
                  ...styles.downloadBtn,
                  ...(downloading === form.id ? styles.downloadBtnDisabled : {})
                }}
                onMouseEnter={(e) => {
                  if (!downloading) e.currentTarget.style.backgroundColor = '#1565c0';
                }}
                onMouseLeave={(e) => {
                  if (!downloading) e.currentTarget.style.backgroundColor = '#1976d2';
                }}
              >
                {downloading === form.id ? '⏳ Downloading...' : '📥 Download Form'}
              </button>
            </div>
          ))
        )}
      </div>

      {/* Info Box */}
      <div style={styles.infoBox}>
        <h4 style={{ margin: 0, color: '#1976d2' }}>💡 How it works</h4>
        <p style={{ margin: '10px 0 0 0', fontSize: '14px' }}>
          1. Download the form you need<br />
          2. Print and fill it out<br />
          3. Bring it to your appointment or upload it<br />
          4. Dr. Jimmy will review it during your consultation
        </p>
      </div>
    </div>
  );
}

export default PatientForms;

