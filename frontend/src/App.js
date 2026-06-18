import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import HomePage from './HomePage';
import LoginRegister from './LoginRegister';
import DoctorLogin from './DoctorLogin';
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
import DoctorRegister from './DoctorRegister';

// Protected Route Component
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function AppContent() {
  const { user } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginRegister />} />
        <Route path="/doctor-login" element={<DoctorLogin />} />
	<Route path="/doctor-register" element={<DoctorRegister />} />
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
        <Route path="/doctor" element={<DoctorDashboard />} />
        <Route path="/global-outreach" element={<GlobalOutreach />} />
        <Route path="/payment" element={
          <ProtectedRoute>
            <PaymentPage />
          </ProtectedRoute>
        } />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/reviews" element={<ReviewsComponent />} />
        <Route path="/chat/:patientId/:doctorId" element={<ChatComponent />} />
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
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;