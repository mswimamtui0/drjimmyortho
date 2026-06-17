import API_URL from './apiConfig';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function VideoConsultPage() {
  const [user, setUser] = useState(null);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('mpesa');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [consultations, setConsultations] = useState([]);
  const [showPaymentForm, setShowPaymentForm] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
    } else {
      setUser(JSON.parse(userData));
      fetchConsultations(JSON.parse(userData));
    }
  }, [navigate]);

  const fetchConsultations = async (userData) => {
    try {
      const response = await fetch(`http://drjimmy-backend.onrender.com/api/doctor/appointments/`);
      const data = await response.json();
      if (data.success) {
        const userConsults = data.appointments?.filter(
          appt => appt.patient_id === userData.id
        ) || [];
        setConsultations(userConsults);
      }
    } catch (error) {
      console.error('Error fetching consultations:', error);
    }
  };

  const handleBookingWithPayment = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setMessage({ type: 'error', text: 'Please login first to book a consultation' });
      return;
    }
    
    if (!appointmentDate || !appointmentTime) {
      setMessage({ type: 'error', text: 'Please select both date and time' });
      return;
    }

    if (paymentMethod === 'mpesa' && !phoneNumber) {
      setMessage({ type: 'error', text: 'Please enter your M-Pesa phone number' });
      return;
    }

    setLoading(true);
    setMessage({ type: 'info', text: 'Processing your booking and payment...' });
    
    try {
      const response = await fetch(${API_URL}/book-and-pay-consultation/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient_id: user.id,
          date: appointmentDate,
          time: appointmentTime,
          duration: 30,
          notes: notes,
          payment_method: paymentMethod,
          phone_number: phoneNumber
        })
      });
      
      const data = await response.json();
      console.log('Booking response:', data);
      
      if (response.ok && data.success) {
        setPaymentStatus({
          status: 'pending',
          payment_id: data.payment_id,
          reference: data.reference,
          amount: data.amount
        });
        
        setMessage({ 
          type: 'success', 
          text: data.message || '✅ Payment initiated! Check your phone for M-Pesa prompt.' 
        });
        setShowPaymentForm(false);
        fetchConsultations(user);
      } else {
        setMessage({ 
          type: 'error', 
          text: data.error || '❌ Booking failed. Please try again.' 
        });
      }
    } catch (error) {
      console.error('Booking error:', error);
      setMessage({ type: 'error', text: '❌ Error booking consultation. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending_payment: { backgroundColor: '#fff3e0', color: '#ff9800' },
      scheduled: { backgroundColor: '#e3f2fd', color: '#1976d2' },
      completed: { backgroundColor: '#e8f5e9', color: '#4caf50' },
      cancelled: { backgroundColor: '#fce4ec', color: '#f44336' }
    };
    return styles[status] || styles.pending_payment;
  };

  const styles = {
    container: { maxWidth: '1000px', margin: '0 auto', padding: '40px 20px', fontFamily: 'Segoe UI, Arial, sans-serif' },
    header: { textAlign: 'center', marginBottom: '40px' },
    headerTitle: { color: '#1976d2', fontSize: '2.5em', marginBottom: '10px' },
    headerSub: { color: '#666', fontSize: '1.1em' },
    grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' },
    formCard: { background: 'white', border: '1px solid #e0e0e0', borderRadius: '15px', padding: '30px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' },
    formGroup: { marginBottom: '20px' },
    label: { display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#333' },
    input: { width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '16px' },
    textarea: { width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '16px', fontFamily: 'inherit', resize: 'vertical', minHeight: '80px' },
    button: { width: '100%', backgroundColor: '#4caf50', color: 'white', padding: '14px', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' },
    buttonDisabled: { opacity: 0.6, cursor: 'not-allowed' },
    message: { marginTop: '20px', padding: '15px', borderRadius: '8px', fontSize: '14px' },
    successMessage: { backgroundColor: '#d4edda', color: '#155724', borderLeft: '4px solid #4caf50' },
    errorMessage: { backgroundColor: '#f8d7da', color: '#721c24', borderLeft: '4px solid #f44336' },
    infoMessage: { backgroundColor: '#e3f2fd', color: '#0d47a1', borderLeft: '4px solid #1976d2' },
    paymentMethod: { padding: '12px', border: '2px solid #ddd', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' },
    paymentMethodSelected: { borderColor: '#1976d2', backgroundColor: '#e3f2fd' }
  };

  if (!user) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h2>Please login to book a consultation</h2>
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
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>🎥 Video Consultation</h1>
        <p style={styles.headerSub}>Book and pay for your consultation with Dr. Jimmy</p>
      </div>

      <div style={styles.grid}>
        {/* Booking Form */}
        <div style={styles.formCard}>
          <h2 style={{ color: '#1976d2', marginTop: 0 }}>📅 Book & Pay</h2>
          <p style={{ color: '#666' }}>Pay $50 (TZS 120,000) for your consultation</p>

          <form onSubmit={handleBookingWithPayment}>
            <div style={styles.formGroup}>
              <label style={styles.label}>📅 Date *</label>
              <input
                type="date"
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>🕐 Time (East Africa Time) *</label>
              <select
                value={appointmentTime}
                onChange={(e) => setAppointmentTime(e.target.value)}
                required
                style={styles.input}
              >
                <option value="">Select time</option>
                <option value="08:00">8:00 AM</option>
                <option value="09:00">9:00 AM</option>
                <option value="10:00">10:00 AM</option>
                <option value="11:00">11:00 AM</option>
                <option value="14:00">2:00 PM</option>
                <option value="15:00">3:00 PM</option>
                <option value="16:00">4:00 PM</option>
                <option value="17:00">5:00 PM</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>📝 Notes for Dr. Jimmy</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Describe your symptoms, questions, or any specific concerns..."
                style={styles.textarea}
                rows="3"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>💳 Payment Method *</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div 
                  style={{
                    ...styles.paymentMethod,
                    ...(paymentMethod === 'mpesa' ? styles.paymentMethodSelected : {})
                  }}
                  onClick={() => setPaymentMethod('mpesa')}
                >
                  <span>📱</span>
                  <span><strong>M-Pesa</strong> (Tanzania)</span>
                </div>
                <div 
                  style={{
                    ...styles.paymentMethod,
                    ...(paymentMethod === 'card' ? styles.paymentMethodSelected : {})
                  }}
                  onClick={() => setPaymentMethod('card')}
                >
                  <span>💳</span>
                  <span><strong>Credit/Debit Card</strong></span>
                </div>
              </div>
            </div>

            {paymentMethod === 'mpesa' && (
              <div style={styles.formGroup}>
                <label style={styles.label}>📱 M-Pesa Phone Number *</label>
                <input
                  type="tel"
                  placeholder="e.g., 0712345678"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                  style={styles.input}
                />
                <p style={{ fontSize: '12px', color: '#999', marginTop: '5px' }}>
                  You will receive a prompt on this phone to enter your PIN
                </p>
              </div>
            )}

            <div style={{ ...styles.formGroup, backgroundColor: '#e8f5e9', padding: '15px', borderRadius: '8px' }}>
              <p style={{ margin: 0 }}>
                <strong>Total Amount:</strong> TZS 120,000 ($50 USD)
              </p>
              <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#666' }}>
                Payment includes consultation and Zoom meeting
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.button,
                ...(loading ? styles.buttonDisabled : {})
              }}
            >
              {loading ? '⏳ Processing...' : '💳 Book & Pay Now'}
            </button>
          </form>

          {message && (
            <div style={{
              ...styles.message,
              ...(message.type === 'success' ? styles.successMessage : {}),
              ...(message.type === 'error' ? styles.errorMessage : {}),
              ...(message.type === 'info' ? styles.infoMessage : {})
            }}>
              {message.text}
            </div>
          )}

          {paymentStatus && paymentStatus.status === 'pending' && (
            <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#fff3e0', borderRadius: '8px' }}>
              <h4>⏳ Payment Pending</h4>
              <p>Reference: {paymentStatus.reference}</p>
              <p>Amount: TZS {paymentStatus.amount}</p>
              <p style={{ fontSize: '14px', color: '#666' }}>
                {paymentMethod === 'mpesa' 
                  ? 'Check your phone for M-Pesa prompt. Enter PIN to complete payment.'
                  : 'Complete card payment using the link provided.'}
              </p>
            </div>
          )}
        </div>

        {/* Upcoming Consultations */}
        <div style={styles.formCard}>
          <h2 style={{ color: '#1976d2', marginTop: 0 }}>📋 Your Consultations</h2>
          <p style={{ color: '#666' }}>View your upcoming and past consultations</p>

          {consultations.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#f5f5f5', borderRadius: '10px' }}>
              <p style={{ fontSize: '2em', margin: 0 }}>📭</p>
              <p style={{ color: '#666' }}>No consultations yet</p>
              <p style={{ fontSize: '14px', color: '#999' }}>Book your first consultation above</p>
            </div>
          ) : (
            <div style={{ maxHeight: '450px', overflowY: 'auto' }}>
              {consultations.map((consult) => {
                const statusStyle = getStatusBadge(consult.status);
                return (
                  <div key={consult.id} style={{ border: '1px solid #ddd', borderRadius: '10px', padding: '15px', marginBottom: '15px', backgroundColor: '#f8f9fa' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{ fontWeight: 'bold', color: '#1976d2' }}>📅 {consult.scheduled_date}</span>
                      <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', ...statusStyle }}>
                        {consult.status === 'pending_payment' ? '⏳ Payment Pending' : consult.status}
                      </span>
                    </div>
                    {consult.zoom_link && consult.status === 'scheduled' && (
                      <a href={consult.zoom_link} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', backgroundColor: '#1976d2', color: 'white', padding: '8px 15px', borderRadius: '5px', textDecoration: 'none', marginTop: '10px', fontSize: '14px' }}>
                        🎥 Join Zoom Meeting
                      </a>
                    )}
                    {consult.status === 'pending_payment' && (
                      <p style={{ fontSize: '13px', color: '#ff9800', marginTop: '10px' }}>
                        ⚠️ Awaiting payment confirmation
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#e3f2fd', borderRadius: '10px', textAlign: 'center' }}>
        <h3 style={{ color: '#1976d2' }}>✅ Payment Before Consultation</h3>
        <p>All consultations require payment before booking to confirm your appointment.</p>
        <p style={{ fontSize: '14px' }}>
          <strong>Accepted Payments:</strong> M-Pesa, Airtel Money, Credit/Debit Cards
        </p>
        <p style={{ fontSize: '14px' }}>
          📧 Confirmation email sent after successful payment
        </p>
      </div>
    </div>
  );
}

export default VideoConsultPage;
