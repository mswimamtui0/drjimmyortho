import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import HomePage from './HomePage';
import LoginRegister from './LoginRegister';
import DoctorLogin from './DoctorLogin';
import DoctorRegister from './DoctorRegister';
import UploadPage from './UploadPage';
import VideoConsultPage from './VideoConsultPage';
import DoctorDashboard from './DoctorDashboard';
import GlobalOutreach from './GlobalOutreach';
import PaymentPage from './PaymentPage';
import AboutPage from './AboutPage';
import BlogPage from './BlogPage';
import ReviewsComponent from './ReviewsComponent';
import ChatComponent from './ChatComponent';
import PatientDashboard from './PatientDashboard';
import PatientForms from './PatientForms';

// ============ PROTECTED ROUTE COMPONENT ============
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  
  // Wait for auth to load
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #1976d2',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    console.log('🔒 ProtectedRoute: No user, redirecting to login');
    return <Navigate to="/login" replace />;
  }
  
  console.log('🔒 ProtectedRoute: User authenticated:', user.username);
  return children;
}

// ============ APP CONTENT ============
function AppContent() {
  const { user } = useAuth();
  console.log('📱 AppContent - Current user:', user);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginRegister />} />
        <Route path="/doctor-login" element={<DoctorLogin />} />
        <Route path="/doctor-register" element={<DoctorRegister />} />
        <Route path="/global-outreach" element={<GlobalOutreach />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/reviews" element={<ReviewsComponent />} />
        
        {/* Protected Patient Routes */}
        <Route path="/upload" element={
          <ProtectedRoute>
            <UploadPage />
          </ProtectedRoute>
        } />
        <Route path="/video-consult" element={
          <ProtectedRoute>
            <VideoConsultPage />
          </ProtectedRoute>
        } />
        <Route path="/payment" element={
          <ProtectedRoute>
            <PaymentPage />
          </ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <PatientDashboard />
          </ProtectedRoute>
        } />
        <Route path="/forms" element={
          <ProtectedRoute>
            <PatientForms />
          </ProtectedRoute>
        } />
        
        {/* Protected Chat Route */}
        <Route path="/chat/:patientId/:doctorId" element={
          <ProtectedRoute>
            <ChatComponent />
          </ProtectedRoute>
        } />
        
        {/* Doctor Route (No authentication required for now) */}
        <Route path="/doctor" element={<DoctorDashboard />} />
      </Routes>
      
      {/* Loading Animation Style */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </Router>
  );
}

// ============ APP ============
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;


