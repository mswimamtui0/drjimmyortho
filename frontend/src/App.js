import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import LoginRegister from './LoginRegister';
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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginRegister />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/video-consult" element={<VideoConsultPage />} />
        <Route path="/doctor" element={<DoctorDashboard />} />
        <Route path="/global-outreach" element={<GlobalOutreach />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/reviews" element={<ReviewsComponent />} />
        <Route path="/chat/:patientId/:doctorId" element={<ChatComponent />} />
	<Route path="/dashboard" element={<PatientDashboard />} />
	<Route path="/forms" element={<PatientForms />} />
      </Routes>
    </Router>
  );
}

export default App;